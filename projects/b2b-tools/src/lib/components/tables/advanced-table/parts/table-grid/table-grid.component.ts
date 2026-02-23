import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import {
  TableColumn,
  TableConfig,
  TableSortState,
  RowId,
  TableAction,
  TableActionEvent,
  SVG_ICONS
} from '../../types/table.types';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TimeZoneInfo, TIME_ZONES } from '../../types/time-zone.types';

@Component({
  selector: 'table-grid',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table-grid.component.html',
  styleUrls: ['./table-grid.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableGridComponent<T extends Record<string, any>> {
  private sanitizer = inject(DomSanitizer);

  // Inputs
  readonly config = input<TableConfig>({});
  readonly columns = input<TableColumn<T>[]>([]);
  readonly rows = input<T[]>([]);
  readonly gridTemplateColumns = input<string>('');
  readonly columnQueries = input<Record<string, string>>({});
  readonly sortState = input<TableSortState | null>(null);
  readonly selectedIdsSet = input<Set<RowId>>(new Set<RowId>());
  readonly timeZone = input<TimeZoneInfo>(TIME_ZONES.MEXICO_CITY);

  // Outputs
  readonly headerSort = output<TableColumn<T>>();
  readonly columnQueryChange = output<{ key: string; value: string }>();
  readonly rowClick = output<T>();
  readonly toggleRow = output<T>();
  readonly toggleAllOnPage = output<void>();
  readonly openImage = output<{ src: string; alt: string }>();
  readonly actionClick = output<TableActionEvent<T>>();
  readonly bodyScroll = output<Event>();

  // Derived
  readonly showSelectionColumn = computed(() => !!this.config().selectable);

  // Helpers
  private getRowIdKey(): string {
    return this.config().rowIdKey ?? 'id';
  }

  getRowId(row: T): RowId {
    const getter = this.config().rowIdGetter;
    if (getter) return getter(row);
    const key = this.getRowIdKey();
    return row?.[key];
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

  getSortIcon(colKey: string): string {
    const sorted = this.sortState();
    if (!sorted || sorted.key !== colKey) return '↕';
    return sorted.dir === 'asc' ? '↑' : '↓';
  }

  getDisplayText(row: T, column: TableColumn<T>): string {
    const value = this.getCellValue(row, column);

    if (column.formatter) {
      try {
        return column.formatter(value, row);
      } catch {
        return '';
      }
    }

    switch (column.type) {
      case 'string':
        return value == null ? '' : String(value);

      case 'integer':
      case 'decimal':
      case 'currency': {
        const currencyValue = Number(value);
        if (!Number.isFinite(currencyValue)) return value == null ? '' : String(value);
        if (column.type === 'currency') {
          try {
            return new Intl.NumberFormat(this.timeZone().locale, {
              style: 'currency',
              currency: column.options?.currency ?? this.timeZone().currency,
              maximumFractionDigits: 2,
            }).format(currencyValue);
          } catch {
            return String(currencyValue);
          }
        }
        return String(currencyValue);
      }

      case 'date':
      case 'datetime': {
        const dateTime = value instanceof Date ? value : new Date(String(value));
        if (Number.isNaN(dateTime.getTime())) return value == null ? '' : String(value);

        const locale = this.timeZone().locale;
        return column.type === 'datetime'
          ? dateTime.toLocaleString(locale)
          : dateTime.toLocaleDateString(locale);
      }

      case 'boolean':
        return value ? 'Sí' : 'No';

      default:
        return value == null ? '' : String(value);
    }
  }

  getImageSrc(row: T, col: TableColumn<T>): string {
    return this.getCellString(row, col);
  }

  getImageAlt(row: T, col: TableColumn<T>): string {
    const altFn = col.options?.image?.alt;
    return altFn ? altFn(row) : col.label;
  }

  getStatusClass(row: T, col: TableColumn<T>): string {
    const raw = this.getCellString(row, col);
    return col.options?.status?.classMap?.[raw] ?? '';
  }

  getLinkHref(row: T, col: TableColumn<T>): string {
    const getter = col.options?.link?.hrefGetter;
    return getter ? getter(row) : this.getCellString(row, col);
  }

  getLinkLabel(row: T, col: TableColumn<T>): string {
    const getter = col.options?.link?.labelGetter;
    if (getter) return getter(row);
    const cellValue = this.getCellValue(row, col);
    return cellValue == null ? '' : String(cellValue);
  }

  getColumnActions(col: TableColumn<T>): TableAction<T>[] {
    return col.actions ?? [];
  }

  isActionVisible(action: TableAction<T>, row: T): boolean {
    return action.visible ? action.visible(row) : true;
  }

  isActionDisabled(action: TableAction<T>, row: T): boolean {
    return action.disabled ? action.disabled(row) : false;
  }

  emitAction(action: TableAction<T>, row: T, event: Event) {
    event.stopPropagation();
    this.actionClick.emit({ actionId: action.id, row });
  }

  getActionSvg(action: TableAction<T>): SafeHtml | string {
    const key = (action.icon ?? action.id).toLowerCase();
    return this.sanitizer.bypassSecurityTrustHtml(SVG_ICONS[key] ?? '*');
  }

  onHeaderClickSort(column: TableColumn<T>) {
    if (!column.sortable) return;
    this.headerSort.emit(column);
  }

  onColumnQueryInput(key: string, value: string) {
    this.columnQueryChange.emit({ key, value });
  }

  onRowClick(row: T) {
    this.rowClick.emit(row);
  }

  onToggleRow(row: T) {
    this.toggleRow.emit(row);
  }

  onToggleAllOnPage() {
    this.toggleAllOnPage.emit();
  }

  onOpenImage(src: string, alt: string, event: Event) {
    event.stopPropagation();
    this.openImage.emit({ src, alt });
  }

  onBodyScroll(event: Event) {
    this.bodyScroll.emit(event);
  }

  private getCellValue(row: T, col: TableColumn<T>): unknown {
    if (col.valueGetter) {
      try {
        return col.valueGetter(row);
      } catch {
        return null;
      }
    }
    return row?.[col.key];
  }

  private getCellString(row: T, col: TableColumn<T>): string {
    const value = this.getCellValue(row, col);
    return value == null ? '' : String(value);
  }
}
