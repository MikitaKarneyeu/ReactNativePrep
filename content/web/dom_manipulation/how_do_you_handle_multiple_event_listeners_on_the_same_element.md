Multiple event listeners can be attached to the same element for the same event type. They all fire in the order they were added (for listeners on the same element in the same phase), and you have several tools to manage, control, and clean them up.

**Adding multiple listeners to the same event:**

```javascript
const button = document.querySelector('#myButton');

// Each listener fires independently in the order they were added
button.addEventListener('click', () => {
  console.log('First listener'); // Fires first
});

button.addEventListener('click', () => {
  console.log('Second listener'); // Fires second
});

button.addEventListener('click', () => {
  console.log('Third listener'); // Fires third
});
```

**Controlling execution flow:**

```javascript
// Stop propagation prevents listeners on PARENT elements from firing
button.addEventListener('click', (e) => {
  e.stopPropagation(); // Parent listeners won't fire
});

// stopImmediatePropagation prevents OTHER listeners on the SAME element
button.addEventListener('click', (e) => {
  e.stopImmediatePropagation(); // Second and third listeners won't fire
  console.log('Only this listener runs');
});

button.addEventListener('click', () => {
  console.log('This will NOT run if stopImmediatePropagation was called');
});
```

**Removing specific listeners:**

```javascript
// Must use the same function reference
function validate(e) { /* ... */ }
function submit(e) { /* ... */ }
function log(e) { /* ... */ }

button.addEventListener('click', validate);
button.addEventListener('click', submit);
button.addEventListener('click', log);

// Remove only the submit listener
button.removeEventListener('click', submit);
// validate and log still active
```

**Using AbortController for group cleanup:**

```javascript
const controller = new AbortController();

button.addEventListener('click', validate, { signal: controller.signal });
button.addEventListener('click', submit, { signal: controller.signal });
button.addEventListener('click', log, { signal: controller.signal });
button.addEventListener('mouseover', highlight, { signal: controller.signal });

// Remove ALL listeners registered with this controller's signal
controller.abort();
```

**Using `once` for self-removing listeners:**

```javascript
// This listener fires once and then removes itself
button.addEventListener('click', handleOnce, { once: true });

// Multiple once listeners — each removes itself after firing
button.addEventListener('click', () => console.log('A'), { once: true });
button.addEventListener('click', () => console.log('B'), { once: true });
// First click: "A" then "B", both removed
// Second click: nothing happens
```

**Execution order rules:**

1. **Same element, same phase** — Listeners fire in the order they were registered
2. **Capture vs bubbling** — Capture listeners fire before bubble listeners on the same element
3. **Parent vs child (bubbling)** — Child listeners fire before parent listeners
4. **Parent vs child (capturing)** — Parent listeners fire before child listeners

```javascript
// Execution order example
parent.addEventListener('click', () => console.log('1. Parent capture'), true);
parent.addEventListener('click', () => console.log('4. Parent bubble'));
child.addEventListener('click', () => console.log('2. Child capture'), true);
child.addEventListener('click', () => console.log('3. Child bubble'));

// Click on child:
// 1. Parent capture
// 2. Child capture
// 3. Child bubble
// 4. Parent bubble
```

**Managing listeners with a registry pattern:**

```javascript
class ListenerRegistry {
  constructor() {
    this.listeners = new Map();
  }

  add(element, event, handler, options) {
    element.addEventListener(event, handler, options);
    if (!this.listeners.has(element)) {
      this.listeners.set(element, []);
    }
    this.listeners.get(element).push({ event, handler, options });
  }

  removeAll(element) {
    const elementListeners = this.listeners.get(element) || [];
    elementListeners.forEach(({ event, handler, options }) => {
      element.removeEventListener(event, handler, options);
    });
    this.listeners.delete(element);
  }

  clearAll() {
    for (const [element] of this.listeners) {
      this.removeAll(element);
    }
  }
}

const registry = new ListenerRegistry();
registry.add(button, 'click', handleClick);
registry.add(button, 'mouseover', handleHover);
// Later, remove all at once
registry.removeAll(button);
```

**Best practices:**

1. Use named functions when you need to remove specific listeners
2. Use `AbortController` for cleanup of groups of related listeners
3. Always clean up listeners when components unmount (React `useEffect` cleanup, etc.)
4. Be aware of listener execution order when multiple handlers depend on each other
5. Avoid `stopImmediatePropagation` unless absolutely necessary — it makes code harder to reason about
