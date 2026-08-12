Repaint and reflow are browser rendering operations that occur when the visual appearance of a page changes. They differ in scope and cost.

**Repaint** (also called redraw): Occurs when a visual change does not affect the layout—only the appearance of an element changes. The browser repaints pixels without recalculating the layout.

Examples: changing `color`, `background-color`, `visibility`, `box-shadow`, `outline`.

```js
element.style.color = 'red'; // repaint only
```

**Reflow** (also called layout): Occurs when a change affects the document's structure or layout. The browser must recalculate the positions and dimensions of elements. Reflows are significantly more expensive than repaints.

Examples: changing `width`, `height`, `padding`, `margin`, `border`, `font-size`, `display`, adding/removing DOM elements, resizing the window.

```js
element.style.width = '200px'; // triggers reflow
document.body.appendChild(newElement); // triggers reflow
```

**Reflow is more expensive because**:
- It can affect the entire document tree (not just the changed element).
- It invalidates the layout tree, requiring recalculation.
- It triggers repaint afterward (reflow always includes a repaint, but not vice versa).
- Changes cascade—if a parent's size changes, all children may need reflow.

**How to minimize reflows**:

1. **Batch style changes**: Use CSS classes instead of multiple inline style changes.
```js
// Bad — 3 reflows
element.style.width = '200px';
element.style.height = '100px';
element.style.margin = '10px';

// Good — 1 reflow
element.classList.add('new-size');
```

2. **Avoid reading layout properties after changing styles**: Reading `offsetHeight`, `getBoundingClientRect()`, etc. forces the browser to synchronously calculate layout (layout thrashing).
```js
// Bad — forces synchronous reflow
element.style.height = '100px';
const height = element.offsetHeight; // forces reflow
element.style.width = height + 'px'; // another reflow
```

3. **Use `transform` and `opacity` for animations**: These are handled by the compositor thread and do not trigger reflow or repaint.
```css
/* GPU-accelerated, no reflow */
transform: translateX(100px);
opacity: 0.5;
```

4. **Detach elements before modifying them**: Remove from DOM, make changes, then reinsert.

5. **Use `DocumentFragment`** for batch DOM insertions.
