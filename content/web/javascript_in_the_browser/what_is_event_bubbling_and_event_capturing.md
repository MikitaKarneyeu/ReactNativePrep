Event bubbling and event capturing are two phases of event propagation in the DOM. When an event occurs on an element, it doesn't just fire on that element — it travels through the DOM tree in a specific sequence.

**The three phases of event propagation:**

1. **Capturing phase** — The event travels from the `window` down through the DOM tree to the target element's parent.
2. **Target phase** — The event reaches the target element itself.
3. **Bubbling phase** — The event travels back up from the target element to the `window`.

```
                CAPTURING (going down)         BUBBLING (going up)
window           ↓                              ↑
document         ↓                              ↑
html             ↓                              ↑
body             ↓                              ↑
parent           ↓                              ↑
target element → ● (target phase)
```

**Event bubbling** is the default behavior. When you click a button inside a div, the click event fires on the button first, then bubbles up to the div, then to body, html, document, and window:

```html
<div id="parent">
  <button id="child">Click me</button>
</div>

<script>
document.getElementById('child').addEventListener('click', () => {
  console.log('Button clicked'); // Fires first
});

document.getElementById('parent').addEventListener('click', () => {
  console.log('Div clicked'); // Fires second (bubble)
});

document.body.addEventListener('click', () => {
  console.log('Body clicked'); // Fires third (bubble)
});
</script>
```

**Event capturing** is the opposite — the event fires on ancestor elements first, going down toward the target. To listen during the capture phase, pass `true` as the third argument to `addEventListener`:

```javascript
// This fires BEFORE the target's handler
document.getElementById('parent').addEventListener('click', () => {
  console.log('Parent (capture)');
}, true); // true = capture phase

document.getElementById('child').addEventListener('click', () => {
  console.log('Child (target)');
});

// Output: "Parent (capture)" then "Child (target)"
```

**Stopping propagation:**

```javascript
element.addEventListener('click', (e) => {
  e.stopPropagation(); // Prevents further bubbling or capturing
  // e.stopImmediatePropagation(); // Also prevents other listeners on the same element
});
```

**Event delegation relies on bubbling.** When you attach a listener to a parent and check `e.target`, you're relying on the event bubbling up from the child to the parent.

**Practical considerations:**

- Most event listeners use bubbling (the default). Capturing is rarely used directly.
- The `onclick` attribute only fires during the bubbling phase.
- `e.stopPropagation()` can break event delegation and other patterns — use it carefully.
- Some events don't bubble: `focus`, `blur`, `mouseenter`, `mouseleave`, `scroll`, `load`. Use `focusin`/`focusout` for focus events that need to bubble.
- `e.target` is always the element that triggered the event; `e.currentTarget` is the element the listener is attached to.

```javascript
// Using currentTarget in delegation
parent.addEventListener('click', (e) => {
  console.log(e.target);        // The actual clicked element (child)
  console.log(e.currentTarget); // The parent (where listener is attached)
});
```
