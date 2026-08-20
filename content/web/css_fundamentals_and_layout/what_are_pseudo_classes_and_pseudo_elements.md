Pseudo-classes and pseudo-elements are special CSS selectors that allow you to style elements based on their state, position, or to target specific parts of an element that don't exist as separate DOM nodes.

**Pseudo-classes** select elements based on their state or position. They use a single colon (`:`) syntax.

Common pseudo-classes:

```css
/* User action states */
a:hover { color: blue; }        /* Mouse is over the element */
a:active { color: red; }        /* Element is being clicked */
a:focus { outline: 2px solid; } /* Element has keyboard focus */
input:focus-visible { outline: 2px solid blue; } /* Focus via keyboard only */

/* Structural pseudo-classes */
li:first-child { font-weight: bold; }    /* First child of its parent */
li:last-child { border-bottom: none; }   /* Last child of its parent */
li:nth-child(2n) { background: #f5f5f5; } /* Every even child */
li:nth-child(3) { color: red; }          /* Third child */
p:not(.intro) { font-size: 14px; }       /* All paragraphs except .intro */
div:empty { display: none; }             /* Elements with no children */

/* Form states */
input:required { border-left: 3px solid red; }
input:disabled { opacity: 0.5; }
input:checked + label { font-weight: bold; }
input:valid { border-color: green; }
input:invalid { border-color: red; }

/* Link states (order matters: LVHA) */
a:link    /* Unvisited link */
a:visited /* Visited link */
a:hover   /* Mouse over */
a:active  /* Being clicked */
```

**Pseudo-elements** create virtual elements that don't exist in the DOM but can be styled. They use a double colon (`::`) syntax (single colon works for backward compatibility).

Common pseudo-elements:

```css
/* ::before and ::after — insert generated content */
.tooltip::after {
  content: attr(data-tooltip);
  position: absolute;
  background: #333;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
}

.quote::before {
  content: '"';
  font-size: 3em;
  color: #ccc;
}

/* ::first-line and ::first-letter */
p::first-line { font-weight: bold; }
p::first-letter { font-size: 2em; float: left; }

/* ::selection — style selected text */
::selection {
  background: #b3d4fc;
  color: #000;
}

/* ::placeholder — style placeholder text in inputs */
input::placeholder {
  color: #999;
  font-style: italic;
}

/* ::marker — style list markers */
li::marker {
  color: blue;
  font-size: 1.2em;
}
```

**Key differences:**

| Aspect | Pseudo-classes | Pseudo-elements |
|--------|---------------|-----------------|
| Syntax | Single colon `:` | Double colon `::` |
| Purpose | Select based on state/position | Create virtual elements for styling |
| DOM impact | Selects existing elements | Creates non-DOM elements |
| Examples | `:hover`, `:nth-child()`, `:focus` | `::before`, `::after`, `::selection` |

Pseudo-classes and pseudo-elements can be combined: `a:hover::after` styles the `::after` pseudo-element only when the link is hovered.
