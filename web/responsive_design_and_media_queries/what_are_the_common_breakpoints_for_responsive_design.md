Breakpoints are the viewport widths at which your layout changes to accommodate different screen sizes. While the ideal breakpoints depend on your specific content and design, there are widely used conventions based on common device categories.

**Common breakpoints:**

```css
/* Mobile-first approach using min-width */
/* Base: 0-599px (mobile phones) */

/* Small tablets and large phones (portrait) */
@media (min-width: 600px) { }

/* Tablets (portrait and small laptops) */
@media (min-width: 768px) { }

/* Small laptops and tablets (landscape) */
@media (min-width: 1024px) { }

/* Desktops and laptops */
@media (min-width: 1280px) { }

/* Large desktops and external monitors */
@media (min-width: 1536px) { }
```

**Tailwind CSS breakpoints (widely adopted):**

```css
/* sm: 640px, md: 768px, lg: 1024px, xl: 1280px, 2xl: 1536px */
```

**Common device-based ranges:**

| Category | Width Range | Typical Devices |
|----------|------------|-----------------|
| Mobile (portrait) | 320px - 480px | iPhone SE, small Android phones |
| Mobile (large) | 481px - 599px | iPhone 14 Pro Max, Pixel 7 |
| Tablet (portrait) | 600px - 767px | iPad Mini, small tablets |
| Tablet (landscape) / Small laptop | 768px - 1023px | iPad, iPad Air, Chromebooks |
| Laptop / Desktop | 1024px - 1279px | Laptops, small monitors |
| Large desktop | 1280px+ | Desktop monitors, ultrawide |

**Best practices for choosing breakpoints:**

1. **Let content determine breakpoints** — Rather than targeting specific devices, resize your browser and set breakpoints where the content naturally starts to look awkward. This is more sustainable than chasing specific device widths.

2. **Use minimum widths** — Mobile-first `min-width` queries are simpler and more maintainable than `max-width`.

3. **Keep breakpoints to a minimum** — Most designs need 2-4 breakpoints. Too many breakpoints create complexity and maintenance burden.

4. **Consider common patterns:**
```css
/* Simple 3-breakpoint system */
@media (min-width: 768px) { }   /* Tablet */
@media (min-width: 1024px) { }  /* Desktop */

/* 4-breakpoint system */
@media (min-width: 600px) { }   /* Large phone / small tablet */
@media (min-width: 768px) { }   /* Tablet */
@media (min-width: 1024px) { }  /* Desktop */
@media (min-width: 1280px) { }  /* Large desktop */
```

5. **Use em-based breakpoints** for consistency with zoom levels:
```css
@media (min-width: 48em) { }   /* ~768px at 16px base */
@media (min-width: 64em) { }   /* ~1024px */
```

6. **Container queries** can reduce the need for viewport-based breakpoints when components need to respond to their container size rather than the viewport.

Modern CSS features like `clamp()`, fluid typography, and CSS Grid's `auto-fit`/`auto-fill` can reduce breakpoint dependence by creating intrinsically responsive layouts.
