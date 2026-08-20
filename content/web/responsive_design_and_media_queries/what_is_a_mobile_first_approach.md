A mobile-first approach is a design and development strategy where you start by designing and coding for the smallest screen (mobile devices) and then progressively enhance the layout for larger screens using `min-width` media queries. This is the opposite of the older desktop-first approach where you started with a full desktop layout and then tried to adapt it for smaller screens.

**How it works:**

Write base CSS that targets mobile devices (the simplest layout), then add complexity as the viewport grows:

```css
/* Base styles — mobile (single column, stacked layout) */
.container {
  padding: 1rem;
}

.nav {
  display: flex;
  flex-direction: column;
}

.grid {
  display: grid;
  grid-template-columns: 1fr;
}

/* Tablet and above */
@media (min-width: 768px) {
  .container { padding: 2rem; }
  .nav { flex-direction: row; }
  .grid { grid-template-columns: 1fr 1fr; }
}

/* Desktop and above */
@media (min-width: 1024px) {
  .container { max-width: 1200px; margin: 0 auto; }
  .grid { grid-template-columns: repeat(3, 1fr); }
}

/* Large desktop */
@media (min-width: 1440px) {
  .container { max-width: 1400px; }
}
```

**Why mobile-first is preferred:**

1. **Progressive enhancement** — You start with the essentials and add features for capable devices, rather than starting complex and trying to remove features. This ensures the base experience works everywhere.

2. **Performance** — Mobile devices typically have slower connections and less processing power. Starting mobile-first forces you to prioritize essential content and styles. You load only what's needed for the base experience.

3. **CSS efficiency** — Mobile styles are simpler and use less CSS. With `min-width` queries, you only add rules when space allows. With `max-width` (desktop-first), you'd need to override many desktop styles to simplify for mobile, creating more CSS.

4. **Content prioritization** — Working with limited space first forces you to decide what content is most important, leading to better information architecture.

5. **Industry standard** — Google recommends mobile-first design, and it aligns with mobile-first indexing for SEO.

**Desktop-first (the older approach):**

```css
/* Desktop-first: start with full layout, then simplify */
.sidebar { width: 250px; float: left; }
.main { margin-left: 260px; }

@media (max-width: 767px) {
  .sidebar { width: 100%; float: none; }
  .main { margin-left: 0; }
}
```

This approach leads to more overrides and is harder to maintain as you're constantly undoing desktop styles for smaller screens.

**Practical tips:**

- Start with the content — structure your HTML for mobile first, then rearrange with CSS for larger screens
- Use `min-width` breakpoints exclusively
- Test on real devices, not just browser resize
- Consider performance budgets for mobile — lazy load images, defer non-critical JavaScript
- Use modern CSS features like `clamp()`, `min()`, `max()`, and fluid typography to reduce the number of breakpoints needed
