# 🧩 b2b-tools Workspace

This workspace contains the **b2b-tools Angular component library** and
a **demo application** used to showcase and test the components during
development.

---

## 📦 Project Structure

    projects/
      b2b-tools/   → Angular standalone component library
      demo/        → Demo application consuming the library

- **b2b-tools**: Reusable UI components built with Angular 21
  (standalone + CSS).
- **demo**: Development playground and showcase environment.

---

## 🚀 Running the Demo Application

The demo application consumes the compiled library from the `dist/`
folder.

### ⚠️ Important

Before running the demo, you must build the library:

```bash
ng build b2b-tools
```

Then start the demo:

```bash
ng serve demo
```

---

## 👨‍💻 Recommended Development Mode

For active development, use watch mode for the library:

### Terminal 1

```bash
ng build b2b-tools --watch
```

### Terminal 2

```bash
ng serve demo
```

This ensures that every change in the library is automatically rebuilt
and reflected in the demo application.

---

## 📦 Building the Library

To generate a production-ready build:

```bash
ng build b2b-tools
```

The output will be generated in:

    dist/b2b-tools

---

## 🏗️ Library Technology Stack

- Angular 21\
- Standalone Components\
- CSS styling\
- Signals-based architecture\
- Strict TypeScript configuration

---

## 🎨 Theme Token System

The library exposes CSS custom properties (prefixed `--b2b-*`) that control the visual appearance of all components. These tokens can be set on any ancestor element (typically `:root`) to theme the library.

| Token | Description | Default |
|---|---|---|
| `--b2b-primary` | Brand / accent color | `#2563eb` |
| `--b2b-primary-soft` | Light tint of primary | `#eff6ff` |
| `--b2b-surface` | Base background color | `#ffffff` |
| `--b2b-surface-2` | Secondary background | `#f8fafc` |
| `--b2b-border` | Border color | `#e2e8f0` |
| `--b2b-text` | Primary text color | `#0f172a` |
| `--b2b-text-secondary` | Secondary text color | `#334155` |
| `--b2b-muted` | Muted / disabled text | `#64748b` |
| `--b2b-danger` | Error / danger state | `#dc2626` |
| `--b2b-success` | Success state | `#059669` |
| `--b2b-warning` | Warning state | `#d97706` |
| `--b2b-radius` | Large border radius | `16px` |
| `--b2b-radius-sm` | Small border radius | `12px` |
| `--b2b-overlay` | **Modal backdrop color** | `rgba(15,23,42,0.5)` |
| `--b2b-focus-ring` | Focus ring box-shadow | `0 0 0 3px rgba(37,99,235,0.15)` |

### Modal backdrop (`--b2b-overlay`)

All modal and drawer backdrops in the library use `--b2b-overlay`. It accepts any valid CSS color value — typically `rgba(r, g, b, opacity)` to control both color and transparency:

```css
:root {
  --b2b-overlay: rgba(15, 23, 42, 0.5);   /* dark slate, 50% opacity */
}
```

### Applying tokens

Set them directly in CSS:

```css
:root {
  --b2b-primary: #7c3aed;
  --b2b-overlay: rgba(30, 10, 60, 0.6);
}
```

Or dynamically via JavaScript / Angular service:

```ts
document.documentElement.style.setProperty('--b2b-overlay', 'rgba(30,10,60,0.6)');
```

---

## 🖌️ Theme Customizer (Demo)

The demo application includes a live **Theme Customizer** panel (floating button at the bottom-right corner) that lets you adjust all tokens interactively without writing code:

- **Preset themes** — Indigo, Naranja, Océano, Bosque
- **Brand colors** — primary and soft variant
- **Backgrounds & borders** — surface, surface2, border
- **Text colors** — primary, secondary, muted
- **State colors** — danger, success, warning
- **Modales** — backdrop color and opacity for all modals and drawers
- **Border radius** — large and small radius via sliders

Changes apply instantly via CSS custom properties on the document root.

---

## 🧪 Purpose of the Demo App

The demo application exists to:

- Validate component behavior\
- Showcase usage examples\
- Test API contracts\
- Simulate real-world integration scenarios

It is not intended for production usage.

---

## 📌 Future Improvements

- Automated Storybook integration\
- CI/CD pipeline for library builds\
- npm package publication\
- Versioning strategy
