CSS container queries allow you to style elements based on the size of their parent container rather than the viewport. This solves a long-standing limitation of media queries, which can only respond to the viewport dimensions — a problem when building reusable components that appear in different layout contexts.

**Basic syntax:**

```css
/* Define a containment context */
.card-wrapper {
  container-type: inline-size;
  container-name: card;
}

/* Query the container */
@container card (min-width: 400px) {
  .card {
    display: flex;
    flex-direction: row;
  }
  .card-image {
    width: 200px;
  }
}

@container card (max-width: 399px) {
  .card {
    display: flex;
    flex-direction: column;
  }
  .card-image {
    width: 100%;
  }
}
```

**`container-type` values:**

- `inline-size` — Establishes containment on the inline axis (width in horizontal writing modes). This is the most common and performant option.
- `size` — Establishes containment on both axes (width and height). Use sparingly, as it's more restrictive.
- `normal` — No containment (default).

**Naming containers** with `container-name` is important when you have nested containers and need to target a specific one:

```css
.sidebar { container-type: inline-size; container-name: sidebar; }
.main { container-type: inline-size; container-name: main; }

@container sidebar (min-width: 300px) {
  .widget { display: grid; grid-template-columns: 1fr 1fr; }
}

@container main (min-width: 600px) {
  .card { display: flex; }
}
```

**Container query units** — New length units relative to the container's dimensions:

```css
.card-title {
  /* Font size scales with container width */
  font-size: clamp(1rem, 4cqi, 2rem); /* cqi = 1% of container's inline size */
}

.card-content {
  padding: 2cqb; /* cqb = 1% of container's block size */
}
```

Available units: `cqw` (1% width), `cqh` (1% height), `cqi` (1% inline), `cqb` (1% block), `cqmin` (smaller of cqi/cqb), `cqmax` (larger of cqi/cqb).

**Style queries** (experimental) — Query computed styles of a container:

```css
@container style(--theme: dark) {
  .card { background: #1a1a1a; color: white; }
}
```

**Container queries vs media queries:**

| Aspect | Container Queries | Media Queries |
|--------|------------------|---------------|
| Target | Parent container | Viewport |
| Use case | Component-level responsiveness | Page-level layout |
| Reusability | Components work anywhere | Layouts are page-specific |
| Naming | Requires container definition | No setup needed |

**Practical example — a card component that adapts to its container:**

```css
.card-container {
  container-type: inline-size;
}

.card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@container (min-width: 500px) {
  .card {
    flex-direction: row;
    align-items: start;
  }
  .card__image {
    flex: 0 0 200px;
  }
  .card__title {
    font-size: 1.5rem;
  }
}

@container (min-width: 800px) {
  .card__image {
    flex: 0 0 300px;
  }
  .card__title {
    font-size: 2rem;
  }
}
```

Container queries are supported in all major modern browsers and are a game-changer for building truly reusable, context-aware components. They complement media queries perfectly — use media queries for page layout and container queries for component adaptation.
