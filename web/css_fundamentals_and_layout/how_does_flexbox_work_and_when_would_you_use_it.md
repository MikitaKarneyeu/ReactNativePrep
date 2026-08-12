Flexbox (Flexible Box Layout) is a one-dimensional CSS layout system designed to distribute space along a single axis and align items within a container. It excels at laying out items in a row or column and handling dynamic sizing.

To use flexbox, set `display: flex` on a container. This makes its direct children flex items:

```css
.container {
  display: flex;
  flex-direction: row;       /* Main axis: horizontal (default) */
  justify-content: space-between; /* Alignment along main axis */
  align-items: center;       /* Alignment along cross axis */
  flex-wrap: wrap;           /* Allow items to wrap to next line */
  gap: 16px;                 /* Space between items */
}

.item {
  flex: 1;                   /* Grow equally to fill space */
}
```

**Key flex container properties:**

- `flex-direction` — Sets the main axis: `row` (default), `row-reverse`, `column`, `column-reverse`
- `justify-content` — Distributes items along the main axis: `flex-start`, `flex-end`, `center`, `space-between`, `space-around`, `space-evenly`
- `align-items` — Aligns items along the cross axis: `stretch` (default), `flex-start`, `flex-end`, `center`, `baseline`
- `flex-wrap` — Controls whether items wrap: `nowrap` (default), `wrap`, `wrap-reverse`
- `gap` — Sets consistent spacing between items without using margins

**Key flex item properties:**

- `flex-grow` — How much the item should grow relative to siblings (default 0)
- `flex-shrink` — How much the item should shrink relative to siblings (default 1)
- `flex-basis` — The item's initial size before growing/shrinking
- `flex` — Shorthand: `flex: grow shrink basis`
- `align-self` — Override the container's `align-items` for this specific item
- `order` — Controls the visual order of items

**Common use cases:**

1. **Navigation bars** — horizontal list of links with space between them
2. **Centering content** — both horizontally and vertically with `justify-content: center` and `align-items: center`
3. **Card layouts** — equal-height cards in a row that wrap responsively
4. **Footer layout** — content pushed to the bottom with `margin-top: auto` on a flex item
5. **Form layouts** — label and input side by side
6. **Media objects** — image and text side by side

```css
/* Classic centering pattern */
.centered {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

/* Navbar with items pushed apart */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Equal-width columns */
.columns {
  display: flex;
  gap: 1rem;
}
.columns > * {
  flex: 1;
}
```

Flexbox is one-dimensional — it works along a single axis at a time. For two-dimensional layouts (rows and columns simultaneously), use CSS Grid instead. In practice, the two systems complement each other well and are often used together.
