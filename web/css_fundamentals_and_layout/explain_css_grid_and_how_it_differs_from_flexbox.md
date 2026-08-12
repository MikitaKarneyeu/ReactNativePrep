CSS Grid is a two-dimensional layout system that allows you to control both rows and columns simultaneously. It is designed for building complex page layouts where you need precise control over how content is placed in a grid structure.

**Defining a grid:**

```css
.grid-container {
  display: grid;
  grid-template-columns: 200px 1fr 1fr;
  grid-template-rows: auto 1fr auto;
  gap: 16px;
  min-height: 100vh;
}
```

**Key Grid features:**

**Template areas** let you name regions and place items visually:
```css
.layout {
  display: grid;
  grid-template-areas:
    "header header header"
    "sidebar main   aside"
    "footer footer footer";
  grid-template-columns: 250px 1fr 200px;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}

.header  { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main    { grid-area: main; }
.aside   { grid-area: aside; }
.footer  { grid-area: footer; }
```

**Line-based placement** gives precise control:
```css
.item {
  grid-column: 1 / 3;   /* Start at column line 1, end at line 3 */
  grid-row: 2 / 4;      /* Start at row line 2, end at line 4 */
}

/* Shorthand */
.item {
  grid-column: 1 / span 2; /* Start at 1, span 2 columns */
}
```

**Useful Grid functions:**
- `repeat(count, size)` — Repeat a track pattern: `grid-template-columns: repeat(3, 1fr)`
- `minmax(min, max)` — Set flexible bounds: `grid-template-columns: repeat(auto-fit, minmax(250px, 1fr))`
- `auto-fit` / `auto-fill` — Create responsive grids without media queries

**Grid vs Flexbox:**

| Aspect | CSS Grid | Flexbox |
|--------|----------|--------|
| Dimension | Two-dimensional (rows AND columns) | One-dimensional (row OR column) |
| Approach | Layout-first (define grid, then place items) | Content-first (items define their own layout) |
| Overlap | Easy with grid-area / line placement | Not natively supported |
| Best for | Page layouts, complex grids, dashboard layouts | Navigation, card rows, centering, small components |
| Alignment | Both axes simultaneously | Single axis at a time |

In practice, Grid and Flexbox are complementary. A common pattern is to use Grid for the overall page layout and Flexbox for component-level layouts within grid cells:

```css
/* Grid for page structure */
.page {
  display: grid;
  grid-template-columns: 250px 1fr;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
}

/* Flexbox for component layout inside grid cells */
.nav-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
```

Grid supports features like `subgrid` (inheriting the parent grid's track definitions), implicit grid creation for extra items, dense packing with `grid-auto-flow: dense`, and fractional units (`fr`) that distribute remaining space proportionally.
