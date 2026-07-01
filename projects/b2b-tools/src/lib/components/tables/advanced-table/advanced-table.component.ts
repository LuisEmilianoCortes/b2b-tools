import { afterNextRender, ChangeDetectionStrategy, Component, computed, effect, Input, input, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, timer } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
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
import { TableModalImageComponent } from './parts/table-modal-image/table-modal-image.component';
import { TableGridComponent } from './parts/table-grid/table-grid.component';
import { TablePaginationComponent } from './parts/table-pagination/table-pagination.component';
import { TableToolbarComponent } from './parts/table-toolbar/table-toolbar.component';
import { TABLE_I18N_BY_LANG, TABLE_LANG_DEFAULT } from './constants/table-i18n.constants';
import { TableI18n, TableLang } from './types/table-i18n.type';
import { compareValues, getCellValue, valueToSearchableText } from '../../../utils/table-value.util';
import { filterRows } from '../../../utils/table-filter.util';
import { getStored, setStored } from '../../../utils/storage.util';

interface TableCacheSchema {
  columnVisibility: Record<string, boolean>;
}

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
        this._loadCacheState(cache);
      }
      this._cacheReady.set(true);
    });

    this._globalSearchSubject
      .pipe(
        switchMap((q) => timer(this.config().searchDebounceMs ?? 300).pipe(map(() => q))),
        takeUntilDestroyed(),
      )
      .subscribe((q) => this.globalSearchChange.emit(q));

    this._columnSearchSubject
      .pipe(
        switchMap((e) => timer(this.config().searchDebounceMs ?? 300).pipe(map(() => e))),
        takeUntilDestroyed(),
      )
      .subscribe((e) => this.columnSearchChange.emit(e));
  }

  // Computed
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
    if (this.showSelectionColumn()) cols.push('48px');
    for (const c of this.visibleColumns()) {
      cols.push(this._sizeToCss(c.size, !hasFlexCol));
    }
    return cols.join(' ');
  });
  readonly minTableWidth = computed(() => {
    let total = this.showSelectionColumn() ? 48 : 0;
    for (const c of this.visibleColumns()) {
      total += this._sizeToMinPx(c.size);
    }
    return total;
  });
  readonly filteredData = computed(() => {
    const config = this.config();
    const colsAll = this.columns() ?? [];
    const colsVisible = this.visibleColumns();
    const colsForGlobal = (config.globalSearchVisibleOnly ?? true)
      ? colsVisible
      : colsAll.filter((c) => !c.hidden);

    return filterRows(this.data() ?? [], {
      globalQuery: this.globalQuery(),
      columnQueries: this.columnQueries(),
      colsForGlobal,
      colsAll,
      serverSearch: config.serverSearch,
      config,
    });
  });
  readonly sortedData = computed(() => {
    const data = [...this.filteredData()];
    const sort = this.sortState();
    if (!sort) return data;

    const col = (this.columns() ?? []).find((c) => c.key === sort.key);
    if (!col) return data;

    const dir = sort.dir === 'asc' ? 1 : -1;
    data.sort((a, b) => dir * compareValues(getCellValue(a, col), getCellValue(b, col), col.type));
    return data;
  });
  readonly pagedData = computed(() => {
    const config = this.config();
    const rows = this.sortedData();
    const fixedN = config.fixedRowCount;
    const capped = typeof fixedN === 'number' && fixedN > 0 ? rows.slice(0, fixedN) : rows;

    const mode = config.scroll?.mode ?? 'none';
    if (mode === 'infinite') return capped.slice(0, this.visibleCount());

    if (config.pagination?.enabled) {
      if (config.pagination.mode === 'server') return capped;
      const size = this.pageSize();
      if (size === 0) return capped;
      const start = (this.page() - 1) * size;
      return capped.slice(start, start + size);
    }

    return capped;
  });
  readonly pagerItems = computed<PagerItem[]>(() => {
    if (!this.config().pagination?.enabled) return [];
    const total = this.pageCount();
    const current = this.page();
    if (total <= 1) return [];
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

    const items: PagerItem[] = [1];
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);

    if (start > 2) items.push('…');
    for (let p = start; p <= end; p++) items.push(p);
    if (end < total - 1) items.push('…');
    items.push(total);

    return items;
  });
  readonly totalCount = computed(() => {
    const config = this.config();
    if (config.pagination?.mode === 'server') return this.serverTotalCount();
    return this.sortedData().length;
  });
  readonly pageCount = computed(() => {
    if (!this.config().pagination?.enabled) return 1;
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
  protected i18nCom = computed<TableI18n>(() => ({
    ...TABLE_I18N_BY_LANG[this._lang()],
    ...this._override(),
  }));

  // Effects
  infiniteScrollEffect = effect(() => {
    const config = this.config();
    const mode = config.scroll?.mode ?? 'none';
    const batch = config.scroll?.batchSize ?? 50;
    this.visibleCount.set(mode === 'infinite' ? batch : Number.MAX_SAFE_INTEGER);
  });
  selectionDataEffect = effect(() => {
    this.selectionChange.emit(this.selectedIds());
  });
  pagesCountEffect = effect(() => {
    const total = this.pageCount();
    if (this.page() > total) this.page.set(total);
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
    this._saveCacheState(cache);
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
    const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 120;
    if (!nearBottom) return;
    const batch = config.scroll?.batchSize ?? 50;
    this.visibleCount.set(Math.min(this.sortedData().length, this.visibleCount() + batch));
  }

  onPageSizeChange(size: number) {
    if (!Number.isFinite(size) || size < 0) return;
    this.pageSize.set(size);
    this.page.set(1);
  }

  getCellValue(row: T, col: TableColumn<T>): unknown {
    return getCellValue(row, col);
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
    this._resetInfiniteIfNeeded();
    if (this.config().serverSearch) this._globalSearchSubject.next(query ?? '');
  }

  setColumnQuery(key: string, query: string) {
    this.columnQueries.update((prev) => ({ ...prev, [key]: query ?? '' }));
    this.page.set(1);
    this._resetInfiniteIfNeeded();
    const col = this.columns().find((c) => c.key === key);
    if ((col?.searchMode ?? this.config().columnSearchMode ?? 'local') === 'server') {
      this._columnSearchSubject.next({ attribute: key, value: query ?? '' });
    }
  }

  clearFilters() {
    this.globalQuery.set('');
    this.columnQueries.set({});
    this.page.set(1);
    this._resetInfiniteIfNeeded();
    const hasServerColumns = this.columns().some(
      (c) => (c.searchMode ?? this.config().columnSearchMode ?? 'local') === 'server',
    );
    if (this.config().serverSearch || hasServerColumns) this.searchClear.emit();
  }

  onRowClick(row: T) { this.rowClick.emit(row); }

  toggleRowSelection(row: T) {
    const config = this.config();
    if (!config.selectable) return;
    const id = this.getRowId(row);
    const mode = config.selectionMode ?? 'multiple';
    const set = new Set(this.selectedIdsSet());
    if (mode === 'single') {
      if (set.has(id)) set.clear();
      else { set.clear(); set.add(id); }
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

  prevPage() { this.page.set(Math.max(1, this.page() - 1)); }
  nextPage() { this.page.set(Math.min(this.pageCount(), this.page() + 1)); }
  goToPage(p: number) { this.page.set(Math.max(1, Math.min(this.pageCount(), p))); }

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

  resetColumnVisibility() { this.columnVisibilityOverrides.set({}); }

  // Private helpers
  private _loadCacheState(cfg: TableCacheConfig & { enabled: true }): void {
    const parsed = getStored<TableCacheSchema | null>(cfg.key, null);
    if (parsed && typeof parsed === 'object' && 'columnVisibility' in parsed) {
      this.columnVisibilityOverrides.set(parsed.columnVisibility);
    }
  }

  private _saveCacheState(cfg: TableCacheConfig & { enabled: true }): void {
    setStored(cfg.key, { columnVisibility: this.columnVisibilityOverrides() });
  }

  private _resetInfiniteIfNeeded() {
    const config = this.config();
    if ((config.scroll?.mode ?? 'none') !== 'infinite') return;
    this.visibleCount.set(config.scroll?.batchSize ?? 50);
  }

  private _sizeToCss(size?: string, expand = false): string {
    const fixed = (px: number) => (expand ? `minmax(${px}px, 1fr)` : `${px}px`);
    switch (size) {
      case 'XS': return fixed(80);
      case 'SM': return fixed(120);
      case 'MD': return fixed(180);
      case 'LG': return fixed(260);
      case 'XL': return fixed(360);
      case 'AUTO-XL': return 'minmax(360px, 1fr)';
      default: return 'minmax(240px, 1fr)';
    }
  }

  private _sizeToMinPx(size?: string): number {
    switch (size) {
      case 'XS': return 80;
      case 'SM': return 120;
      case 'MD': return 180;
      case 'LG': return 260;
      case 'XL': return 360;
      case 'AUTO-XL': return 360;
      default: return 240;
    }
  }
}
