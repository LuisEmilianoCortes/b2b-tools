import { Component, computed, effect, input, output, signal } from '@angular/core';
import {
  CellDataType,
  PagerItem,
  RowId,
  TableActionEvent,
  TableColumn,
  TableConfig,
  TableSortState,
} from './types/table.types';
import { TableModalImageComponent } from './parts/table-modal-image/table-modal-image.component';
import { TableGridComponent } from './parts/table-grid/table-grid.component';
import { TablePaginationComponent } from './parts/table-pagination/table-pagination.component';
import { TableToolbarComponent } from './parts/table-toolbar/table-toolbar.component';

@Component({
  selector: 'advanced-table',
  imports: [
    TableModalImageComponent,
    TableGridComponent,
    TablePaginationComponent,
    TableToolbarComponent,
  ],
  templateUrl: './advanced-table.component.html',
  styleUrl: './advanced-table.component.css',
})
export class AdvancedTable<T extends Record<string, any>> {
  // Inputs
  readonly columns = input<TableColumn<T>[]>([]);
  readonly data = input<T[]>([]);
  readonly config = input<TableConfig>({
    globalSearch: true,
    columnFilters: false,
    selectable: false,
    selectionMode: 'multiple',
    pagination: { enabled: false, pageSize: 10, pageSizeOptions: [10, 25, 50] },
    scroll: { mode: 'none' },
    emptyText: 'Sin resultados',
    rowIdKey: 'id',
    globalSearchVisibleOnly: true,
  });

  // Outputs
  readonly rowClick = output<T>();
  readonly selectionChange = output<RowId[]>();
  readonly actionClick = output<TableActionEvent<T>>();

  // Signals
  readonly globalQuery = signal<string>('');
  readonly columnQueries = signal<Record<string, string>>({});
  readonly sortState = signal<TableSortState | null>(null);
  readonly page = signal<number>(1);
  readonly visibleCount = signal<number>(0);
  readonly modalOpen = signal<boolean>(false);
  readonly modalImageSrc = signal<string>('');
  readonly modalImageAlt = signal<string>('');
  readonly selectedIdsSet = signal<Set<RowId>>(new Set<RowId>());
  readonly pageSize = signal<number>(this.config().pagination?.pageSize ?? 10);

  // Computed Data
  readonly selectedIds = computed<RowId[]>(() => Array.from(this.selectedIdsSet()));
  readonly visibleColumns = computed(() => (this.columns() ?? []).filter((c) => !c.hidden));
  readonly showSelectionColumn = computed(() => !!this.config().selectable);
  readonly gridTemplateColumns = computed(() => {
    const cols: string[] = [];

    if (this.showSelectionColumn()) cols.push('48px'); // selección

    for (const c of this.visibleColumns()) {
      cols.push(this.sizeToCss(c.size));
    }
    return cols.join(' ');
  });
  readonly filteredData = computed(() => {
    const rows = this.data() ?? [];
    const colsAll = this.columns() ?? [];
    const colsVisible = this.visibleColumns();
    const config = this.config();

    const globalQuery = this.globalQuery().trim().toLowerCase();
    const columnQueries = this.columnQueries();

    const colsForGlobal =
      (config.globalSearchVisibleOnly ?? true) ? colsVisible : colsAll.filter((c) => !c.hidden);

    return rows.filter((row) => {
      // column filters (AND)
      for (const [key, q] of Object.entries(columnQueries)) {
        const query = (q ?? '').trim().toLowerCase();
        if (!query) continue;

        const col = colsAll.find((c) => c.key === key);
        if (!col) continue;

        const value = this.getCellValue(row, col);
        const text = this.valueToSearchableText(value, col.type, row).toLowerCase();

        if (!text.includes(query)) return false;
      }

      // global search (OR across columns)
      if (config.globalSearch && globalQuery) {
        let any = false;
        for (const col of colsForGlobal) {
          const value = this.getCellValue(row, col);
          const text = this.valueToSearchableText(value, col.type, row).toLowerCase();
          if (text.includes(globalQuery)) {
            any = true;
            break;
          }
        }
        if (!any) return false;
      }

      return true;
    });
  });
  readonly sortedData = computed(() => {
    const data = [...this.filteredData()];
    const sort = this.sortState();
    if (!sort) return data;

    const col = (this.columns() ?? []).find((c) => c.key === sort.key);
    if (!col) return data;

    const dir = sort.dir === 'asc' ? 1 : -1;

    data.sort((a, b) => {
      const va = this.getCellValue(a, col);
      const vb = this.getCellValue(b, col);
      return dir * this.compareValues(va, vb, col.type);
    });

    return data;
  });
  readonly pagedData = computed(() => {
    const config = this.config();
    const rows = this.sortedData();
    const fixedN = config.fixedRowCount;
    const cappedRows = typeof fixedN === 'number' && fixedN > 0 ? rows.slice(0, fixedN) : rows;

    const mode = config.scroll?.mode ?? 'none';
    if (mode === 'infinite') {
      return cappedRows.slice(0, this.visibleCount());
    }

    // pagination
    if (config.pagination?.enabled) {
      const size = this.pageSize();
      const page = this.page();
      const start = (page - 1) * size;
      return cappedRows.slice(start, start + size);
    }

    return cappedRows;
  });
  readonly pagerItems = computed<PagerItem[]>(() => {
    const config = this.config();
    if (!config.pagination?.enabled) return [];

    const totalPages = this.pageCount();
    const current = this.page();

    if (totalPages <= 1) return [];

    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const items: PagerItem[] = [];
    const first = 1;
    const last = totalPages;
    const around = 1;

    const start = Math.max(2, current - around);
    const end = Math.min(last - 1, current + around);

    items.push(first);

    if (start > 2) items.push('…');

    for (let p = start; p <= end; p++) {
      items.push(p);
    }

    if (end < last - 1) items.push('…');

    items.push(last);

    return items;
  });
  readonly totalCount = computed(() => this.sortedData().length);
  readonly pageCount = computed(() => {
    const config = this.config();
    if (!config.pagination?.enabled) return 1;
    return Math.max(1, Math.ceil(this.totalCount() / this.pageSize()));
  });
  readonly isAllSelectedOnPage = computed(() => {
    if (!this.showSelectionColumn()) return false;
    const ids = this.pagedData().map((r) => this.getRowId(r));
    if (ids.length === 0) return false;

    const set = this.selectedIdsSet();
    return ids.every((id) => set.has(id));
  });

