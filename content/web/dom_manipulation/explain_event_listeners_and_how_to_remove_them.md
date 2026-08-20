Event listeners are functions that are called when a specific event occurs on a DOM element. They are the primary way JavaScript handles user interactions, browser events, and custom events.

**Adding event listeners:**

```javascript
const button = document.querySelector('#myButton');

// addEventListener — the standard modern approach
button.addEventListener('click', function(event) {
  console.log('Button clicked!');
});

// With named function (required for removal)
function handleClick(event) {
  console.log('Clicked at', event.clientX, event.clientY);
}
button.addEventListener('click', handleClick);

// With options object
button.addEventListener('click', handleClick, {
  once: true,       // Remove after first invocation
  capture: false,   // Listen during capture phase (default: false)
  passive: false,   // Won't call preventDefault (default: false for most events)
  signal: controller.signal // AbortController signal for removal
});
```

**The event object:**

```javascript
element.addEventListener('click', (event) => {
  event.target;         // Element that triggered the event
  event.currentTarget;  // Element the listener is attached to
  event.type;           // 'click', 'keydown', etc.
  event.clientX;        // Mouse X position (for mouse events)
  event.clientY;        // Mouse Y position
  event.key;            // Key pressed (for keyboard events)
  event.keyCode;        // Deprecated — use event.key instead
  event.preventDefault(); // Prevent default behavior
  event.stopPropagation(); // Stop event propagation
  event.defaultPrevented; // Boolean: was preventDefault called?
});
```

**Removing event listeners:**

To remove an event listener, you must pass the **same function reference** that was used to add it. Anonymous functions cannot be removed.

```javascript
// CORRECT — named function can be removed
function handleClick(e) { console.log('clicked'); }
button.addEventListener('click', handleClick);
button.removeEventListener('click', handleClick);

// WRONG — anonymous functions can't be removed (different reference)
button.addEventListener('click', (e) => { console.log('clicked'); });
button.removeEventListener('click', (e) => { console.log('clicked'); }); // Does nothing!

// Use AbortController for easy cleanup
const controller = new AbortController();
button.addEventListener('click', handleClick, { signal: controller.signal });
button.addEventListener('mouseover', handleHover, { signal: controller.signal });
// Remove ALL listeners attached with this signal at once
controller.abort();

// Remove from inline handlers (legacy, not recommended)
// Only works with functions assigned to element.on-event properties
button.onclick = handleClick;
button.onclick = null; // Remove
```

**Common event types:**

```javascript
// Mouse events
element.addEventListener('click', handler);
element.addEventListener('dblclick', handler);
element.addEventListener('mousedown', handler);
element.addEventListener('mouseup', handler);
element.addEventListener('mousemove', handler);
element.addEventListener('mouseenter', handler);  // Doesn't bubble
element.addEventListener('mouseleave', handler);  // Doesn't bubble
element.addEventListener('mouseover', handler);   // Bubbles

// Keyboard events
document.addEventListener('keydown', handler);
document.addEventListener('keyup', handler);

// Form events
form.addEventListener('submit', handler);
input.addEventListener('input', handler);
input.addEventListener('change', handler);
input.addEventListener('focus', handler);  // Doesn't bubble
input.addEventListener('blur', handler);   // Doesn't bubble
input.addEventListener('focusin', handler); // Bubbles
input.addEventListener('focusout', handler); // Bubbles

// Window/document events
window.addEventListener('resize', handler);
window.addEventListener('scroll', handler);
window.addEventListener('load', handler);
document.addEventListener('DOMContentLoaded', handler);
```

**Cleanup patterns:**

```javascript
// Pattern 1: Clean up on component unmount (React)
useEffect(() => {
  const handler = () => { /* ... */ };
  window.addEventListener('resize', handler);
  return () => window.removeEventListener('resize', handler);
}, []);

// Pattern 2: AbortController (modern, preferred)
useEffect(() => {
  const controller = new AbortController();
  window.addEventListener('resize', handleResize, { signal: controller.signal });
  window.addEventListener('scroll', handleScroll, { signal: controller.signal });
  return () => controller.abort();
}, []);

// Pattern 3: once option for one-time listeners
button.addEventListener('click', handleOnce, { once: true });
```

**Best practices:**

1. Always remove event listeners when no longer needed to prevent memory leaks
2. Use named functions or `AbortController` for cleanup
3. Use event delegation for dynamically created elements
4. Prefer `addEventListener` over `onclick` attributes
5. Use `{ passive: true }` for scroll/touch handlers that don't call `preventDefault`
