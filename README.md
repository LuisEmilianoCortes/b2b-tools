# b2b-tools — Angular Component Library

**Version 2.1.0** · Angular 21 · Standalone · Signals

A set of production-grade UI components designed for B2B applications. Built with Angular standalone components, CSS custom properties, and a signals-based architecture.

---

## Project Structure

```
projects/
  b2b-tools/   → Angular standalone component library (publishable)
  demo/        → Showcase and development sandbox
```

---

## Quick Start

Build the library, then serve the demo:

```bash
# Terminal 1 — rebuild on every change
ng build b2b-tools --watch

# Terminal 2 — live demo
ng serve demo
```

For a one-shot production build:

```bash
ng build b2b-tools --configuration production
# Output → dist/b2b-tools
```

---

## Components

### AdvancedTable `<advanced-table>`

Full-featured data table with client and server-side support.

| Feature | Details |
|---|---|
| Cell types | `string` `integer` `decimal` `currency` `date` `datetime` `boolean` `image` `status` `link` `custom` `actions` |
| Filtering | Global + per-column; client or server mode with debounce |
| Sorting | Multi-type: string, number, date, boolean, currency |
| Pagination | Client and server mode; infinite scroll |
| Selection | Single and multiple row selection |
| Column visibility | Toggle with localStorage persistence |
| i18n | Built-in EN / ES; fully overridable |
| Time zones | 30+ presets with currency and locale mapping |
| Auto-refresh | Configurable intervals; custom interval input |
| Dark mode | `[data-theme="dark"]` on the host element |

```html
<advanced-table
  [columns]="cols"
  [data]="rows"
  [config]="tableConfig"
  (rowClick)="onRow($event)"
/>
```

---

### AdvancedCard `<advanced-card>`

Expandable card with tabs, summary blocks, and overlay modes.

| Feature | Details |
|---|---|
| Expand modes | `inline` · `drawer` · `modal` |
| Tabs | Template projection via `advancedCardTemplate` directive |
| Summary | Stacked, inline, and horizontal accordion layouts |
| Density | `compact` · `comfortable` |
| Size | `sm` · `md` · `lg` |
| Badge tones | `success` · `warning` · `danger` · `primary` · `neutral` |
| Dark mode | `[data-theme="dark"]` on the host element |

```html
<advanced-card [config]="cardConfig" (action)="onAction($event)">
  <ng-template advancedCardTemplate="tab-id">
    <!-- custom tab content -->
  </ng-template>
</advanced-card>
```

---

### AdvancedSelect `<advanced-select>`

Searchable single/multi select with pills, autocomplete, and an optional advanced-search modal for large option sets. Implements `ControlValueAccessor`, so it plugs directly into Reactive Forms.

| Feature | Details |
|---|---|
| Selection | Single or `multiple` (pills with remove buttons) |
| Autocomplete | Inline dropdown filter |
| Advanced modal | Full-list searchable table for large datasets (`enableModal`) |
| Forms | `ControlValueAccessor` — works with `formControl` / `[control]` / `[value]` + `valueChange` |
| Clearable | Optional clear button |
| Dark mode | `[data-theme="dark"]` on the host element |
| Color customization | Overrides `--b2b-primary` / `--b2b-primary-soft` per instance or globally |

```html
<advanced-select
  [options]="options"
  [config]="{ multiple: true, autocomplete: true, enableModal: true }"
  [value]="selected"
  (valueChange)="selected = $event"
/>
```

```ts
type Option = AdvancedSelectOption<Country>; // { id, label, disabled?, data? }
```

---

### SimpleTable `<simple-table>`

Lightweight generic table with client-side sorting.

```html
<simple-table [headers]="headers" [data]="rows" />
```

---

## Theme Token System

All components consume `--b2b-*` CSS custom properties. Set them on `:root` (or any ancestor) to theme the entire library. Each component ships inline fallback values so it works without a ThemeService.