  // Effects
  infiniteScrollEffect = effect(() => {
    const config = this.config();
    const mode = config.scroll?.mode ?? 'none';
    const batch = config.scroll?.batchSize ?? 50;

    if (mode === 'infinite') {
      this.visibleCount.set(batch);
    } else {
      this.visibleCount.set(Number.MAX_SAFE_INTEGER);
    }
  });
  selectionDataEffect = effect(() => {
    this.selectionChange.emit(this.selectedIds());
  });
  pagesCountEffect = effect(() => {
    const totalPages = this.pageCount();
    if (this.page() > totalPages) {
      this.page.set(totalPages);
    }
  });

  // UI Actions
  onHeaderClickSort(col: TableColumn<T>) {
    if (!col.sortable) return;
    const current = this.sortState();
    if (!current || current.key !== col.key) {
      this.sortState.set({ key: col.key, dir: 'asc' });
    } else if (current.dir === 'asc') {
      this.sortState.set({ key: col.key, dir: 'desc' });
    } else {
      this.sortState.set(null);
    }
    this.page.set(1);
  }

  onBodyScroll(event: Event) {
    const config = this.config();
    if ((config.scroll?.mode ?? 'none') !== 'infinite') return;

    const el = event.target as HTMLElement;
    const thresholdPx = 120;
    const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - thresholdPx;

    if (!nearBottom) return;

    const batch = config.scroll?.batchSize ?? 50;
    const next = Math.min(this.sortedData().length, this.visibleCount() + batch);
    this.visibleCount.set(next);
  }

  onPageSizeChange(size: number) {
    if (!Number.isFinite(size) || size <= 0) return;
    this.pageSize.set(size);
    this.page.set(1);
  }

  getCellValue(row: T, col: TableColumn<T>): unknown {
    try {
      return col.valueGetter ? col.valueGetter(row) : row?.[col.key];
    } catch {
      return undefined;
    }
  }

  getRowId(row: T): RowId {
    const config = this.config();
    if (config.rowIdGetter) return config.rowIdGetter(row) as RowId;

    const key = config.rowIdKey ?? 'id';
    const value = row?.[key];
    return (value ?? JSON.stringify(row)) as RowId;
  }

  setGlobalQuery(query: string) {
    this.globalQuery.set(query ?? '');
    this.page.set(1);
    this.resetInfiniteIfNeeded();
  }

  setColumnQuery(key: string, query: string) {
    const next = { ...this.columnQueries() };
    next[key] = query ?? '';
    this.columnQueries.set(next);
    this.page.set(1);
    this.resetInfiniteIfNeeded();
  }

  clearFilters() {
    this.globalQuery.set('');
    this.columnQueries.set({});
    this.page.set(1);
    this.resetInfiniteIfNeeded();
  }

  onRowClick(row: T) {
    this.rowClick.emit(row);
  }

