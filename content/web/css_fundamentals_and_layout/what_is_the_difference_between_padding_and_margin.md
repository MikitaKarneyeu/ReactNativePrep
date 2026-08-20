Padding and margin are both spacing mechanisms in CSS, but they serve different purposes and behave differently in important ways.

**Padding** is the space between an element's content and its border. It is *inside* the element, so it inherits the element's background color and is clickable if the element is interactive.

**Margin** is the space *outside* the element's border. It creates distance between the element and its neighboring elements. Margins are always transparent.

Key differences:

| Property | Padding | Margin |
|----------|---------|--------|
| Location | Inside the border | Outside the border |
| Background | Shows element's background | Always transparent |
| Click area | Included in clickable area | Not part of clickable area |
| Auto values | No `auto` behavior | `margin: auto` can center block elements |
| Collapsing | Never collapses | Vertical margins collapse between adjacent elements |
| Negative values | Not allowed | Allowed (pulls element closer to neighbors) |
| Percentage values | Relative to containing block's *width* | Relative to containing block's *width* |

**Margin collapsing** is a key behavioral difference. When two vertical margins meet, the browser uses the larger one rather than adding them together:

```css
.box-a { margin-bottom: 30px; }
.box-b { margin-top: 20px; }
/* Actual gap between them: 30px, not 50px */
```

Padding does not collapse — if you add 20px padding to both elements, you get the full combined space.

**When to use each:**

- Use **padding** when you want internal spacing, such as inside a card or button, where the background should extend behind the space.
- Use **margin** when you want external spacing between elements, such as gaps between paragraphs or sections.

```css
.card {
  padding: 24px;           /* Space inside the card */
  background: white;
  border-radius: 8px;
}

.card + .card {
  margin-top: 16px;        /* Space between cards */
}
```

Modern CSS provides alternatives for spacing: `gap` in flexbox and grid layouts eliminates the need for margins in many cases, avoiding margin collapsing issues entirely.
