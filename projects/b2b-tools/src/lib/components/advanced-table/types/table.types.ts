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

export type CellSize = 'XS' | 'SM' | 'MD' | 'LG' | 'XL' | 'AUTO';
export type TextAlign = 'left' | 'center' | 'right';

export type RowId = string | number;
export type PagerItem = number | '…';

export type Icon = 'edit' | 'delete' | 'view' | 'copy';

export interface TableColumn<T = unknown> {
  key: string;
  label: string;
  type: CellDataType;
  size?: CellSize;
  align?: TextAlign;
  sortable?: boolean;
  filterable?: boolean;
  hidden?: boolean;

  valueGetter?: (row: T) => unknown;
  formatter?: (value: unknown, row: T) => string;
  actions?: TableAction<T>[];
  options?: {
    currency?: 'MXN';
    dateFormat?: 'short' | 'medium' | 'long';
    dateTimeFormat?: 'short' | 'medium' | 'long';
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

export interface TableConfig {
  globalSearch?: boolean;
  columnFilters?: boolean;
  selectable?: boolean;
  selectionMode?: 'single' | 'multiple';
  pagination?: { enabled: boolean;  pageSize: number; pageSizeOptions?: number[]; };
  scroll?: { mode: 'none' | 'infinite'; heightPx?: number; batchSize?: number; };
  fixedRowCount?: number;
  emptyText?: string;
  rowIdKey?: string;
  rowIdGetter?: (row: any) => string | number;
  globalSearchVisibleOnly?: boolean;
}

export interface TableSortState {
  key: string;
  dir: 'asc' | 'desc';
}

export type ActionVariant = 'default' | 'danger';
export type ActionRender = 'icon' | 'text';

export interface TableAction<T> {
  id: string;
  label: string;
  icon?: Icon | string;
  tooltip?: string;
  variant?: ActionVariant;
  render?: ActionRender;
  visible?: (row: T) => boolean;
  disabled?: (row: T) => boolean;
  confirm?: { title?: string; message: string; };
}

export interface TableActionEvent<T> {
  actionId: string;
  row: T;
}

export const SVG_ICONS: Record<string, string> =  {
  edit: '<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24"><path fill="currentColor" d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h8.925l-2 2H5v14h14v-6.95l2-2V19q0 .825-.587 1.413T19 21zm4-6v-4.25l9.175-9.175q.3-.3.675-.45t.75-.15q.4 0 .763.15t.662.45L22.425 3q.275.3.425.663T23 4.4t-.137.738t-.438.662L13.25 15zM21.025 4.4l-1.4-1.4zM11 13h1.4l5.8-5.8l-.7-.7l-.725-.7L11 11.575zm6.5-6.5l-.725-.7zl.7.7z"/></svg>',
  delete: '<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24"><path fill="currentColor" d="M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zM17 6H7v13h10zM9 17h2V8H9zm4 0h2V8h-2zM7 6v13z"/></svg>',
  open: '<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 14 14"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"><path d="M7 3.625c-4.187 0-5.945 3.766-5.945 3.844S2.813 11.312 7 11.312s5.945-3.765 5.945-3.843S11.187 3.625 7 3.625M2.169 5.813L.61 4.252m4.525-.354L4.5 1.843m7.331 3.97l1.559-1.56m-4.525-.355L9.5 1.843"/><path d="M5.306 7.081a1.738 1.738 0 1 0 3.388.776a1.738 1.738 0 1 0-3.388-.776"/></g></svg>',
  copy: '<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24"><path fill="currentColor" d="M9 18q-.825 0-1.412-.587T7 16V4q0-.825.588-1.412T9 2h9q.825 0 1.413.588T20 4v12q0 .825-.587 1.413T18 18zm-4 4q-.825 0-1.412-.587T3 20V6h2v14h11v2z"/></svg>'
}