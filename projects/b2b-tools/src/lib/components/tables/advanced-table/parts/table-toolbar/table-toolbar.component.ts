import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  HostListener,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TableI18n } from '../../types/table-i18n.type';
import { TableRefreshConfig } from '../../types/table.types';
import { TABLE_I18N_DEFAULT } from '../../constants/table-i18n.constants';

export interface ColumnToggleItem {
  key: string;
  label: string;
  visible: boolean;
}

const REFRESH_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4z"/></svg>`;
const COLUMNS_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M3 5h18v2H3zm0 4h18v2H3zm0 4h18v2H3zm0 4h18v2H3z"/></svg>`;

@Component({
  selector: 'table-toolbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table-toolbar.component.html',
  styleUrls: ['./table-toolbar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableToolbarComponent implements OnInit {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly destroyRef = inject(DestroyRef);
  private readonly elRef = inject(ElementRef);
  private _timer: ReturnType<typeof setInterval> | null = null;

  readonly enabled = input<boolean>(true);
  readonly query = input<string>('');
  readonly showClear = input<boolean>(true);
  readonly i18n = input<TableI18n>(TABLE_I18N_DEFAULT);
  readonly refreshConfig = input<TableRefreshConfig | undefined>(undefined);
  readonly columnVisibility = input<boolean>(false);
  readonly columnsForToggle = input<ColumnToggleItem[]>([]);

  readonly queryChange = output<string>();
  readonly clear = output<void>();
  readonly refresh = output<void>();
  readonly columnToggle = output<string>();
  readonly columnReset = output<void>();

  readonly selectedInterval = signal<number | null>(null);
  readonly customMode = signal<boolean>(false);
  readonly customValue = signal<number>(1);
  readonly customUnit = signal<'s' | 'min'>('min');
  readonly panelOpen = signal<boolean>(false);
  readonly refreshSvg: SafeHtml;
  readonly columnsSvg: SafeHtml;

  readonly hasHiddenColumns = computed(() => this.columnsForToggle().some((c) => !c.visible));
  readonly hiddenCount = computed(() => this.columnsForToggle().filter((c) => !c.visible).length);
  readonly onlyOneVisible = computed(() => this.columnsForToggle().filter((c) => c.visible).length <= 1);

  constructor() {
    this.refreshSvg = this.sanitizer.bypassSecurityTrustHtml(REFRESH_SVG);
    this.columnsSvg = this.sanitizer.bypassSecurityTrustHtml(COLUMNS_SVG);

    effect(() => {
      const interval = this.selectedInterval();
      const config = this.refreshConfig();

      if (this._timer) {
        clearInterval(this._timer);
        this._timer = null;
      }

      if (config?.enabled && interval !== null && interval > 0) {
        this._timer = setInterval(() => this.refresh.emit(), interval * 1000);
      }
    });

    this.destroyRef.onDestroy(() => {
      if (this._timer) clearInterval(this._timer);
    });
  }

  ngOnInit() {
    const config = this.refreshConfig();
    if (config?.defaultInterval !== undefined) {
      const def = config.defaultInterval ?? null;
      this.selectedInterval.set(def);
      if (def !== null && config.allowCustomInterval) {
        const presets = config.intervals ?? [30, 60, 120, 300];
        if (!presets.includes(def)) {
          this.customMode.set(true);
          if (def % 60 === 0) {
            this.customUnit.set('min');
            this.customValue.set(def / 60);
          } else {
            this.customUnit.set('s');
            this.customValue.set(def);
          }
        }
      }
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.panelOpen()) return;
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.panelOpen.set(false);
    }
  }

  onInput(value: string) {
    this.queryChange.emit(value);
  }

  onClear() {
    this.clear.emit();
  }

  onRefresh() {
    this.refresh.emit();
  }

  onIntervalChange(value: string) {
    if (value === 'custom') {
      this.customMode.set(true);
      const v = this.customValue();
      this.selectedInterval.set(v > 0 ? this.toSeconds(v, this.customUnit()) : null);
    } else {
      this.customMode.set(false);
      this.selectedInterval.set(value === '' ? null : Number(value));
    }
  }

  onCustomValueChange(val: string) {
    const n = parseInt(val, 10);
    const valid = Number.isFinite(n) && n > 0;
    this.customValue.set(valid ? n : 0);
    this.selectedInterval.set(valid ? this.toSeconds(n, this.customUnit()) : null);
  }

  onCustomUnitChange(val: string) {
    const unit = val === 'min' ? 'min' : 's';
    this.customUnit.set(unit);
    const v = this.customValue();
    this.selectedInterval.set(v > 0 ? this.toSeconds(v, unit) : null);
  }

  private toSeconds(value: number, unit: 's' | 'min'): number {
    return unit === 'min' ? value * 60 : value;
  }

  togglePanel() {
    this.panelOpen.update((v) => !v);
  }

  onColumnToggle(key: string, currentlyVisible: boolean) {
    if (currentlyVisible && this.onlyOneVisible()) return;
    this.columnToggle.emit(key);
  }

  onColumnReset() {
    this.columnReset.emit();
  }

  formatInterval(seconds: number): string {
    if (seconds < 60) return `${seconds} s`;
    const mins = seconds / 60;
    return mins === 1 ? '1 min' : `${mins} min`;
  }

  refreshIntervals(): number[] {
    return this.refreshConfig()?.intervals ?? [30, 60, 120, 300];
  }
}
