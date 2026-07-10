**b2b-tools** is an Angular 21 standalone component library for enterprise UIs. Zero runtime dependencies beyond Angular itself. Signals-based reactivity, strict TypeScript, and full CSS variable theming.

[![Angular](https://img.shields.io/badge/Angular-21-red?logo=angular)](https://angular.io/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![npm version](https://img.shields.io/npm/v/b2b-tools.svg)](https://www.npmjs.com/package/b2b-tools)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](#)

---

## Index

- [Installation](#installation)
- [Components](#components)
  - [AdvancedCard](#advancedcard)
  - [AdvancedTable](#advancedtable)
    - [Server-side Pagination](#server-side-pagination)
    - [Per-column Search Mode](#per-column-search-mode)
    - [Show All Rows](#show-all-rows)
  - [SimpleTable](#simpletable)
  - [AdvancedSelect](#advancedselect)
  - [AdvancedInput](#advancedinput)
  - [AdvancedButton](#advancedbutton)
  - [AdvancedModal](#advancedmodal)
- [Theming](#theming)
  - [CSS Variables Reference](#css-variables-reference)
  - [Color Customization](#color-customization)
  - [Density & Size Variants](#density--size-variants)
- [i18n](#i18n)
- [Types Reference](#types-reference)

---

## Installation

```bash
npm install b2b-tools
```

**Peer dependencies** (must already be in your project):

```json
"@angular/common": "^21.1.0",
"@angular/core": "^21.1.0"
```

---

## Components

### AdvancedCard

A configurable card with compact and expanded modes. Expansion can render inline, in a drawer, or in a modal. Supports highlight metrics, summary blocks, tabs, header actions, and custom template projection.

> **v1.6.1** — Highlight values/labels and summary block label/value cells now wrap to multiple lines instead of being truncated when content is wider than the available column.

#### Import

```ts
import { AdvancedCard, AdvancedCardTemplateDirective } from 'b2b-tools';
```

#### Selector

```html
<advanced-card />
```

#### Inputs

| Input               | Type                 | Default      | Description                                         |
| ------------------- | -------------------- | ------------ | --------------------------------------------------- |
| `config`            | `AdvancedCardConfig` | **required** | Full card configuration object                      |
| `fullWidthOnExpand` | `boolean`            | `true`       | Expanded inline view takes full width               |
| `stickyHeader`      | `boolean`            | `true`       | Header stays fixed while scrolling expanded content |
| `closeOnEsc`        | `boolean`            | `true`       | Press Escape closes drawer/modal                    |

#### Outputs

| Output           | Payload                                               | Description                     |
| ---------------- | ----------------------------------------------------- | ------------------------------- |
| `expandedChange` | `boolean`                                             | Fires when card opens or closes |
| `action`         | `{ actionId: string; cardId: string }`                | Header action button clicked    |
| `tabChanged`     | `{ tabId: string; cardId: string }`                   | Active tab changed              |
| `tabAction`      | `{ tabId: string; actionId: string; cardId: string }` | Action inside a tab clicked     |

#### AdvancedCardConfig

```ts
interface AdvancedCardConfig {
  id: string; // Unique card identifier
  title: string; // Card title
  subtitle?: string; // Secondary line below title
  badge?: AdvancedBadge; // Status badge on header
  highlights?: AdvancedHighlight[]; // Metric pills shown in compact view
  summaryBlocks?: AdvancedSummaryBlock[]; // Collapsible data blocks in expanded view
  primaryCta?: { label: string }; // Primary expand button label
  actions?: AdvancedAction[]; // Header action buttons
  tabs?: AdvancedCardTab[]; // Tab definitions
  defaultTabId?: string; // Tab active by default
  expandMode?: AdvancedExpandMode; // 'inline' | 'drawer' | 'modal'
  closeOnBackdrop?: boolean; // Click backdrop to close drawer/modal
  density?: AdvancedDensity; // 'compact' | 'comfortable'
  size?: AdvancedSize; // 'sm' | 'md' | 'lg'
  contentLayout?: 'stacked' | 'inline'; // Summary blocks layout
  summaryToggle?: boolean; // Allow collapsing summary blocks
  data?: any; // Arbitrary payload forwarded to templates
}
```

#### Supporting Types

```ts
type AdvancedTone = 'primary' | 'success' | 'warning' | 'danger' | 'neutral';
type AdvancedExpandMode = 'inline' | 'drawer' | 'modal';
type AdvancedDensity = 'compact' | 'comfortable';
type AdvancedSize = 'sm' | 'md' | 'lg';
type AdvancedTabKind = 'template' | 'text' | 'empty';

interface AdvancedBadge {
  label: string;
  tone?: AdvancedTone;
}

interface AdvancedHighlight {
  label: string;
  value: string; // Long values wrap to a new line — the highlight cell grows in height
  hint?: string;
}

interface AdvancedAction {
  id: string;
  label: string;
  tone?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
}

interface AdvancedCardTab {
  id: string;
  label: string;
  kind: AdvancedTabKind; // 'template' | 'text' | 'empty'
  text?: string; // Content when kind = 'text'
  templateId?: string; // Matches advancedCardTemplate directive
  actions?: AdvancedTabAction[];
  pill?: { label: string; tone?: AdvancedTone };
}

interface AdvancedSummaryBlock {
  title: string;
  rows: AdvancedSummaryRow[];
}

interface AdvancedSummaryRow {
  label: string; // Wraps to multiple lines when wider than the 40% label column
  value: string; // Wraps to multiple lines when wider than the 60% value column
  kind?: AdvancedRowKind;
  tone?: AdvancedTone;
  icon?: string;
}
```

#### Template Projection

Use `advancedCardTemplate` directive to project custom content into tabs of `kind: 'template'`. The `templateId` must match the tab's `templateId`.

```ts
import { AdvancedCard, AdvancedCardTemplateDirective } from 'b2b-tools';

@Component({
  imports: [AdvancedCard, AdvancedCardTemplateDirective],
  template: `
    <advanced-card [config]="config" (action)="onAction($event)">
      <ng-template advancedCardTemplate="details" let-cardId="cardId" let-tabId="tabId">
        <p>
          Custom content for card <strong>{{ cardId }}</strong>
        </p>
      </ng-template>
    </advanced-card>
  `,
})
export class MyComponent {
  config: AdvancedCardConfig = {
    id: 'order-001',
    title: 'Order #1042',
    subtitle: 'Pending review',
    badge: { label: 'Pending', tone: 'warning' },
    highlights: [
      { label: 'Total', value: '$4,200.00' },
      { label: 'Items', value: '12' },
    ],
    expandMode: 'drawer',
    tabs: [
      { id: 'details', label: 'Details', kind: 'template', templateId: 'details' },
      { id: 'notes', label: 'Notes', kind: 'text', text: 'No notes yet.' },
    ],
    actions: [
      { id: 'approve', label: 'Approve', tone: 'primary' },
      { id: 'reject', label: 'Reject', tone: 'danger' },
    ],
  };
}
```

#### Expansion Modes

| Mode     | Behavior                                      |
| -------- | --------------------------------------------- |
| `inline` | Card expands in place, pushing content below  |
| `drawer` | Slides up from the bottom as an overlay panel |
| `modal`  | Centered modal dialog with backdrop           |

---

### AdvancedTable

A full-featured data table. Generic over your row type `T`. Supports global search, per-column filters, multi-column sorting, pagination or infinite scroll, single/multiple row selection, and rich cell types.

#### Import

```ts
import { AdvancedTable } from 'b2b-tools';
```

#### Selector

```html
<advanced-table />
```

#### Inputs

| Input              | Type                 | Default    | Description                                                             |
| ------------------ | -------------------- | ---------- | ----------------------------------------------------------------------- |
| `columns`          | `TableColumn<T>[]`   | `[]`       | Column definitions                                                      |
| `data`             | `T[]`                | `[]`       | Row data                                                                |
| `config`           | `TableConfig`        | see below  | Table behavior configuration                                            |
| `i18n`             | `Partial<TableI18n>` | EN strings | Override any translation string                                         |
| `lang`             | `'EN' \| 'ES'`       | `'EN'`     | Built-in language preset                                                |
| `serverTotalCount` | `number`             | `0`        | Total record count from API. Required when `pagination.mode = 'server'` |

#### Outputs

| Output               | Payload                  | Description                                                                                 |
| -------------------- | ------------------------ | ------------------------------------------------------------------------------------------- |
| `rowClick`           | `T`                      | Row clicked                                                                                 |
| `selectionChange`    | `RowId[]`                | Selected row IDs changed                                                                    |
| `actionClick`        | `TableActionEvent<T>`    | Action button clicked                                                                       |
| `pageChange`         | `TablePaginationChange`  | Fires on page or page-size change when `pagination.mode = 'server'`                         |
| `globalSearchChange` | `string`                 | Debounced global search query. Only emitted when `config.serverSearch` is `true`            |
| `columnSearchChange` | `TableColumnSearchEvent` | Debounced column filter query. Emitted when a column's effective `searchMode` is `'server'` |
| `searchClear`        | `void`                   | Fires when all filters are cleared and at least one search is server-side                   |

#### TableConfig

```ts
interface TableConfig {
  globalSearch?: boolean; // Show global search bar (default: false)
  columnFilters?: boolean; // Show per-column filter inputs (default: false)
  serverSearch?: boolean; // Route global search to backend via globalSearchChange (default: false)
  columnSearchMode?: 'local' | 'server'; // Default searchMode for columns without their own (default: 'local')
  searchDebounceMs?: number; // Debounce delay for server-side search events in ms (default: 300)
  selectable?: boolean; // Enable row selection (default: false)
  selectionMode?: 'single' | 'multiple'; // Default: 'multiple'
  pagination?: {
    enabled: boolean;
    pageSize: number;
    pageSizeOptions?: number[]; // e.g. [10, 25, 50]. Use 0 to add a "Show All" option
    mode?: 'client' | 'server'; // default 'client'
  };
  scroll?: {
    mode: 'none' | 'infinite';
    heightPx?: number; // Fixed table height for infinite scroll
    batchSize?: number; // Rows per batch when mode = 'infinite'
  };
  fixedRowCount?: number; // Pin N rows at top regardless of sort/filter
  emptyText?: string; // Override empty state message
  rowIdKey?: string; // Property name used as row ID (default: 'id')
  rowIdGetter?: (row: T) => string | number; // Custom row ID extractor
  globalSearchVisibleOnly?: boolean; // Search only visible columns (default: true)
  columnVisibility?: boolean; // Show column visibility toggle in toolbar
  cache?: TableCacheConfig; // Persist column visibility to localStorage
  refresh?: TableRefreshConfig; // Manual/auto refresh button
}
```

#### TableColumn

```ts
interface TableColumn<T = unknown> {
  key: string; // Property name in T (or virtual key when valueGetter used)
  label: string; // Column header text
  type: CellDataType; // Cell renderer (see below)
  size?: CellSize; // Column width preset
  align?: TextAlign; // 'left' | 'center' | 'right'
  sortable?: boolean;
  filterable?: boolean;
  hidden?: boolean;
  searchMode?: 'local' | 'server'; // How this column's filter resolves (default: 'local')
  wrap?: boolean; // Allow cell text to wrap
  valueGetter?: (row: T) => unknown; // Derive value from row
  formatter?: (value: unknown, row: T) => string; // Format display string
  actions?: TableAction<T>[]; // Inline row actions (type: 'actions')
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
      classMap?: Record<string, string>; // value → CSS class
    };
    link?: {
      hrefGetter?: (row: T) => string;
      labelGetter?: (row: T) => string;
      target?: '_blank' | '_self';
    };
  };
}
```

#### Cell Types (`CellDataType`)

| Type       | Renders               | Notes                                                   |
| ---------- | --------------------- | ------------------------------------------------------- |
| `string`   | Plain text            | Default                                                 |
| `integer`  | Number (no decimals)  |                                                         |
| `decimal`  | Number (2 decimals)   |                                                         |
| `currency` | Formatted currency    | Use `options.currency`                                  |
| `date`     | Localized date        | Use `options.dateFormat`                                |
| `datetime` | Localized date + time | Use `options.dateTimeFormat`                            |
| `boolean`  | ✓ / ✗                 |                                                         |
| `image`    | `<img>` thumbnail     | `options.image.openInModal` for lightbox                |
| `status`   | Colored badge         | Map values to CSS classes via `options.status.classMap` |
| `link`     | Anchor tag            | `options.link.hrefGetter` / `labelGetter`               |
| `custom`   | Formatted string      | Provide `formatter`                                     |
| `actions`  | Action buttons        | Define `actions` array                                  |

#### Column Size Presets (`CellSize`)

| Value     | Approximate Width     |
| --------- | --------------------- |
| `XS`      | 60px                  |
| `SM`      | 100px                 |
| `MD`      | 150px                 |
| `LG`      | 220px                 |
| `XL`      | 320px                 |
| `AUTO-XL` | Flexible, grows wide  |
| `AUTO`    | Flexible, fills space |

#### Row Actions

```ts
type ActionVariant = 'default' | 'danger' | 'success' | 'warning';
type ActionRender = 'icon' | 'text' | 'toggle';

interface TableAction<T> {
  id: string;
  label: string;
  icon?: 'edit' | 'delete' | 'view' | 'copy' | 'activate' | string;
  tooltip?: string | ((row: T) => string); // Static or per-row tooltip
  variant?: ActionVariant;
  render?: ActionRender; // 'icon' (default) | 'text' | 'toggle'
  stateGetter?: (row: T) => boolean; // Active state for render: 'toggle'
  visible?: (row: T) => boolean; // Conditionally show action
  disabled?: (row: T) => boolean; // Conditionally disable action
  confirm?: {
    title?: string;
    message: string; // Shows confirmation dialog before firing
  };
}

interface TableActionEvent<T> {
  actionId: string;
  row: T;
}

interface TableColumnSearchEvent {
  attribute: string; // Column key
  value: string; // Current query value
}
```

#### Full Example

```ts
import { AdvancedTable, TableColumn, TableConfig } from 'b2b-tools';

interface Order {
  id: number;
  customer: string;
  total: number;
  status: string;
  createdAt: string;
}

@Component({
  imports: [AdvancedTable],
  template: `
    <advanced-table
      [columns]="columns"
      [data]="orders"
      [config]="config"
      lang="ES"
      (rowClick)="onRowClick($event)"
      (actionClick)="onAction($event)"
    />
  `,
})
export class OrdersTableComponent {
  orders: Order[] = [
    /* ... */
  ];

  columns: TableColumn<Order>[] = [
    { key: 'id', label: '#', type: 'integer', size: 'XS', sortable: true },
    { key: 'customer', label: 'Customer', type: 'string', size: 'AUTO', filterable: true },
    {
      key: 'total',
      label: 'Total',
      type: 'currency',
      size: 'MD',
      sortable: true,
      options: { currency: 'MXN' },
    },
    {
      key: 'status',
      label: 'Status',
      type: 'status',
      size: 'SM',
      options: { status: { classMap: { active: 'badge-success', cancelled: 'badge-danger' } } },
    },
    {
      key: 'createdAt',
      label: 'Date',
      type: 'date',
      size: 'MD',
      sortable: true,
      options: { dateFormat: 'medium' },
    },
    {
      key: '_actions',
      label: '',
      type: 'actions',
      size: 'XS',
      actions: [
        { id: 'view', label: 'View', icon: 'view' },
        {
          id: 'delete',
          label: 'Delete',
          icon: 'delete',
          tone: 'danger',
          confirm: { message: 'Delete this order?' },
          visible: (row) => row.status !== 'shipped',
        },
      ],
    },
  ];

  config: TableConfig = {
    globalSearch: true,
    columnFilters: true,
    selectable: true,
    selectionMode: 'multiple',
    pagination: { enabled: true, pageSize: 25, pageSizeOptions: [10, 25, 50] },
    rowIdKey: 'id',
  };

  onRowClick(row: Order) {
    /* ... */
  }
  onAction(event: TableActionEvent<Order>) {
    /* ... */
  }
}
```

#### Server-side Pagination

Set `pagination.mode` to `'server'` when your API returns one page at a time. The table skips client-side slicing, drives the pager from `serverTotalCount`, and emits `pageChange` whenever the user navigates or changes page size.

```ts
import { AdvancedTable, TableColumn, TableConfig, TablePaginationChange } from 'b2b-tools';

interface Order {
  id: number;
  customer: string;
  total: number;
}

@Component({
  imports: [AdvancedTable],
  template: `
    <advanced-table
      [columns]="columns"
      [data]="rows"
      [config]="config"
      [serverTotalCount]="totalCount"
      (pageChange)="load($event)"
    />
  `,
})
export class OrdersPageComponent {
  rows: Order[] = [];
  totalCount = 0;

  columns: TableColumn<Order>[] = [
    { key: 'id', label: '#', type: 'integer', size: 'XS' },
    { key: 'customer', label: 'Customer', type: 'string', size: 'AUTO' },
    { key: 'total', label: 'Total', type: 'currency', size: 'MD', options: { currency: 'MXN' } },
  ];

  config: TableConfig = {
    pagination: { enabled: true, pageSize: 25, pageSizeOptions: [10, 25, 50], mode: 'server' },
    rowIdKey: 'id',
  };

  load({ page, pageSize }: TablePaginationChange) {
    this.api.getOrders({ page, pageSize }).subscribe((res) => {
      this.rows = res.data;
      this.totalCount = res.total;
    });
  }
}
```

#### Per-column Search Mode

By default every filterable column filters the data locally in the browser. Set `searchMode: 'server'` on any column to route that column's filter through the backend instead — the table skips local filtering for that column and emits a debounced `columnSearchChange` event.

```ts
columns: TableColumn<Order>[] = [
  { key: 'id',       label: '#',       type: 'integer', size: 'XS' },
  // This column filters locally — no API call
  { key: 'customer', label: 'Customer', type: 'string', size: 'AUTO',
    filterable: true, searchMode: 'local' },  // 'local' is the default; explicit here for clarity
  // This column emits columnSearchChange — the parent component calls the API
  { key: 'status',   label: 'Status',  type: 'status',  size: 'SM',
    filterable: true, searchMode: 'server' },
];
```

```ts
// Parent component
onColumnSearch(event: TableColumnSearchEvent) {
  // { attribute: 'status', value: 'ACTIVE' }
  this.api.getOrders({ [event.attribute]: event.value }).subscribe(res => {
    this.rows = res.data;
  });
}
```

```html
<advanced-table
  [columns]="columns"
  [data]="rows"
  [config]="config"
  (columnSearchChange)="onColumnSearch($event)"
  (searchClear)="reload()"
/>
```

> **Note:** `config.serverSearch` and `config.columnSearchMode` are independent variables. `serverSearch: true` only makes the **global search bar** server-side. `columnSearchMode: 'server'` only changes the **default** mode for per-column filters that don't set their own `searchMode` — a column's own `searchMode` always wins over either config default.

Mixed mode is fully supported: some columns can be `'local'`, others `'server'`, and the global search can be either — all in the same table instance.

---

#### Show All Rows

Add `0` to `pageSizeOptions` to render a "Show All" / "Todos" option in the rows-per-page selector. When selected the table renders every row on a single page with no slicing.

```ts
config: TableConfig = {
  pagination: {
    enabled: true,
    pageSize: 10,
    pageSizeOptions: [10, 25, 50, 0], // 0 → "All" label from i18n.showAll
  },
};
```

The "All" label is driven by `i18n.showAll` (`"All"` in EN, `"Todos"` in ES) and can be overridden:

```ts
customStrings: Partial<TableI18n> = {
  showAll: 'Ver todo',
};
```

---

### SimpleTable

Lightweight table with built-in client-side sorting. Use when you need a minimal table without the full AdvancedTable feature set.

#### Import

```ts
import { SimpleTable } from 'b2b-tools';
```

#### Selector

```html
<simple-table />
```

#### Inputs

| Input     | Type                | Default      | Description        |
| --------- | ------------------- | ------------ | ------------------ |
| `headers` | `SimpleHaders<T>[]` | **required** | Column definitions |
| `data`    | `T[]`               | `[]`         | Row data           |

#### SimpleHaders

```ts
interface SimpleHaders<T> {
  label: string; // Column header text
  key: keyof T; // Property to display and sort by
}
```

#### Example

```ts
import { SimpleTable, SimpleHaders } from 'b2b-tools';

interface Product {
  name: string;
  price: number;
  stock: number;
}

@Component({
  imports: [SimpleTable],
  template: ` <simple-table [headers]="headers" [data]="products" /> `,
})
export class ProductsComponent {
  headers: SimpleHaders<Product>[] = [
    { label: 'Product', key: 'name' },
    { label: 'Price', key: 'price' },
    { label: 'Stock', key: 'stock' },
  ];

  products: Product[] = [
    /* ... */
  ];
}
```

---

### AdvancedSelect

> **New in v2.1.0**

Searchable single/multi select with pill tags, autocomplete filtering, and an optional advanced-search modal for large catalogs. Implements Angular's `ControlValueAccessor`, so it binds directly to a `FormControl` or plain `[value]`/`(valueChange)`.

#### Import

```ts
import { AdvancedSelectComponent, AdvancedSelectOption, AdvancedSelectConfig } from 'b2b-tools';
```

#### Selector

```html
<advanced-select />
```

#### Inputs

| Input         | Type                        | Default | Description                               |
| ------------- | --------------------------- | ------- | ----------------------------------------- |
| `options`     | `AdvancedSelectOption<T>[]` | `[]`    | Option list                               |
| `config`      | `AdvancedSelectConfig`      | `{}`    | Behavior configuration                    |
| `control`     | `FormControl`               | —       | Reactive Forms binding                    |
| `value`       | `any \| any[]`              | —       | Plain value binding (id or array of ids)  |
| `id` / `name` | `string`                    | —       | Passed through for form/label association |

#### Outputs

| Output            | Payload                                                | Description                                             |
| ----------------- | ------------------------------------------------------ | ------------------------------------------------------- |
| `selectionChange` | `AdvancedSelectOption<T> \| AdvancedSelectOption<T>[]` | Fires with the full selected option(s)                  |
| `valueChange`     | `any \| any[]`                                         | Fires with the raw id(s), for `[value]` two-way binding |

#### AdvancedSelectConfig

```ts
interface AdvancedSelectConfig {
  multiple?: boolean; // default: false
  autocomplete?: boolean; // default: false — inline dropdown search
  enableModal?: boolean; // default: false — advanced search modal for large lists
  modalTitle?: string; // default: 'Advanced Selection'
  placeholder?: string; // default: 'Select an option'
  showLabel?: boolean; // default: false — shows placeholder as a floating label
  disabled?: boolean; // default: false
  clearable?: boolean; // default: true
  maxSelectedItemsToShow?: number; // default: 2 — pills shown before "+N more"
}
```

#### Example

```ts
import { AdvancedSelectComponent, AdvancedSelectOption } from 'b2b-tools';

interface Country {
  code: string;
  name: string;
}

@Component({
  imports: [AdvancedSelectComponent],
  template: `
    <advanced-select
      [options]="options"
      [config]="{ multiple: true, autocomplete: true, enableModal: true }"
      [value]="selected"
      (valueChange)="selected = $event"
    />
  `,
})
export class CountryPickerComponent {
  options: AdvancedSelectOption<Country>[] = [
    { id: 'MX', label: 'Mexico' },
    { id: 'US', label: 'United States' },
  ];
  selected: string[] = ['MX'];
}
```

Dark mode and color customization follow the same `--b2b-*` token contract as the rest of the library — see [Theming](#theming).

---

### AdvancedInput

> **New in v2.1.0**

Floating-label text input with validation states, a password visibility toggle, a clear button, and an optional character counter. Implements Angular's `ControlValueAccessor`, so it binds directly to a `FormControl`/`formControlName`, or plain `[(value)]` two-way binding.

#### Import

```ts
import { AdvancedInputComponent } from 'b2b-tools';
```

#### Selector

```html
<advanced-input />
```

#### Inputs

| Input         | Type                                   | Default        | Description                                                   |
| ------------- | -------------------------------------- | -------------- | ------------------------------------------------------------- |
| `id`          | `string`                               | auto-generated | `id`/`for` association with the floating label                |
| `name`        | `string`                               | `''`           | Native `name` attribute                                       |
| `type`        | `string`                               | `'text'`       | Native input type; `'password'` enables the visibility toggle |
| `placeholder` | `string`                               | `' '`          | Placeholder shown once the field is focused                   |
| `label`       | `string`                               | `''`           | Floating label text                                           |
| `helperText`  | `string`                               | `''`           | Helper text shown below the field when there's no error       |
| `theme`       | `'primary' \| 'secondary' \| 'accent'` | `'primary'`    | Color variant                                                 |
| `clearable`   | `boolean`                              | `false`        | Shows a clear button when there's a value                     |
| `readonly`    | `boolean`                              | `false`        | Native readonly                                               |
| `icon`        | `string`                               | `''`           | CSS class for a prefix icon (bring your own icon font)        |
| `suffixIcon`  | `string`                               | `''`           | CSS class for a suffix icon                                   |
| `loading`     | `boolean`                              | `false`        | Shows a spinner in place of suffix actions                    |
| `showCounter` | `boolean`                              | `false`        | Shows a character counter                                     |
| `maxLength`   | `number`                               | —              | Native `maxlength`; paired with `showCounter`                 |
| `value`       | `string` (model)                       | `''`           | Two-way bindable value: `[(value)]`                           |

#### Outputs

| Output       | Payload      | Description          |
| ------------ | ------------ | -------------------- |
| `focusEvent` | `FocusEvent` | Field gained focus   |
| `blurEvent`  | `FocusEvent` | Field lost focus     |
| `clearEvent` | `void`       | Clear button clicked |

#### Reactive Forms

When bound via `[formControl]` or `formControlName`, the component reads validation state off the injected `NgControl` and shows a built-in message for `required`, `email`, `minlength`, `maxlength`, and `pattern` errors once the control is `dirty` or `touched`.

```ts
import { AdvancedInputComponent } from 'b2b-tools';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  imports: [AdvancedInputComponent, ReactiveFormsModule],
  template: `
    <advanced-input label="Email" placeholder="you@example.com" [formControl]="emailControl" />
  `,
})
export class SignupFormComponent {
  emailControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.email],
  });
}
```

#### Color Variants

```html
<advanced-input theme="primary" label="Primary" />
<advanced-input theme="secondary" label="Secondary" />
<advanced-input theme="accent" label="Accent" />
```

Each variant maps to a `--b2b-*` token (`--b2b-primary`, `--b2b-secondary`, `--b2b-accent`) with a sensible fallback, so they can be overridden the same way as any other theme token — see [Color Customization](#color-customization).

Dark mode follows the same `--b2b-*` token contract as the rest of the library — add `data-theme="dark"` to the host element.

---

### AdvancedButton

> **New in v2.1.0**

Styled button with color variants, sizes, an optional prefix/suffix icon, and a loading state.

#### Import

```ts
import { AdvancedButtonComponent } from 'b2b-tools';
```

#### Selector

```html
<advanced-button />
```

#### Inputs

| Input | Type | Default | Description |
|---|---|---|---|
| `text` | `string` | `''` | Button label; alternatively project content via `<ng-content>` |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | Native button type |
| `variant` | `'primary' \| 'secondary' \| 'ghost' \| 'danger'` | `'primary'` | Color variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Button height/padding/font size |
| `icon` | `string` | `''` | CSS class for a prefix/suffix icon (bring your own icon font) |
| `iconPosition` | `'left' \| 'right'` | `'left'` | Icon placement relative to the label |
| `disabled` | `boolean` | `false` | Disables the button |
| `loading` | `boolean` | `false` | Shows a spinner and blocks clicks |
| `fullWidth` | `boolean` | `false` | Button fills the parent container width |

#### Outputs

| Output | Payload | Description |
|---|---|---|
| `clicked` | `void` | Fires on click, unless `disabled` or `loading` |

#### Example

```ts
import { AdvancedButtonComponent } from 'b2b-tools';

@Component({
  imports: [AdvancedButtonComponent],
  template: `
    <advanced-button
      text="Save changes"
      variant="primary"
      [loading]="isSaving()"
      (clicked)="save()"
    />
  `,
})
export class ToolbarComponent {
  isSaving = signal(false);
  save(): void { /* ... */ }
}
```

Dark mode and color customization follow the same `--b2b-*` token contract as the rest of the library — see [Theming](#theming).

---

### AdvancedModal

> **New in v2.2.0**

Overlay confirmation/alert dialog keyed by `type`, with its own icon and accent color per type. A dedicated `<advanced-error-detail-modal>` renders structured HTTP error details for debugging.

#### Import

```ts
import { AdvancedModalComponent, ErrorDetailModalComponent, ModalType, HttpErrorData } from 'b2b-tools';
```

#### Selectors

```html
<advanced-modal />
<advanced-error-detail-modal />
```

#### AdvancedModal Inputs

| Input | Type | Default | Description |
|---|---|---|---|
| `title` | `string` | `''` | Dialog title |
| `content` | `string` | `''` | Dialog body; rendered via `innerHTML` |
| `type` | `ModalType` | `'INFO'` | `'INFO' \| 'SUCCESS' \| 'ERROR' \| 'WARNING' \| 'QUESTION'` — drives icon, accent color, and button layout |
| `confirmText` | `string` | `'Accept'` | Confirm button label |
| `cancelText` | `string` | `'Cancel'` | Cancel button label (`QUESTION` only) |
| `showCancel` | `boolean` | `false` | Reserved for custom layouts |
| `detailsAction` | `() => void` | — | Optional callback link shown above the actions |
| `detailsLabel` | `string` | `'See more'` | Label for the details link |

`QUESTION` renders both a confirm and a cancel button; every other type renders a single confirm button.

#### AdvancedModal Outputs

| Output | Payload | Description |
|---|---|---|
| `confirm` | `void` | Confirm button clicked |
| `cancel` | `void` | Cancel button clicked (`QUESTION` only) |

#### ErrorDetailModal Inputs

| Input | Type | Description |
|---|---|---|
| `httpData` | `HttpErrorData` | `{ status?, statusText?, url?, message?, payload?, error? }` — rendered as a summary table plus a collapsible server-response JSON block |
| `rawError` | `unknown` | Full raw error, shown behind a "View full data" toggle |

#### ErrorDetailModal Outputs

| Output | Payload | Description |
|---|---|---|
| `close` | `void` | Fires on backdrop click or the close button |

#### Example

```ts
import { AdvancedModalComponent, ModalType } from 'b2b-tools';

@Component({
  imports: [AdvancedModalComponent],
  template: `
    @if (activeType(); as type) {
      <advanced-modal
        [type]="type"
        title="Delete item?"
        content="This action cannot be undone."
        (confirm)="onConfirm()"
        (cancel)="activeType.set(null)"
      />
    }
  `,
})
export class ItemListComponent {
  activeType = signal<ModalType | null>(null);
  onConfirm(): void { /* ... */ }
}
```

Dark mode and color customization follow the same `--b2b-*` token contract as the rest of the library — see [Theming](#theming).

---

## Theming

All visual tokens are CSS custom properties. Override them on the component element, a parent container, or `:root` — no build step required.

### CSS Variables Reference

#### Colors

| Variable            | Default                            | Description                                        |
| ------------------- | ---------------------------------- | -------------------------------------------------- |
| `--ac-primary`      | `#2563eb`                          | Primary brand color (buttons, highlights, links)   |
| `--ac-primary-soft` | `#eff6ff`                          | Light primary tint (selected row background, etc.) |
| `--ac-primary-glow` | `rgba(37,99,235,.12)`              | Focus glow around primary elements                 |
| `--ac-accent-bar`   | `linear-gradient(#3b82f6,#2563eb)` | Vertical accent bar on expanded card               |
| `--ac-danger`       | `#dc2626`                          | Destructive actions                                |

#### Surfaces & Borders

| Variable           | Default   | Description                                          |
| ------------------ | --------- | ---------------------------------------------------- |
| `--ac-surface`     | `#ffffff` | Card / panel background                              |
| `--ac-surface-2`   | `#f8fafc` | Secondary surface (alternating rows, summary blocks) |
| `--ac-border`      | `#e2e8f0` | Default border                                       |
| `--ac-border-soft` | `#f1f5f9` | Subtle dividers                                      |

#### Text

| Variable              | Default   | Description              |
| --------------------- | --------- | ------------------------ |
| `--ac-text`           | `#0f172a` | Primary text             |
| `--ac-text-secondary` | `#334155` | Secondary / label text   |
| `--ac-muted`          | `#64748b` | Muted / placeholder text |

#### Badge Tones

| Variable                | Default   | Description              |
| ----------------------- | --------- | ------------------------ |
| `--ac-badge-success-bg` | `#ecfdf5` | Success badge background |
| `--ac-badge-success-fg` | `#059669` | Success badge text       |
| `--ac-badge-warning-bg` | `#fffbeb` | Warning badge background |
| `--ac-badge-warning-fg` | `#d97706` | Warning badge text       |
| `--ac-badge-danger-bg`  | `#fef2f2` | Danger badge background  |
| `--ac-badge-danger-fg`  | `#dc2626` | Danger badge text        |
| `--ac-badge-primary-bg` | `#eff6ff` | Primary badge background |
| `--ac-badge-primary-fg` | `#2563eb` | Primary badge text       |
| `--ac-badge-neutral-bg` | `#f1f5f9` | Neutral badge background |
| `--ac-badge-neutral-fg` | `#475569` | Neutral badge text       |

#### Overlays (Drawer / Modal)

| Variable             | Default             | Description                 |
| -------------------- | ------------------- | --------------------------- |
| `--ac-overlay`       | `rgba(15,23,42,.5)` | Backdrop color              |
| `--ac-overlay-blur`  | `4px`               | Backdrop blur               |
| `--ac-drawer-height` | `min(85vh, 900px)`  | Maximum drawer panel height |
| `--ac-modal-max`     | `1200px`            | Modal max-width             |
| `--ac-modal-height`  | `min(80vh, 880px)`  | Modal max-height            |

#### Shadows

| Variable            | Default          | Description           |
| ------------------- | ---------------- | --------------------- |
| `--ac-shadow`       | subtle 2-layer   | Card resting shadow   |
| `--ac-shadow-hover` | elevated 2-layer | Shadow on hover       |
| `--ac-shadow-panel` | deep 2-layer     | Expanded panel shadow |

#### Shape & Spacing

| Variable          | Default     | Description          |
| ----------------- | ----------- | -------------------- |
| `--ac-radius`     | `16px`      | Card border radius   |
| `--ac-radius-sm`  | `12px`      | Inner element radius |
| `--ac-btn-radius` | `8px`       | Button border radius |
| `--ac-gap`        | `16px`      | Internal spacing gap |
| `--ac-pad-card`   | `18px`      | Card padding         |
| `--ac-pad-header` | `16px 20px` | Header padding       |
| `--ac-pad-body`   | `20px`      | Body content padding |

#### Typography

| Variable             | Default    | Description          |
| -------------------- | ---------- | -------------------- |
| `--ac-title-size`    | `18px`     | Card title font size |
| `--ac-subtitle-size` | `13px`     | Subtitle font size   |
| `--ac-btn-font`      | `600`      | Button font weight   |
| `--ac-btn-pad`       | `8px 14px` | Button padding       |

---

### Color Customization

#### Inline override (single card)

```html
<advanced-card
  [config]="config"
  style="
    --ac-primary: #7c3aed;
    --ac-primary-soft: #f5f3ff;
    --ac-accent-bar: linear-gradient(#8b5cf6, #7c3aed);
  "
/>
```

#### Global override (all cards in your app)

```scss
// styles.scss
:root {
  --ac-primary: #0d9488; /* teal brand */
  --ac-primary-soft: #f0fdfa;
  --ac-accent-bar: linear-gradient(#14b8a6, #0d9488);
  --ac-radius: 12px;
  --ac-surface: #fafafa;
}
```

#### Dark mode

```scss
[data-theme='dark'] {
  --ac-surface: #1e1e2e;
  --ac-surface-2: #181825;
  --ac-border: #313244;
  --ac-border-soft: #1e1e2e;
  --ac-text: #cdd6f4;
  --ac-text-secondary: #bac2de;
  --ac-muted: #6c7086;
  --ac-primary: #89b4fa;
  --ac-primary-soft: #1e1e2e;
  --ac-overlay: rgba(0, 0, 0, 0.7);
}
```

#### Brand presets

**Orange**

```css
--ac-primary: #ea580c;
--ac-primary-soft: #fff7ed;
--ac-accent-bar: linear-gradient(#f97316, #ea580c);
```

**Green**

```css
--ac-primary: #16a34a;
--ac-primary-soft: #f0fdf4;
--ac-accent-bar: linear-gradient(#22c55e, #16a34a);
```

**Rose**

```css
--ac-primary: #e11d48;
--ac-primary-soft: #fff1f2;
--ac-accent-bar: linear-gradient(#f43f5e, #e11d48);
```

---

### Density & Size Variants

Control spacing and text scale through `config.density` and `config.size`.

```ts
config: AdvancedCardConfig = {
  id: 'card-1',
  title: 'Compact card',
  density: 'compact', // tighter spacing
  size: 'sm', // smaller title, radius, modal max-width
};
```

| `density`     | Effect                               |
| ------------- | ------------------------------------ |
| `comfortable` | Default spacing                      |
| `compact`     | Reduced gap, padding, and font sizes |

| `size` | Title | Radius | Modal max-width |
| ------ | ----- | ------ | --------------- |
| `sm`   | 16px  | 12px   | 1000px          |
| `md`   | 18px  | 16px   | 1200px          |
| `lg`   | 20px  | 18px   | 1400px          |

---

## i18n

`AdvancedTable` ships with English and Spanish. Use `lang` for a preset or `i18n` for full control.

```html
<!-- Spanish preset -->
<advanced-table [columns]="cols" [data]="rows" lang="ES" />

<!-- Partial override -->
<advanced-table [columns]="cols" [data]="rows" [i18n]="customStrings" />
```

```ts
customStrings: Partial<TableI18n> = {
  noData: 'Sin registros',
  search: 'Buscar…',
  showing: (from, to, total) => `${from}-${to} de ${total} registros`,
};
```

#### TableI18n Interface

```ts
interface TableI18n {
  noData: string;
  rowsPerPage: string;
  showing: (from: number, to: number, total: number) => string;
  search: string;
  clear: string;
  actions: string;
  previous?: string;
  next?: string;
  filter: string;
  empty: string;
  seeImage: string;
  refresh: string;
  autoRefresh: string;
  refreshOff: string;
  columns: string;
  resetColumns: string;
  allColumnsVisible: string;
  refreshCustom?: string;
  refreshSeconds?: string;
  refreshMinutes?: string;
  showAll: string; // Label for the "show all rows" option in the page-size selector (default: "All")
}
```

---

## Types Reference

All types are exported from the package root.

```ts
import {
  // Card
  AdvancedCardConfig,
  AdvancedBadge,
  AdvancedHighlight,
  AdvancedAction,
  AdvancedCardTab,
  AdvancedSummaryBlock,
  AdvancedSummaryRow,
  AdvancedTone,
  AdvancedExpandMode,
  AdvancedDensity,
  AdvancedSize,
  AdvancedTabKind,

  // Table
  TableColumn,
  TableConfig,
  TableAction,
  TableActionEvent,
  TableColumnSearchEvent,
  TablePaginationChange,
  TableI18n,
  TableLang,
  CellDataType,
  CellSize,
  TextAlign,
  RowId,

  // Simple Table
  SimpleHaders,

  // Advanced Select
  AdvancedSelectComponent,
  AdvancedSelectOption,
  AdvancedSelectConfig,
  // Advanced Input
  AdvancedInputComponent,
  // Advanced Button
  AdvancedButtonComponent,

  // Advanced Modal
  AdvancedModalComponent,
  ErrorDetailModalComponent,
  ModalType,
  HttpErrorData,
} from 'b2b-tools';
```

---

## Repository

Source code: **https://github.com/LuisEmilianoCortes/b2b-tools**

npm: **https://www.npmjs.com/package/b2b-tools**

Issues and PRs welcome.
