Keyboard navigation is essential for users who cannot use a mouse — including people with motor disabilities, screen reader users, and power users who prefer keyboard shortcuts. A keyboard-navigable application ensures all interactive elements can be reached and operated using only the keyboard.

**Native HTML elements are keyboard accessible by default:**

```html
<!-- ✅ These are all keyboard accessible by default -->
<a href="/about">About</a>
<button type="submit">Submit</button>
<input type="text" />
<select>
  <option>Option 1</option>
</select>
<textarea></textarea>
<input type="checkbox" />
<input type="radio" name="group" />

<!-- ❌ These are NOT keyboard accessible -->
<div onclick="handleClick()">Click me</div>
<span class="button">Submit</span>
<div class="link" onclick="navigate()">About</div>
```

**Making custom elements keyboard accessible:**

```html
<!-- Custom button — add tabindex and keyboard handlers -->
<div
  role="button"
  tabindex="0"
  onclick="handleClick()"
  onkeydown="handleKeyDown(event)"
>
  Click me
</div>

<script>
function handleKeyDown(event) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    handleClick();
  }
}
</script>
```

**tabindex values:**

- `tabindex="0"` — Adds element to the natural tab order
- `tabindex="-1"` — Programmatically focusable but not in tab order
- `tabindex="1"` — Forces element to be first in tab order (avoid this)

```html
<!-- ✅ Good — natural tab order -->
<button>First</button>
<button>Second</button>
<a href="/page">Link</a>

<!-- ✅ Good — programmatically focusable for focus management -->
<div tabindex="-1" id="error-summary">
  Please fix the following errors:
</div>

<!-- ❌ Bad — messes up tab order -->
<div tabindex="1">Forced first</div>
<div tabindex="2">Forced second</div>
```

**Focus management:**

```javascript
// Focus an element programmatically
document.querySelector('#modal-close').focus();

// Focus the first input in a form
document.querySelector('input').focus();

// Move focus to error summary
document.querySelector('#error-summary').focus();

// Focus trap for modals
function trapFocus(modal) {
  const focusableElements = modal.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const first = focusableElements[0];
  const last = focusableElements[focusableElements.length - 1];

  modal.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
}
```

**Common keyboard interactions:**

| Element | Keys |
|---------|------|
| Button | Enter, Space |
| Link | Enter |
| Checkbox | Space |
| Radio | Arrow keys (within group), Space |
| Select | Arrow keys, Enter |
| Tab (ARIA) | Arrow keys |
| Menu | Arrow keys, Escape to close |
| Dialog | Escape to close, Tab trapped inside |

**CSS for focus indicators:**

```css
/* Default outline (good for accessibility) */
:focus {
  outline: 2px solid #4A90D9;
  outline-offset: 2px;
}

/* Better: only show for keyboard focus */
:focus:not(:focus-visible) {
  outline: none;
}

:focus-visible {
  outline: 3px solid #4A90D9;
  outline-offset: 2px;
}

/* High contrast mode support */
@media (forced-colors: active) {
  :focus-visible {
    outline: 3px solid Highlight;
  }
}
```

**React focus management:**

```jsx
function Modal({ isOpen, onClose, children }) {
  const modalRef = useRef(null);
  const previousFocus = useRef(null);

  useEffect(() => {
    if (isOpen) {
      previousFocus.current = document.activeElement;
      modalRef.current.focus();
    } else if (previousFocus.current) {
      previousFocus.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
      onKeyDown={(e) => e.key === 'Escape' && onClose()}
    >
      {children}
      <button onClick={onClose}>Close</button>
    </div>
  );
}
```

**Testing keyboard navigation:**

1. Tab through all interactive elements — can you reach everything?
2. Enter/Space activates buttons and links
3. Arrow keys work in menus, tabs, and radio groups
4. Escape closes modals and dropdowns
5. Focus is visible at all times
6. Focus order is logical (follows visual layout)
7. No focus traps (can always tab out of a section)
