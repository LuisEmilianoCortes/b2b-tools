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
