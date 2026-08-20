Organizing CSS in large applications requires a clear architecture to prevent specificity conflicts, maintain consistency, and make the codebase easy to navigate. There are several methodologies and approaches for structuring CSS at scale.

**File organization:**

```
src/
├── styles/
│   ├── base/
│   │   ├── reset.css          /* CSS reset/normalize */
│   │   ├── typography.css     /* Base typography */
│   │   ├── variables.css      /* CSS custom properties */
│   │   └── global.css         /* Global styles */
│   ├── components/
│   │   ├── button.css
│   │   ├── card.css
│   │   ├── modal.css
│   │   └── form.css
│   ├── layouts/
│   │   ├── header.css
│   │   ├── footer.css
│   │   ├── sidebar.css
│   │   └── grid.css
│   ├── utilities/
│   │   ├── spacing.css
│   │   ├── visibility.css
│   │   └── text.css
│   └── index.css              /* Main entry point */
```

**CSS Layers for ordering:**

```css
@layer reset, base, components, utilities;

@layer reset {
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
}

@layer base {
  html { font-size: 16px; }
  body { font-family: system-ui, sans-serif; color: #333; }
  h1, h2, h3 { line-height: 1.2; }
}

@layer components {
  .card { background: white; border-radius: 8px; }
  .button { padding: 8px 16px; border-radius: 4px; }
}

@layer utilities {
  .hidden { display: none !important; }
  .sr-only { /* screen reader only */ }
}
```

**Architecture methodologies:**

**1. ITCSS (Inverted Triangle CSS):**
Organizes CSS from generic to specific, reducing specificity conflicts:

```
Settings    — Variables, config
Tools       — Mixins, functions
Generic     — Reset, normalize
Elements    — Bare HTML elements (h1, p, a)
Objects     — Layout patterns (container, grid)
Components  — UI components (card, button)
Utilities   — Helper classes (hidden, text-center)
```

**2. SMACSS (Scalable and Modular Architecture):**
Categorizes CSS rules:

```css
/* Base — default element styles */
html, body { }
a { }
h1 { }

/* Layout — major page sections */
.l-header { }
.l-sidebar { }
.l-main { }

/* Module — reusable components */
.card { }
.button { }
.form { }

/* State — dynamic styles */
.is-active { }
.is-hidden { }
.is-loading { }

/* Theme — visual variations */
.theme-dark { }
.theme-light { }
```

**3. Component-based organization (React/modern frameworks):**

```
components/
├── Button/
│   ├── Button.tsx
│   ├── Button.module.css
│   └── Button.test.tsx
├── Card/
│   ├── Card.tsx
│   ├── Card.module.css
│   └── Card.test.tsx
└── Modal/
    ├── Modal.tsx
    ├── Modal.module.css
    └── Modal.test.tsx
```

**CSS custom properties for theming:**

```css
/* design-tokens.css */
:root {
  /* Colors */
  --color-primary: #3498db;
  --color-secondary: #2ecc71;
  --color-error: #e74c3c;
  --color-background: #ffffff;
  --color-surface: #f5f5f5;
  --color-text: #333333;

  /* Spacing */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 32px;
  --space-xl: 64px;

  /* Typography */
  --font-family-sans: system-ui, sans-serif;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.25rem;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.1);
}

[data-theme="dark"] {
  --color-background: #1a1a1a;
  --color-surface: #2d2d2d;
  --color-text: #e0e0e0;
}
```

**Best practices for large-scale CSS:**

1. **Use a methodology** — ITCSS, BEM, SMACSS, or component-based
2. **Use CSS Layers** — Control specificity ordering at the architecture level
3. **Use design tokens** — CSS custom properties for consistent values
4. **Component-scoped styles** — CSS Modules, CSS-in-JS, or Tailwind component extraction
5. **Lint your CSS** — Stylelint for consistent formatting and best practices
6. **Document patterns** — Keep a style guide or use Storybook
7. **Avoid global styles** — Scope styles to components whenever possible
8. **Use a preprocessor** — Sass for variables, mixins, and partials
9. **Purge unused CSS** — Remove dead CSS in production builds
10. **Review CSS in PRs** — CSS bugs are easy to introduce and hard to catch

**Stylelint configuration:**

```json
{
  "extends": ["stylelint-config-standard"],
  "rules": {
    "no-descending-specificity": null,
    "selector-class-pattern": "^[a-z][a-z0-9-]+$",
    "max-nesting-depth": 2,
    "no-important": true
  }
}
```

The key to organizing CSS at scale is choosing a consistent approach and enforcing it through tooling, code review, and documentation.
