Centering elements is one of the most common CSS tasks, and there are several reliable approaches depending on the context.

**1. Flexbox (most common modern approach):**
```css
.parent {
  display: flex;
  justify-content: center; /* Horizontal */
  align-items: center;     /* Vertical */
  min-height: 100vh;       /* Parent needs height */
}

.child {
  /* No special styles needed */
}
```

**2. CSS Grid:**
```css
.parent {
  display: grid;
  place-items: center;      /* Shorthand for both axes */
  min-height: 100vh;
}
```

**3. Absolute positioning with transform:**
```css
.parent {
  position: relative;
  min-height: 100vh;
}

.child {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
```

**4. Absolute positioning with margin auto:**
```css
.parent {
  position: relative;
  min-height: 100vh;
}

.child {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  width: fit-content;  /* Or specific width */
  height: fit-content; /* Or specific height */
}
```

**5. Margin auto for horizontal centering only (block elements):**
```css
.child {
  width: 300px;
  margin: 0 auto; /* Horizontal centering only */
}
```

**6. Text-align for inline/inline-block content:**
```css
.parent {
  text-align: center; /* Horizontal centering of inline content */
  line-height: 200px; /* Trick for vertical centering of single line */
}

.child {
  display: inline-block;
  line-height: normal; /* Reset line-height */
  vertical-align: middle;
}
```

**Choosing the right method:**

- **Flexbox or Grid** — Best for most situations. Clean, responsive, and don't require knowing element dimensions.
- **Absolute positioning** — When the element needs to be removed from document flow, or for overlay/modal positioning.
- **Margin auto** — Simple horizontal centering of block elements with a defined width.
- **Text-align** — For centering inline or inline-block content within a block container.

The most commonly recommended approach in modern development is flexbox with `justify-content` and `align-items`, or grid with `place-items: center`. Both are clean, require minimal code, and handle edge cases well.
