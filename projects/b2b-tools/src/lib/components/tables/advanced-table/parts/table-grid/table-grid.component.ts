import { CommonModule } from '@angular/common';
import { afterNextRender, ChangeDetectionStrategy, Component, computed, DestroyRef, effect, ElementRef, inject, input, output, signal } from '@angular/core';
import {
  TableColumn,
  TableConfig,
  TableSortState,
  RowId,
  TableAction,
  TableActionEvent,
  SVG_ICONS,
} from '../../types/table.types';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TimeZoneInfo, TIME_ZONES } from '../../types/time-zone.types';
import { TABLE_I18N_DEFAULT } from '../../constants/table-i18n.constants';
import { TableI18n } from '../../types/table-i18n.type';
import { getCellValue } from '../../../../../utils/table-value.util';
import { TableCellFormatPipe } from '../../../../../utils/table-cell-format.pipe';

@Component({
  selector: 'table-grid',
  standalone: true,
  imports: [CommonModule, TableCellFormatPipe],
  templateUrl: './table-grid.component.html',
  styleUrls: ['./table-grid.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableGridComponent<T extends Record<string, any>> {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);

  // Inputs
  readonly config = input<TableConfig>({});
  readonly columns = input<TableColumn<T>[]>([]);
  readonly rows = input<T[]>([]);
  readonly gridTemplateColumns = input<string>('');
  readonly minTableWidth = input<number>(0);
  readonly columnQueries = input<Record<string, string>>({});
  readonly sortState = input<TableSortState | null>(null);
  readonly selectedIdsSet = input<Set<RowId>>(new Set<RowId>());
  readonly timeZone = input<TimeZoneInfo>(TIME_ZONES.MEXICO_CITY);
  readonly i18n = input<TableI18n>(TABLE_I18N_DEFAULT);

  // Outputs
  readonly headerSort = output<TableColumn<T>>();
  readonly columnQueryChange = output<{ key: string; value: string }>();
  readonly rowClick = output<T>();
  readonly toggleRow = output<T>();
  readonly toggleAllOnPage = output<void>();
  readonly openImage = output<{ src: string; alt: string }>();
  readonly actionClick = output<TableActionEvent<T>>();
  readonly bodyScroll = output<Event>();

  readonly showSelectionColumn = computed(() => !!this.config().selectable);
  readonly isXOverflowing = signal(false);

  constructor() {
    afterNextRender(() => {
      const container = this.el.nativeElement.querySelector('.dt-xscroll') as HTMLElement | null;
      if (!container) return;
      const ro = new ResizeObserver(() => this._checkOverflow());
      ro.observe(container);
      this.destroyRef.onDestroy(() => ro.disconnect());
      this._checkOverflow();
    });
  }

  overflowCheckEffect = effect(() => {
    this.minTableWidth();
    requestAnimationFrame(() => this._checkOverflow());
  });

  // Cell value access
  getCellValue(row: T, col: TableColumn<T>): unknown {
    return getCellValue(row, col);
  }

  // Selection
  getRowId(row: T): RowId {
    const getter = this.config().rowIdGetter;
    if (getter) return getter(row);
    return row?.[this.config().rowIdKey ?? 'id'];
  }

  isSelected(row: T): boolean {
    return this.selectedIdsSet().has(this.getRowId(row));
  }

  isAllSelectedOnPage(): boolean {
    const rows = this.rows();
    if (!rows.length) return false;
    const set = this.selectedIdsSet();
    return rows.every((r) => set.has(this.getRowId(r)));
  }

  // Sort
  getSortIcon(colKey: string): string {
    const sorted = this.sortState();
    if (!sorted || sorted.key !== colKey) return '↕';
    return sorted.dir === 'asc' ? '↑' : '↓';
  }

  // Cell display helpers (for non-format types handled in template)
  getImageSrc(row: T, col: TableColumn<T>): string {
    const value = getCellValue(row, col);
    return value == null ? '' : String(value);
  }

  getImageAlt(row: T, col: TableColumn<T>): string {
    const altFn = col.options?.image?.alt;
    return altFn ? altFn(row) : col.label;
  }

  getStatusClass(row: T, col: TableColumn<T>): string {
    const raw = String(getCellValue(row, col) ?? '');
    return col.options?.status?.classMap?.[raw] ?? '';
  }

  getLinkHref(row: T, col: TableColumn<T>): string {
    const getter = col.options?.link?.hrefGetter;
    return getter ? getter(row) : String(getCellValue(row, col) ?? '');
  }

  getLinkLabel(row: T, col: TableColumn<T>): string {
    const getter = col.options?.link?.labelGetter;
    if (getter) return getter(row);
    const value = getCellValue(row, col);
    return value == null ? '' : String(value);
  }

  // Actions
  getColumnActions(col: TableColumn<T>): TableAction<T>[] {
    return col.actions ?? [];
  }

  isActionVisible(action: TableAction<T>, row: T): boolean {
    return action.visible ? action.visible(row) : true;
  }

  isActionDisabled(action: TableAction<T>, row: T): boolean {
    return action.disabled ? action.disabled(row) : false;
  }

  getActionBtnClass(action: TableAction<T>): string {
    return 'dt-action-btn dt-action--' + (action.variant ?? 'default');
  }

  getActionTooltip(action: TableAction<T>, row: T): string {
    const tip = action.tooltip ?? action.label;
    return typeof tip === 'function' ? tip(row) : tip;
  }

  getActionToggleState(action: TableAction<T>, row: T): boolean {
    return action.stateGetter ? action.stateGetter(row) : false;
  }

  getActionSvg(action: TableAction<T>): SafeHtml | string {
    const key = (action.icon ?? action.id).toLowerCase();
    return this.sanitizer.bypassSecurityTrustHtml(SVG_ICONS[key] ?? '*');
  }

  emitAction(action: TableAction<T>, row: T, event: Event) {
    event.stopPropagation();
    this.actionClick.emit({ actionId: action.id, row });
  }

  // Event forwarders
  onHeaderClickSort(column: TableColumn<T>) {
    if (column.sortable) this.headerSort.emit(column);
  }

  onColumnQueryInput(key: string, value: string) {
    this.columnQueryChange.emit({ key, value });
  }

  onRowClick(row: T) { this.rowClick.emit(row); }
  onToggleRow(row: T) { this.toggleRow.emit(row); }
  onToggleAllOnPage() { this.toggleAllOnPage.emit(); }

  onOpenImage(src: string, alt: string, event: Event) {
    event.stopPropagation();
    this.openImage.emit({ src, alt });
  }

  onBodyScroll(event: Event) { this.bodyScroll.emit(event); }

  private _checkOverflow(): void {
    const container = this.el.nativeElement.querySelector('.dt-xscroll') as HTMLElement | null;
    if (!container) return;
    this.isXOverflowing.set(container.scrollWidth > container.clientWidth);
  }
}
