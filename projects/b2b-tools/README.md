# 📦 b2b-tools

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
- CSS styling
- Signals-based state management
- Strict TypeScript configuration

---

## 📥 Installation (After npm publication)

```bash
npm install b2b-tools
```

Then import components directly:

```ts
import { AdvancedTableComponent } from 'b2b-tools';
```

---

## 🚀 Basic Usage Example

```ts
import { Component } from '@angular/core';
import { AdvancedTableComponent } from 'b2b-tools';

@Component({
  standalone: true,
  imports: [AdvancedTableComponent],
  template: ` <b2b-advanced-table></b2b-advanced-table> `,
})
export class ExampleComponent {}
```

---

## 🧩 Available Components

### AdvancedTableComponent

A modular and extensible data table component supporting:

- Configurable columns
- Sorting
- Pagination
- Strong typing
- Standalone usage