  toggleRowSelection(row: T) {
    const config = this.config();
    if (!config.selectable) return;

    const id = this.getRowId(row);
    const mode = config.selectionMode ?? 'multiple';

    const set = new Set(this.selectedIdsSet());
    if (mode === 'single') {
      if (set.has(id)) set.clear();
      else {
        set.clear();
        set.add(id);
      }
    } else {
      if (set.has(id)) set.delete(id);
      else set.add(id);
    }
    this.selectedIdsSet.set(set);
  }

  toggleSelectAllOnPage() {
    const config = this.config();
    if (!config.selectable) return;
    if ((config.selectionMode ?? 'multiple') === 'single') return;

    const ids = this.pagedData().map((r) => this.getRowId(r));
    const set = new Set(this.selectedIdsSet());

    const allSelected = ids.every((id) => set.has(id));
    if (allSelected) ids.forEach((id) => set.delete(id));
    else ids.forEach((id) => set.add(id));

    this.selectedIdsSet.set(set);
  }

  prevPage() {
    this.page.set(Math.max(1, this.page() - 1));
  }

  nextPage() {
    this.page.set(Math.min(this.pageCount(), this.page() + 1));
  }

  goToPage(p: number) {
    const clamped = Math.max(1, Math.min(this.pageCount(), p));
    this.page.set(clamped);
  }

  openImageModal(src: string, alt: string) {
    this.modalImageSrc.set(src);
    this.modalImageAlt.set(alt);
    this.modalOpen.set(true);
  }

  closeModal() {
    this.modalOpen.set(false);
    this.modalImageSrc.set('');
    this.modalImageAlt.set('');
  }

  // Private functions
  private resetInfiniteIfNeeded() {
    const config = this.config();
    if ((config.scroll?.mode ?? 'none') !== 'infinite') return;
    const batch = config.scroll?.batchSize ?? 50;
    this.visibleCount.set(batch);
  }

  private sizeToCss(size?: string): string {
    switch (size) {
      case 'XS':
        return '80px';
      case 'SM':
        return '120px';
      case 'MD':
        return '180px';
      case 'LG':
        return '260px';
      case 'XL':
        return '360px';
      case 'AUTO':
      default:
        return '1fr';
    }
  }

  private toNumber(value: unknown): number {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      return Number(value.replace(/,/g, '').trim());
    }
    return Number.NaN;
  }

  private toDate(value: unknown): Date | null {
    if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
    if (typeof value === 'string' || typeof value === 'number') {
      const date = new Date(value);
      return Number.isNaN(date.getTime()) ? null : date;
    }
    return null;
  }

  private compareValues(firstValue: unknown, secondValue: unknown, type: CellDataType): number {
    const firstNull = firstValue == null || firstValue === '';
    const secondNull = secondValue == null || secondValue === '';
    if (firstNull && secondNull) return 0;
    if (firstNull) return 1;
    if (secondNull) return -1;

    let response: number | null = null;
    switch (type) {
      case 'integer':
      case 'decimal':
      case 'currency': {
        const firstNumber = this.toNumber(firstValue);
        const secondNumber = this.toNumber(secondValue);
        if (!Number.isFinite(firstNumber) && !Number.isFinite(secondNumber)) response = 0;
        else if (!Number.isFinite(firstNumber)) response = 1;
        else if (!Number.isFinite(secondNumber)) response = -1;
        else response = firstNumber === secondNumber ? 0 : firstNumber < secondNumber ? -1 : 1;
        break;
      }

      case 'date':
      case 'datetime': {
        const firstDate = this.toDate(firstValue);
        const toCompareDate = this.toDate(secondValue);
        if (!firstDate && !toCompareDate) response = 0;
        else if (!firstDate) response = 1;
        else if (!toCompareDate) response = -1;
        else {
          const ta = firstDate.getTime();
          const tb = toCompareDate.getTime();
          response = ta === tb ? 0 : ta < tb ? -1 : 1;
        }
        break;
      }

      case 'boolean': {
        const firstBool = firstValue === true ? 1 : 0;
        const secondBool = secondValue === true ? 1 : 0;
        response = firstBool - secondBool;
        break;
      }

      default: {
        const firstString = String(firstValue).toLowerCase();
        const secondString = String(secondValue).toLowerCase();
        response = firstString.localeCompare(secondString, 'es');
        break;
      }
    }
    return response;
  }

  private valueToSearchableText(value: unknown, type: CellDataType, row: T): string {
    if (value == null) return '';
    if (type === 'image') return '';
    if (type === 'boolean') return value === true ? 'si true yes 1' : 'no false 0';
    return String(value);
  }
}
