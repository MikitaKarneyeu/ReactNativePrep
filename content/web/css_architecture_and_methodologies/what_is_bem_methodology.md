BEM (Block, Element, Modifier) is a CSS naming methodology that provides a structured, consistent approach to naming CSS classes. It makes CSS more maintainable, scalable, and self-documenting by following a clear naming convention.

**The three parts of BEM:**

**Block** — A standalone, reusable component that has meaning on its own:
```css
.card { }
.button { }
.navigation { }
.header { }
.search-form { }
```

**Element** — A part of a block that has no standalone meaning. It is semantically tied to its block. Named with double underscore (`__`):
```css
.card__title { }
.card__image { }
.card__body { }
.button__icon { }
.navigation__link { }
.search-form__input { }
```

**Modifier** — A flag on a block or element that changes appearance, behavior, or state. Named with double dash (`--`):
```css
.card--featured { }
.card--dark { }
.button--primary { }
.button--disabled { }
.navigation__link--active { }
.search-form__input--large { }
```

**HTML structure:**

```html
<div class="card card--featured">
  <img class="card__image" src="photo.jpg" alt="">
  <div class="card__body">
    <h2 class="card__title">Featured Post</h2>
    <p class="card__description">Description text</p>
    <button class="button button--primary">Read More</button>
  </div>
</div>
```

**CSS:**

```css
/* Block */
.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

/* Elements */
.card__image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.card__body {
  padding: 16px;
}

.card__title {
  font-size: 1.25rem;
  margin-bottom: 8px;
}

.card__description {
  color: #666;
}

/* Modifiers */
.card--featured {
  border: 2px solid #3498db;
}

.card--dark {
  background: #1a1a1a;
  color: white;
}

.button--primary {
  background: #3498db;
  color: white;
}

.button--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

**BEM rules:**

1. **No element nesting** — Elements should not contain other elements:
```css
/* ❌ Wrong — deeply nested */
.card__body__title { }

/* ✅ Correct — flat structure */
.card__title { }
```

2. **Block names use kebab-case:**
```css
.search-form { }     /* ✅ */
.searchForm { }      /* ❌ */
.search_form { }     /* ❌ */
```

3. **Elements and modifiers use the block name as prefix:**
```css
.card__title { }     /* Element */
.card--featured { }  /* Modifier */
```

4. **Modifying elements uses element--modifier:**
```css
.button__icon--small { }
.navigation__link--active { }
```

**BEM with Sass:**

```scss
.card {
  background: white;

  &__image {
    width: 100%;
    height: 200px;
  }

  &__title {
    font-size: 1.25rem;
  }

  &--featured {
    border: 2px solid blue;
  }

  &__body {
    padding: 16px;

    &--compact {
      padding: 8px;
    }
  }
}
```

**Advantages of BEM:**

1. **Self-documenting** — Class names describe the component structure
2. **No specificity conflicts** — Flat selectors, no nesting needed
3. **Reusable** — Blocks can be moved between projects
4. **Team consistency** — Everyone follows the same naming convention
5. **Easy to understand** — New developers can quickly understand the codebase

**Disadvantages of BEM:**

1. **Verbose class names** — Can get long (`card__body__description--highlighted`)
2. **Rigid structure** — Doesn't handle deeply nested components well
3. **HTML bloat** — Multiple classes needed on elements
4. **Not needed with CSS Modules/CSS-in-JS** — These approaches solve the same scoping problems differently

**When to use BEM:**

- Large projects with multiple developers
- When you don't have CSS Modules or CSS-in-JS
- When you need clear CSS architecture without build tools
- Legacy projects or projects with vanilla CSS
- When CSS needs to be shared across multiple projects

Modern approaches like CSS Modules, Tailwind CSS, and CSS-in-JS solve the same problems (scoping, naming conflicts) in different ways. BEM remains relevant for projects that use plain CSS or prefer a naming convention over build-tool solutions.
