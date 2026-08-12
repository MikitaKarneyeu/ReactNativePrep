Many HTML elements have default browser behaviors — links navigate to URLs, forms submit and reload the page, right-click opens a context menu, and so on. You can prevent these behaviors using `event.preventDefault()`.

**`event.preventDefault()`:**

```javascript
// Prevent link navigation
document.querySelector('a').addEventListener('click', (e) => {
  e.preventDefault();
  // Handle navigation with JavaScript instead
  console.log('Link clicked but not navigating');
});

// Prevent form submission (for AJAX handling)
document.querySelector('form').addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  fetch('/api/submit', { method: 'POST', body: formData });
});

// Prevent right-click context menu
document.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  showCustomMenu(e.clientX, e.clientY);
});

// Prevent keyboard shortcuts
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key === 's') {
    e.preventDefault();
    saveDocument();
  }
});

// Prevent scrolling
modal.addEventListener('wheel', (e) => {
  e.preventDefault();
}, { passive: false }); // passive: false required for preventDefault on scroll/touch

// Prevent drag and drop on an element
document.addEventListener('dragover', (e) => {
  e.preventDefault();
});
```

**Common use cases:**

1. **Form handling** — Prevent page reload on form submit, handle with JavaScript/fetch
2. **Single-page app navigation** — Intercept link clicks, use History API instead
3. **Custom keyboard shortcuts** — Override browser defaults like Ctrl+S
4. **Custom context menus** — Replace right-click menu with your own
5. **Input validation** — Prevent typing certain characters
6. **Touch/scroll control** — Prevent scroll in modals or carousels

```javascript
// Input: prevent non-numeric characters
input.addEventListener('keypress', (e) => {
  if (!/[0-9]/.test(e.key)) {
    e.preventDefault();
  }
});

// Prevent double form submission
form.addEventListener('submit', (e) => {
  if (form.dataset.submitting) {
    e.preventDefault();
    return;
  }
  form.dataset.submitting = 'true';
});

// Prevent backspace from navigating back
document.addEventListener('keydown', (e) => {
  if (e.key === 'Backspace' && !isInputFocused()) {
    e.preventDefault();
  }
});
```

**`event.stopPropagation()` vs `event.preventDefault()`:**

- `preventDefault()` — Stops the browser's default behavior for that event
- `stopPropagation()` — Stops the event from bubbling/capturing to parent elements
- They are independent — calling one does not affect the other

```javascript
link.addEventListener('click', (e) => {
  e.preventDefault();    // Don't navigate
  e.stopPropagation();   // Don't bubble to parent listeners
});
```

**Passive event listeners:** For performance, some events (touch, wheel) are treated as passive by default, meaning `preventDefault()` cannot be called. If you need to prevent default on these events, you must explicitly set `{ passive: false }`:

```javascript
element.addEventListener('touchmove', (e) => {
  e.preventDefault();
}, { passive: false });
```

**`return false` in inline handlers:** In HTML inline event handlers, `return false` calls `preventDefault()` — but this pattern is outdated. Always use `addEventListener` and explicit `preventDefault()`.
