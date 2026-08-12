Media queries are a CSS technique that allows you to apply styles conditionally based on the characteristics of the device or viewport, such as width, height, orientation, resolution, and more. They are a cornerstone of responsive web design.

**Basic syntax:**

```css
@media media-type and (condition) {
  /* CSS rules that apply when condition is true */
}
```

**Common media types:**
- `all` — All devices (default)
- `screen` — Screens (monitors, phones, tablets)
- `print` — Printers / print preview
- `speech` — Screen readers

**Common media features:**

```css
/* Viewport width */
@media (min-width: 768px) { /* 768px and above */ }
@media (max-width: 767px) { /* Below 768px */ }
@media (width: 1024px) { /* Exactly 1024px */ }

/* Viewport height */
@media (min-height: 600px) { }

/* Orientation */
@media (orientation: portrait) { }
@media (orientation: landscape) { }

/* Resolution / pixel density */
@media (min-resolution: 2dppx) { /* Retina/high-DPI screens */ }
@media (-webkit-min-device-pixel-ratio: 2) { /* Safari fallback */ }

/* Prefers color scheme (user OS setting) */
@media (prefers-color-scheme: dark) { }
@media (prefers-color-scheme: light) { }

/* Prefers reduced motion */
@media (prefers-reduced-motion: reduce) { }

/* Pointer type */
@media (pointer: fine) { /* Mouse */ }
@media (pointer: coarse) { /* Touch */ }

/* Hover capability */
@media (hover: hover) { /* Can hover */ }
@media (hover: none) { /* Touch devices */ }

/* Print styles */
@media print { }
```

**Combining conditions:**

```css
/* AND — both conditions must be true */
@media (min-width: 768px) and (orientation: landscape) { }

/* OR — either condition can be true */
@media (max-width: 600px), (orientation: portrait) { }

/* NOT — negates the entire query */
@media not print { }
```

**Mobile-first vs desktop-first patterns:**

```css
/* Mobile-first: base styles for mobile, add complexity for larger screens */
.container { padding: 1rem; }

@media (min-width: 768px) {
  .container { padding: 2rem; }
}

@media (min-width: 1024px) {
  .container { max-width: 1200px; margin: 0 auto; }
}

/* Desktop-first: base styles for desktop, simplify for smaller screens */
.container { max-width: 1200px; margin: 0 auto; padding: 2rem; }

@media (max-width: 1023px) {
  .container { max-width: 100%; }
}

@media (max-width: 767px) {
  .container { padding: 1rem; }
}
```

**Using media queries with CSS custom properties:**

```css
:root {
  --columns: 1;
}

@media (min-width: 768px) { :root { --columns: 2; } }
@media (min-width: 1024px) { :root { --columns: 3; } }

.grid {
  display: grid;
  grid-template-columns: repeat(var(--columns), 1fr);
}
```

Media queries are purely CSS — no JavaScript required. They allow the browser to efficiently apply styles based on device characteristics without expensive re-renders. Modern CSS features like container queries offer component-level responsive design as a complement to viewport-level media queries.
