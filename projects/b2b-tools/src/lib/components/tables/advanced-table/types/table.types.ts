export type CellDataType =
  | 'string'
  | 'integer'
  | 'decimal'
  | 'currency'
  | 'date'
  | 'datetime'
  | 'boolean'
  | 'image'
  | 'status'
  | 'link'
  | 'custom'
  | 'actions';

export type CellSize = 'XS' | 'SM' | 'MD' | 'LG' | 'XL' | 'AUTO-XL' | 'AUTO';
export type TextAlign = 'left' | 'center' | 'right';

export type RowId = string | number;
export type PagerItem = number | '…';

export type Icon = 'edit' | 'delete' | 'view' | 'copy' | 'activate';

export interface TableColumn<T = unknown> {
  key: string;
  label: string;
  type: CellDataType;
  size?: CellSize;
  align?: TextAlign;
  sortable?: boolean;
  filterable?: boolean;
  hidden?: boolean;

  wrap?: boolean;

  valueGetter?: (row: T) => unknown;
  formatter?: (value: unknown, row: T) => string;
  actions?: TableAction<T>[];
  options?: {
    currency?: 'MXN';
    dateFormat?: 'short' | 'medium' | 'long' | Intl.DateTimeFormatOptions;
    dateTimeFormat?: 'short' | 'medium' | 'long' | Intl.DateTimeFormatOptions;
    image?: {
      hidden?: boolean;
      openInModal?: boolean;
      showFull?: boolean;
      alt?: (row: T) => string;
    };
    status?: {
      classMap?: Record<string, string>;
    };
    link?: {
      hrefGetter?: (row: T) => string;
      labelGetter?: (row: T) => string;
      target?: '_blank' | '_self';
    };
  };
}

export interface TableRefreshConfig {
  enabled: boolean;
  autoRefresh?: boolean;
  intervals?: number[];
  defaultInterval?: number | null;
  allowCustomInterval?: boolean;
}

export type TableCacheConfig =
  | { enabled: false; key?: string }
  | { enabled: true; key: string };

export interface TableColumnSearchEvent {
  attribute: string;
  value: string;
}

export interface TableConfig {
  globalSearch?: boolean;
  columnFilters?: boolean;
  serverSearch?: boolean;
  searchDebounceMs?: number;
  selectable?: boolean;
  selectionMode?: 'single' | 'multiple';
  pagination?: { enabled: boolean; pageSize: number; pageSizeOptions?: number[]; mode?: 'client' | 'server' };
  scroll?: { mode: 'none' | 'infinite'; heightPx?: number; batchSize?: number };
  fixedRowCount?: number;
  emptyText?: string;
  rowIdKey?: string;
  rowIdGetter?: (row: any) => string | number;
  globalSearchVisibleOnly?: boolean;
  refresh?: TableRefreshConfig;
  columnVisibility?: boolean;
  cache?: TableCacheConfig;
}

export interface TableSortState {
  key: string;
  dir: 'asc' | 'desc';
}

export interface TablePaginationChange {
  page: number;
  pageSize: number;
}

export type ActionVariant = 'default' | 'danger' | 'success' | 'warning';
export type ActionRender = 'icon' | 'text' | 'toggle';

export interface TableAction<T> {
  id: string;
  label: string;
  icon?: Icon | string;
  tooltip?: string | ((row: T) => string);
  variant?: ActionVariant;
  render?: ActionRender;
  visible?: (row: T) => boolean;
  disabled?: (row: T) => boolean;
  confirm?: { title?: string; message: string };
  stateGetter?: (row: T) => boolean;
}

export interface TableActionEvent<T> {
  actionId: string;
  row: T;
}

export const SVG_ICONS: Record<string, string> = {
  edit: '<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24"><path fill="currentColor" d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h8.925l-2 2H5v14h14v-6.95l2-2V19q0 .825-.587 1.413T19 21zm4-6v-4.25l9.175-9.175q.3-.3.675-.45t.75-.15q.4 0 .763.15t.662.45L22.425 3q.275.3.425.663T23 4.4t-.137.738t-.438.662L13.25 15zM21.025 4.4l-1.4-1.4zM11 13h1.4l5.8-5.8l-.7-.7l-.725-.7L11 11.575zm6.5-6.5l-.725-.7zl.7.7z"/></svg>',
  delete:
    '<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24"><path fill="currentColor" d="M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zM17 6H7v13h10zM9 17h2V8H9zm4 0h2V8h-2zM7 6v13z"/></svg>',
  open: '<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 14 14"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"><path d="M7 3.625c-4.187 0-5.945 3.766-5.945 3.844S2.813 11.312 7 11.312s5.945-3.765 5.945-3.843S11.187 3.625 7 3.625M2.169 5.813L.61 4.252m4.525-.354L4.5 1.843m7.331 3.97l1.559-1.56m-4.525-.355L9.5 1.843"/><path d="M5.306 7.081a1.738 1.738 0 1 0 3.388.776a1.738 1.738 0 1 0-3.388-.776"/></g></svg>',
  copy: '<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24"><path fill="currentColor" d="M9 18q-.825 0-1.412-.587T7 16V4q0-.825.588-1.412T9 2h9q.825 0 1.413.588T20 4v12q0 .825-.587 1.413T18 18zm-4 4q-.825 0-1.412-.587T3 20V6h2v14h11v2z"/></svg>',
  activate: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42C17.99 7.86 19 9.81 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.19 1.01-4.14 2.58-5.42L6.17 5.17C4.23 6.82 3 9.26 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.74-1.23-5.18-3.17-6.83z"/></svg>',
};
