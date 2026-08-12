CSS specificity is the algorithm browsers use to determine which CSS rule wins when multiple rules target the same element. Specificity is calculated based on the types of selectors used, and the rule with higher specificity wins.

**Specificity hierarchy (from lowest to highest):**

1. **Universal selector** (`*`) and combinators (`>`, `+`, `~`, ` `) — specificity: 0
2. **Element selectors and pseudo-elements** (`div`, `p`, `::before`, `::after`) — specificity: 0,0,1
3. **Class selectors, attribute selectors, and pseudo-classes** (`.class`, `[attr]`, `:hover`, `:nth-child()`) — specificity: 0,1,0
4. **ID selectors** (`#id`) — specificity: 1,0,0
5. **Inline styles** (`style="..."`) — specificity: 1,0,0,0
6. **`!important`** — overrides everything (use sparingly)

Specificity is often written as a three-part value `(a, b, c)`:
- `a` = number of ID selectors
- `b` = number of class/attribute/pseudo-class selectors
- `c` = number of element/pseudo-element selectors

**Examples:**

```css
/* Specificity: 0,0,1 */
p { color: black; }

/* Specificity: 0,1,1 */
p.intro { color: blue; }

/* Specificity: 0,2,1 */
p.intro.highlighted { color: green; }

/* Specificity: 1,0,0 */
#main { color: red; }

/* Specificity: 1,1,1 */
#main p.intro { color: purple; }

/* Specificity: 0,0,2 (pseudo-element counts as element) */
div::before { content: ''; }
```

**Important rules to remember:**

- **Specificity beats source order** — a higher-specificity rule wins regardless of where it appears in the stylesheet.
- **Equal specificity** — when specificity is equal, the last rule in source order wins.
- **Universal selector has zero specificity** — it doesn't contribute to specificity at all.
- **Combinators don't add specificity** — `div > p` and `div p` have the same specificity.
- **`:not()` doesn't count** — the `:not()` pseudo-class itself doesn't add specificity, but its argument does. `:not(#id)` has specificity of 1,0,0.
- **`:where()` has zero specificity** — `:where(.class)` has 0 specificity, useful for override layers.
- **`:is()` takes the highest** — `:is(.a, #b)` takes the specificity of its most specific argument (1,0,0).

**Practical tips for managing specificity:**

1. Prefer low-specificity selectors — use classes over IDs
2. Avoid `!important` — it makes debugging extremely difficult
3. Use a single class for base styles, and add classes for variations
4. Leverage CSS Layers (`@layer`) for managing specificity across large codebases
5. Tools like CSS Modules, BEM, or utility frameworks help keep specificity flat and predictable
