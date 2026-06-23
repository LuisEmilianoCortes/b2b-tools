import { afterNextRender, ChangeDetectionStrategy, Component, computed, effect, Input, input, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import {
  CellDataType,
  PagerItem,
  RowId,
  TableActionEvent,
  TableCacheConfig,
  TableColumn,
  TableColumnSearchEvent,
  TableConfig,
  TablePaginationChange,
  TableSortState,
} from './types/table.types';

interface TableCacheSchema {
  columnVisibility: Record<string, boolean>;
}
import { TableModalImageComponent } from './parts/table-modal-image/table-modal-image.component';
import { TableGridComponent } from './parts/table-grid/table-grid.component';
import { TablePaginationComponent } from './parts/table-pagination/table-pagination.component';
import { TableToolbarComponent } from './parts/table-toolbar/table-toolbar.component';
import { TABLE_I18N_BY_LANG, TABLE_LANG_DEFAULT } from './constants/table-i18n.constants';
import { TableI18n, TableLang } from './types/table-i18n.type';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  readonly serverTotalCount = input<number>(0);

  @Input()
  set lang(value: TableLang | undefined) {
    this._lang.set(value ?? TABLE_LANG_DEFAULT);
  }

  @Input()
  set i18n(value: Partial<TableI18n> | undefined) {
    this._override.set(value ?? {});
  }

  // Outputs
  readonly rowClick = output<T>();
  readonly selectionChange = output<RowId[]>();
  readonly actionClick = output<TableActionEvent<T>>();
  readonly pageChange = output<TablePaginationChange>();
  readonly refresh = output<void>();
  readonly globalSearchChange = output<string>();
  readonly columnSearchChange = output<TableColumnSearchEvent>();
  readonly searchClear = output<void>();

  // Server-side search subjects
  private readonly _globalSearchSubject = new Subject<string>();
  private readonly _columnSearchSubject = new Subject<TableColumnSearchEvent>();

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
  readonly columnVisibilityOverrides = signal<Record<string, boolean>>({});
  private _lang = signal<TableLang>(TABLE_LANG_DEFAULT);
  private _override = signal<Partial<TableI18n>>({});
  private readonly _cacheReady = signal(false);

  constructor() {
    afterNextRender(() => {
      const cache = this.config().cache;
      if (cache?.enabled === true) {
        this.loadCacheState(cache);
      }
      this._cacheReady.set(true);
    });

    this._globalSearchSubject
      .pipe(debounceTime(300), takeUntilDestroyed())
      .subscribe((q) => this.globalSearchChange.emit(q));

    this._columnSearchSubject
      .pipe(debounceTime(300), takeUntilDestroyed())
      .subscribe((e) => this.columnSearchChange.emit(e));
  }

  // Computed Data
  readonly selectedIds = computed<RowId[]>(() => Array.from(this.selectedIdsSet()));
  readonly visibleColumns = computed(() => {
    const overrides = this.columnVisibilityOverrides();
    return (this.columns() ?? []).filter((c) =>
      c.key in overrides ? !overrides[c.key] : !c.hidden,
    );
  });
  readonly columnsForToggle = computed(() => {
    const overrides = this.columnVisibilityOverrides();
    return (this.columns() ?? [])
      .filter((c) => c.type !== 'actions')
      .map((c) => ({
        key: c.key,
        label: c.label,
        visible: c.key in overrides ? !overrides[c.key] : !c.hidden,
      }));
  });
  readonly showSelectionColumn = computed(() => !!this.config().selectable);
  readonly gridTemplateColumns = computed(() => {
    const cols: string[] = [];
    const hasFlexCol = this.visibleColumns().some(
      (c) => !c.size || c.size === 'AUTO' || c.size === 'AUTO-XL',
    );

    if (this.showSelectionColumn()) cols.push('48px'); // selección

    for (const c of this.visibleColumns()) {
      cols.push(this.sizeToCss(c.size, !hasFlexCol));
    }
    return cols.join(' ');
  });

  readonly minTableWidth = computed(() => {
    let total = this.showSelectionColumn() ? 48 : 0;
    for (const c of this.visibleColumns()) {
      total += this.sizeToMinPx(c.size);
    }
    return total;
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
      // column filters (AND) — skip columns handled server-side
      for (const [key, q] of Object.entries(columnQueries)) {
        const query = (q ?? '').trim().toLowerCase();
        if (!query) continue;

        const col = colsAll.find((c) => c.key === key);
        if (!col) continue;

        const effectiveMode = col.searchMode ?? (config.serverSearch ? 'server' : 'local');
        if (effectiveMode === 'server') continue;

        const value = this.getCellValue(row, col);
        const text = this.valueToSearchableText(value, col.type, row).toLowerCase();

        if (!text.includes(query)) return false;
      }

      // global search (OR across columns) — only when client-side
      if (config.globalSearch && globalQuery && !config.serverSearch) {
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
      if (config.pagination.mode === 'server') return cappedRows;
      const size = this.pageSize();
      if (size === 0) return cappedRows; // show all
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
  readonly totalCount = computed(() => {
    const config = this.config();
    if (config.pagination?.mode === 'server') return this.serverTotalCount();
    return this.sortedData().length;
  });
  readonly pageCount = computed(() => {
    const config = this.config();
    if (!config.pagination?.enabled) return 1;
    const size = this.pageSize();
    if (size === 0) return 1;
    return Math.max(1, Math.ceil(this.totalCount() / size));
  });
  readonly isAllSelectedOnPage = computed(() => {
    if (!this.showSelectionColumn()) return false;
    const ids = this.pagedData().map((r) => this.getRowId(r));
    if (ids.length === 0) return false;

    const set = this.selectedIdsSet();
    return ids.every((id) => set.has(id));
  });
  protected i18nCom = computed<TableI18n>(() => {
    const base = TABLE_I18N_BY_LANG[this._lang()];
    const override = this._override();
    return { ...base, ...override };
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
  serverPageEffect = effect(() => {
    const config = this.config();
    if (config.pagination?.mode !== 'server') return;
    this.pageChange.emit({ page: this.page(), pageSize: this.pageSize() });
  });
  columnVisibilityCacheEffect = effect(() => {
    if (!this._cacheReady()) return;
    const cache = this.config().cache;
    if (cache?.enabled !== true) return;
    this.saveCacheState(cache);
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
    if (!Number.isFinite(size) || size < 0) return;
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
    if (this.config().serverSearch) {
      this._globalSearchSubject.next(query ?? '');
    }
  }

  setColumnQuery(key: string, query: string) {
    const next = { ...this.columnQueries() };
    next[key] = query ?? '';
    this.columnQueries.set(next);
    this.page.set(1);
    this.resetInfiniteIfNeeded();

    const col = this.columns().find((c) => c.key === key);
    const effectiveMode = col?.searchMode ?? (this.config().serverSearch ? 'server' : 'local');
    if (effectiveMode === 'server') {
      this._columnSearchSubject.next({ attribute: key, value: query ?? '' });
    }
  }

  clearFilters() {
    this.globalQuery.set('');
    this.columnQueries.set({});
    this.page.set(1);
    this.resetInfiniteIfNeeded();
    const hasServerColumns = this.columns().some((c) => c.searchMode === 'server');
    if (this.config().serverSearch || hasServerColumns) {
      this.searchClear.emit();
    }
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

  toggleColumnVisibility(key: string) {
    const col = this.columnsForToggle().find((c) => c.key === key);
    if (!col) return;
    if (col.visible && this.columnsForToggle().filter((c) => c.visible).length <= 1) return;
    this.columnVisibilityOverrides.update((prev) => ({ ...prev, [key]: col.visible }));
  }

  resetColumnVisibility() {
    this.columnVisibilityOverrides.set({});
  }

  // Private functions
  private loadCacheState(cfg: TableCacheConfig & { enabled: true }): void {
    try {
      const raw = localStorage.getItem(cfg.key);
      if (raw === null) return;
      const parsed: unknown = JSON.parse(raw);
      if (
        typeof parsed === 'object' &&
        parsed !== null &&
        'columnVisibility' in parsed &&
        typeof (parsed as TableCacheSchema).columnVisibility === 'object'
      ) {
        this.columnVisibilityOverrides.set(
          (parsed as TableCacheSchema).columnVisibility,
        );
      }
    } catch {
      // Malformed JSON or blocked storage — use defaults
    }
  }

  private saveCacheState(cfg: TableCacheConfig & { enabled: true }): void {
    try {
      const payload: TableCacheSchema = {
        columnVisibility: this.columnVisibilityOverrides(),
      };
      localStorage.setItem(cfg.key, JSON.stringify(payload));
    } catch {
      // Storage quota exceeded or blocked — silently ignore
    }
  }

  private resetInfiniteIfNeeded() {
    const config = this.config();
    if ((config.scroll?.mode ?? 'none') !== 'infinite') return;
    const batch = config.scroll?.batchSize ?? 50;
    this.visibleCount.set(batch);
  }

  private sizeToCss(size?: string, expand = false): string {
    const fixed = (px: number) => (expand ? `minmax(${px}px, 1fr)` : `${px}px`);
    switch (size) {
      case 'XS':
        return fixed(80);
      case 'SM':
        return fixed(120);
      case 'MD':
        return fixed(180);
      case 'LG':
        return fixed(260);
      case 'XL':
        return fixed(360);
      case 'AUTO-XL':
        return 'minmax(360px, 1fr)';
      case 'AUTO':
      default:
        return 'minmax(240px, 1fr)';
    }
  }

  private sizeToMinPx(size?: string): number {
    switch (size) {
      case 'XS':
        return 80;
      case 'SM':
        return 120;
      case 'MD':
        return 180;
      case 'LG':
        return 260;
      case 'XL':
        return 360;
      case 'AUTO-XL':
        return 360;
      default:
        return 240; // AUTO
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

  private valueToSearchableText(value: unknown, type: CellDataType, _row: T): string {
    if (value == null) return '';
    if (type === 'image') return '';
    if (type === 'boolean') return value === true ? 'si true yes 1' : 'no false 0';
    return String(value);
  }
}
