import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
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

const REFRESH_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4z"/></svg>`;

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
  private _timer: ReturnType<typeof setInterval> | null = null;

  readonly enabled = input<boolean>(true);
  readonly query = input<string>('');
  readonly showClear = input<boolean>(true);
  readonly i18n = input<TableI18n>(TABLE_I18N_DEFAULT);
  readonly refreshConfig = input<TableRefreshConfig | undefined>(undefined);

  readonly queryChange = output<string>();
  readonly clear = output<void>();
  readonly refresh = output<void>();

  readonly selectedInterval = signal<number | null>(null);
  readonly refreshSvg: SafeHtml;

  constructor() {
    this.refreshSvg = this.sanitizer.bypassSecurityTrustHtml(REFRESH_SVG);

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
      this.selectedInterval.set(config.defaultInterval ?? null);
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
    this.selectedInterval.set(value === '' ? null : Number(value));
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
