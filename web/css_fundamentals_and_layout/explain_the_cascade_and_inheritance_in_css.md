The cascade is CSS's fundamental mechanism for resolving conflicts when multiple rules apply to the same element. The word "cascading" in CSS stands for Cascading Style Sheets, and the cascade determines which styles ultimately get applied.

**The cascade considers three factors in order:**

1. **Importance** — Origin and `!important` declarations:
   - User agent styles (browser defaults) — lowest priority
   - Author styles (your CSS) — normal priority
   - User styles (accessibility settings) — higher priority
   - `!important` declarations flip the normal priority within each origin

2. **Specificity** — How specifically a selector targets an element (calculated as ID/class/element counts — see the specificity topic for details).

3. **Source order** — When importance and specificity are equal, the last rule in the code wins.

```css
/* Cascade example */
p { color: black; }          /* Specificity: 0,0,1 */
.intro { color: blue; }      /* Specificity: 0,1,1 — wins for .intro paragraphs */
#main p { color: green; }    /* Specificity: 1,0,1 — wins for #main paragraphs */
```

**Inheritance** is the mechanism by which some CSS properties set on a parent element automatically pass down to child elements. Not all properties inherit — only those that make sense to pass down.

**Inherited properties** (common ones):
- `color`, `font-family`, `font-size`, `font-weight`, `line-height`
- `text-align`, `text-indent`, `letter-spacing`, `word-spacing`
- `visibility`, `cursor`
- `list-style-type`, `list-style-position`

**Non-inherited properties** (common ones):
- `margin`, `padding`, `border`
- `width`, `height`, `max-width`, `max-height`
- `background`, `background-color`
- `display`, `position`, `float`, `overflow`
- `box-shadow`, `border-radius`

**Controlling inheritance:**

```css
.child {
  /* Force inheritance */
  color: inherit;           /* Explicitly inherit from parent */
  font-size: inherit;
  
  /* Reset to initial value */
  margin: initial;          /* Reset to browser default (0 for margin) */
  
  /* Revert to previous value in cascade */
  color: revert;            /* Undo author styles, use user/UA styles */
  
  /* Revert only within the current layer */
  color: revert-layer;      /* CSS Layers feature */
}

/* Unset is hybrid: inherits if property inherits, initial if not */
.child {
  color: unset;      /* Inherits (because color is inherited) */
  margin: unset;     /* Initial (because margin is not inherited) */
}
```

**Practical example showing both cascade and inheritance:**

```css
body { font-family: Arial; color: #333; }   /* Inherited by all children */
.container { font-size: 16px; }              /* Inherited by descendants */
.container p { color: blue; }                /* Cascade: more specific */
.container p span { color: inherit; }        /* Explicit inherit: uses p's blue */
```

Understanding the cascade and inheritance is essential for writing maintainable CSS. It helps you predict which styles will apply, avoid unnecessary specificity wars, and use inheritance to reduce code duplication.