| Token | Role | Light default |
|---|---|---|
| `--b2b-primary` | Brand / accent color | `#2563eb` |
| `--b2b-primary-soft` | Light tint of primary | `#eff6ff` |
| `--b2b-surface` | Base background | `#ffffff` |
| `--b2b-surface-2` | Secondary background / headers | `#f8fafc` |
| `--b2b-border` | Border color | `#e2e8f0` |
| `--b2b-text` | Primary text | `#0f172a` |
| `--b2b-text-secondary` | Secondary text | `#334155` |
| `--b2b-muted` | Muted / placeholder / disabled text | `#64748b` |
| `--b2b-danger` | Error / destructive state | `#dc2626` |
| `--b2b-success` | Success state | `#059669` |
| `--b2b-warning` | Warning state | `#d97706` |
| `--b2b-radius` | Large border radius | `16px` |
| `--b2b-radius-sm` | Small border radius | `12px` |
| `--b2b-overlay` | Modal / drawer backdrop | `rgba(15,23,42,0.5)` |
| `--b2b-focus-ring` | Focus ring `box-shadow` | `0 0 0 3px rgba(37,99,235,0.15)` |

### Applying tokens

```css
/* CSS */
:root {
  --b2b-primary:    #7c3aed;
  --b2b-surface:    #fafafa;
  --b2b-radius:     8px;
}
```

```ts
// Angular service / TypeScript
document.documentElement.style.setProperty('--b2b-primary', '#7c3aed');
```

### Dark mode

Add `[data-theme="dark"]` to any component host to activate its built-in dark palette. This overrides the global `--b2b-*` tokens for that component subtree:

```html
<advanced-table  [columns]="cols" [data]="rows" data-theme="dark" />
<advanced-card   [config]="cfg"               data-theme="dark" />
<advanced-select [options]="opts" [config]="cfg" data-theme="dark" />
<simple-table    [headers]="h" [data]="rows"  data-theme="dark" />
```

---

## Internal Utilities (`lib/utils/`)

Utility functions extracted in v2 for reuse across components and external consumption:

| File | Exports |
|---|---|
| `table-value.util` | `toNumber` · `toDate` · `compareValues` · `getCellValue` · `valueToSearchableText` |
| `table-format.util` | `formatCurrency` · `formatDate` · `formatDateTime` · `parseLocalDate` · `getDisplayText` |
| `table-filter.util` | `filterRows` |
| `storage.util` | `getStored` · `setStored` |
| `table-cell-format.pipe` | `TableCellFormatPipe` (standalone, pure) |

All exported from `lib/utils/index.ts`.

---

## Theme Customizer (Demo)

The demo includes a live **Theme Customizer** panel (floating button, bottom-right) with:

- **5 preset themes** — Oscuro (default), Indigo, Naranja, Océano, Bosque
- Individual token overrides with color pickers
- Real-time preview across all components
- Reset to defaults

---

## Migration Guide — v1 → v2

### CSS tokens (breaking)

Components no longer define `--ac-*`, `--st-*`, or `--dt-*` color variables. If your app overrode any of these, migrate to the equivalent `--b2b-*` token:

| v1 variable | v2 equivalent |
|---|---|
| `--ac-primary` | `--b2b-primary` |
| `--ac-surface` | `--b2b-surface` |
| `--ac-surface-2` | `--b2b-surface-2` |
| `--ac-border` | `--b2b-border` |
| `--ac-text` | `--b2b-text` |
| `--ac-text-secondary` | `--b2b-text-secondary` |
| `--ac-muted` | `--b2b-muted` |
| `--ac-danger` | `--b2b-danger` |
| `--ac-primary-soft` | `--b2b-primary-soft` |
| `--st-bg` | `--b2b-surface` |
| `--st-border` | `--b2b-border` |
| `--st-text` | `--b2b-text` |
| `--dt-*` / `--black` / `--dark-gray` | `--b2b-text` / `--b2b-muted` / `--b2b-border` |

### Dark mode (new in v2)

AdvancedCard now supports `[data-theme="dark"]` — previously had no dark mode.  
AdvancedTable and SimpleTable behavior is unchanged.

---

## Running Tests

```bash
ng test b2b-tools --watch=false
```

---

## Tech Stack

- Angular 21 — standalone components, no NgModules
- Signals + `computed()` + `effect()` — reactive state
- CSS custom properties — single `--b2b-*` token contract
- Jest + Angular Testing Library
- esbuild production builds
