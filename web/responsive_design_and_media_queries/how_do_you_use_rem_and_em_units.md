`rem` and `em` are relative CSS units that scale based on font sizes, making them essential for responsive and accessible designs.

**`em` unit** — Relative to the font size of the *parent element* (for font-size) or the *element itself* (for other properties like padding, margin, width):

```css
.parent { font-size: 20px; }
.child {
  font-size: 1.2em;    /* 1.2 × 20px = 24px (relative to parent) */
  padding: 1em;         /* 1 × 24px = 24px (relative to self's font-size) */
  margin-bottom: 0.5em; /* 0.5 × 24px = 12px */
}
```

**Key issue with `em`** — compounding. Because `em` is relative to the parent's font size, nested elements can compound the scaling:

```css
.section { font-size: 1.2em; }  /* 16px × 1.2 = 19.2px */
.section p { font-size: 1.2em; } /* 19.2px × 1.2 = 23px (not 19.2px × 1.2 = expected) */
.section p span { font-size: 1.2em; } /* 23px × 1.2 = 27.6px */
```

This compounding can be useful (scaling components proportionally) or a problem (unintended size growth).

**`rem` unit** — Relative to the *root element's* (`<html>`) font size. This avoids compounding:

```css
html { font-size: 16px; } /* Browser default */

h1 { font-size: 2rem; }     /* Always 32px regardless of nesting */
p { font-size: 1rem; }       /* Always 16px */
.small { font-size: 0.875rem; } /* Always 14px */
.spacing { padding: 1.5rem; }   /* Always 24px */
```

**When to use each:**

| Use `rem` for | Use `em` for |
|---------------|--------------|
| Font sizes (most cases) | Buttons that scale with their text |
| Spacing that should be consistent | Padding inside components that scale with font |
| Layout dimensions | Media queries (better zoom behavior) |
| Margin and padding (generally) | Components that should scale proportionally with their container |

**Practical examples:**

```css
/* rem for consistent typography scale */
html { font-size: 16px; }
h1 { font-size: 2.5rem; }   /* 40px */
h2 { font-size: 2rem; }     /* 32px */
h3 { font-size: 1.5rem; }   /* 24px */
p { font-size: 1rem; }      /* 16px */
small { font-size: 0.875rem; } /* 14px */

/* em for component-level scaling */
.button {
  font-size: 1rem;
  padding: 0.5em 1em;   /* Padding scales with button's font-size */
  border-radius: 0.25em;
}

.button--large {
  font-size: 1.25rem;   /* Larger button, padding automatically scales */
}
```

**Responsive font sizing with `rem`:**

```css
html {
  font-size: 100%; /* Respect user's browser settings */
}

@media (min-width: 768px) {
  html { font-size: 112.5%; } /* 18px base on larger screens */
}
```

**Best practices:**

- Use `rem` for most sizing — it's predictable and doesn't compound
- Use `em` for component-internal scaling (buttons, badges, cards)
- Set `html` font-size to `100%` or `16px` (browser default) — never below, as it affects accessibility
- Consider using `clamp()` for fluid typography: `font-size: clamp(1rem, 2.5vw, 1.5rem);`
- Use `rem` for media queries to handle user zoom correctly
