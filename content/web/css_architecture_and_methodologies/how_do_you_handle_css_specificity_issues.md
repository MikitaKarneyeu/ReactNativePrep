CSS specificity issues occur when multiple rules compete to style the same element, leading to unexpected results, specificity wars (escalating selectors), and `!important` abuse. Managing specificity is essential for maintainable CSS.

**Understanding the specificity hierarchy:**

```css
/* Specificity: 0,0,0 */
* { }           /* Universal selector */

/* Specificity: 0,0,1 */
p { }           /* Element */
::before { }    /* Pseudo-element */

/* Specificity: 0,1,0 */
.class { }      /* Class */
:hover { }      /* Pseudo-class */
[type="text"] { } /* Attribute */

/* Specificity: 1,0,0 */
#id { }         /* ID */

/* Specificity: 1,0,0,0 */
style="..."     /* Inline style */

/* Specificity: infinity */
!important      /* Overrides everything */
```

**Common specificity problems:**

```css
/* Problem 1: ID selectors make overriding difficult */
#main .card { color: blue; }
.card { color: red; } /* Doesn't work — ID has higher specificity */

/* Problem 2: Deeply nested selectors */
body .main .content .sidebar .widget .title { font-size: 18px; }
/* Extremely hard to override without equally specific selector */

/* Problem 3: !important abuse */
.button { background: red !important; }
.button--primary { background: blue !important; } /* Specificity war! */
```

**Strategies for managing specificity:**

**1. Keep specificity low and flat:**

```css
/* ❌ High specificity — hard to override */
#header .nav .link { color: blue; }

/* ✅ Low specificity — easy to override */
.nav-link { color: blue; }
.nav-link.active { color: red; }
```

**2. Use single class selectors as baseline:**

```css
.card { }
.card-title { }
.card-body { }
.card--featured { }
```

**3. Use CSS custom properties for theming:**

```css
:root {
  --card-bg: white;
  --card-color: #333;
}

.card {
  background: var(--card-bg);
  color: var(--card-color);
}

.dark-theme {
  --card-bg: #1a1a1a;
  --card-color: #e0e0e0;
}
```

**4. Use CSS Layers (`@layer`):**

```css
@layer base, components, utilities;

@layer base {
  p { color: #333; line-height: 1.5; }
}

@layer components {
  .card { background: white; padding: 16px; }
  .card__title { font-size: 1.25rem; }
}

@layer utilities {
  .text-center { text-align: center; }
  .mt-4 { margin-top: 1rem; }
}

/* Utilities always win over components, regardless of specificity */
```

**5. Use BEM or similar methodology:**

```css
.card { }
.card__title { }
.card--featured { }

/* Specificity is always 0,1,0 — flat and predictable */
```

**6. Use CSS Modules or CSS-in-JS for automatic scoping:**

```css
/* styles.module.css */
.button { }
.primary { }
```

```jsx
// Button.jsx
import styles from './styles.module.css';
// Class names are automatically unique
```

**7. Avoid `!important`:**

```css
/* ❌ Specificity war */
.button { background: red !important; }
.button--primary { background: blue !important; }

/* ✅ Use higher specificity or better selectors */
.button--primary { background: blue; }

/* ✅ Only use !important for utility classes that MUST override */
.sr-only { position: absolute !important; clip: rect(0,0,0,0) !important; }
.hidden { display: none !important; }
```

**8. Use `:where()` to lower specificity:**

```css
/* :where() has zero specificity */
:where(.card) p { color: #333; }
/* Specificity: 0,0,1 (just the element selector) */

.card p { color: #333; }
/* Specificity: 0,1,1 (class + element) */
```

**9. Use `:is()` for grouping (takes highest specificity of arguments):**

```css
:is(.card, #special) p { color: blue; }
/* Specificity: 1,0,1 (from #special) */
```

**Debugging specificity issues:**

1. **Browser DevTools** — The Styles panel shows which rules apply and which are overridden
2. **Specificity calculator** — Tools like [specificity.keegan.st](https://specificity.keegan.st)
3. **CSS linting** — Stylelint can warn about high specificity
4. **Visualize in DevTools** — Chrome shows the specificity score in the Styles panel

**Best practices summary:**

1. Keep selectors flat — avoid nesting more than 2 levels deep
2. Prefer classes over IDs for styling
3. Use a methodology (BEM, SMACSS) for consistent specificity
4. Use CSS Layers for managing specificity across large codebases
5. Avoid `!important` except for utility overrides
6. Use `:where()` for easily overridable base styles
7. Use CSS Modules or CSS-in-JS for automatic scoping
8. Debug with browser DevTools when specificity issues arise
