[![Angular](https://img.shields.io/badge/Angular-21-red?logo=angular)](https://angular.io/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![npm version](https://img.shields.io/npm/v/b2b-tools.svg)](https://www.npmjs.com/package/b2b-tools)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](#)

`b2b-tools` is a reusable Angular 21 standalone component library
designed to provide modular, scalable, and production-ready UI
components.

---

## 🔗 Repository

The source code for this library is hosted on GitHub:

👉 **https://github.com/LuisEmilianoCortes/b2b-tools**

---

## 🏗️ Technology Stack

- Angular 21
- Standalone Components
- Signals-based state management
- Strict TypeScript
- CSS variable theming

---

# 📚 Index

- [Components](#-components)
  - [AdvancedTableComponent](#-advancedtablecomponent)
  - [AdvancedCardComponent](#-advancedcardcomponent)
- [Theming](#-theming)
- [Design Principles](#-design-principles)
- [Future Enhancements](#-future-enhancements)

---

# 🧩 Components

The library currently provides the following core components:

---

## 🔹 AdvancedTableComponent

A modular and extensible data table component designed for structured
data visualization.

### Features

- Strongly typed column configuration
- Sorting support
- Pagination support
- Flexible cell rendering
- Standalone usage
- Domain-agnostic design

### Basic Usage

```ts
import { AdvancedTableComponent } from 'b2b-tools';
```

```html
<advanced-table [columns]="columns" [rows]="rows"></advanced-table>
```

---

## 🔹 AdvancedCardComponent

A highly configurable, domain-agnostic card component designed to
display summary information and expandable detailed content.

### Features

- Compact and expanded modes
- Inline / Drawer / Modal expansion
- Highlight metrics
- Summary blocks
- Header actions
- Tab system
- Template projection
- CSS variable theming
- Signals-based internal state

---

### Basic Usage

```ts
import { AdvancedCardComponent } from 'b2b-tools';
```

```html
<advanced-card
  [config]="cardConfig"
  (action)="onHeaderAction($event)"
  (tabChanged)="onTabChanged($event)"
  (tabAction)="onTabAction($event)"
>
  <ng-template advancedCardTemplate="example" let-cardId="cardId" let-tabId="tabId">
    <div>Example content for {{ cardId }} (tab: {{ tabId }})</div>
  </ng-template>
</advanced-card>
```

---

# 🎨 Theming

Both components support CSS variables for styling customization.

Example:

```html
<advanced-card
  [config]="cardConfig"
  style="--ac-primary: #f58026; --ac-radius: 18px; --ac-overlay: rgba(0,0,0,.55)"
></advanced-card>
```

Common tokens:

- --ac-primary
- --ac-radius
- --ac-overlay
- --ac-surface
- --ac-border
- --ac-text

---

# 📐 Design Principles

- Domain-agnostic
- Strongly typed configuration
- Projection-based extensibility
- Composable architecture
- Enterprise-ready scalability
- Minimal coupling

---

# 🔮 Future Enhancements

- Animation support
- Accessibility improvements
- Storybook documentation
- Public API documentation
- Context generics support
