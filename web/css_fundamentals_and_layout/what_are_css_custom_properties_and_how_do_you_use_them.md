CSS custom properties (also called CSS variables) are entities defined by CSS authors that contain specific values to be reused throughout a document. They use the `--` prefix for declaration and `var()` function for usage.

**Declaring and using custom properties:**

```css
:root {
  --color-primary: #3498db;
  --color-secondary: #2ecc71;
  --font-size-base: 16px;
  --spacing-md: 1rem;
  --border-radius: 8px;
  --shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.button {
  background-color: var(--color-primary);
  font-size: var(--font-size-base);
  padding: var(--spacing-md);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
}

.button:hover {
  background-color: var(--color-primary-hover, #2980b9); /* Fallback value */
}
```

**Key features:**

**Scoping and cascading** — Custom properties follow the cascade, so you can override them at different levels:
```css
:root {
  --color-primary: #3498db;
}

.dark-theme {
  --color-primary: #5dade2;
}

.card {
  --color-primary: #8e44ad; /* Scoped to .card and its children */
}
```

**Fallback values** — `var()` accepts a second argument as a fallback:
```css
.element {
  color: var(--text-color, #333); /* Use #333 if --text-color is undefined */
  padding: var(--spacing-sm, var(--spacing-md, 1rem)); /* Chained fallbacks */
}
```

**Dynamic updates with JavaScript** — Unlike preprocessor variables, CSS custom properties can be changed at runtime:
```javascript
// Change a property globally
document.documentElement.style.setProperty('--color-primary', '#e74c3c');

// Change scoped to an element
const card = document.querySelector('.card');
card.style.setProperty('--color-primary', '#9b59b6');

// Read a property value
const primary = getComputedStyle(document.documentElement)
  .getPropertyValue('--color-primary');
```

**Use cases:**

1. **Theming** — Define theme colors and switch between light/dark modes
2. **Responsive design** — Change spacing or typography at breakpoints
3. **Component variants** — Pass configuration to components via CSS
4. **Animation** — Animate custom properties with `@property` registration

```css
/* Theming example */
:root {
  --bg: #ffffff;
  --text: #333333;
  --surface: #f5f5f5;
}

[data-theme="dark"] {
  --bg: #1a1a1a;
  --text: #e0e0e0;
  --surface: #2d2d2d;
}

body {
  background: var(--bg);
  color: var(--text);
}
```

**Differences from preprocessor variables (Sass/Less):**

- CSS custom properties are **live** — they update in the browser without recompilation
- They are **scoped** to the cascade and can be overridden per element
- They can be **manipulated with JavaScript**
- They work at **runtime**, not build time
- They can be **inherited** by child elements

CSS custom properties and preprocessor variables complement each other. Use preprocessor variables for build-time values (breakpoint strings, complex calculations) and custom properties for runtime values (themes, dynamic sizing).
