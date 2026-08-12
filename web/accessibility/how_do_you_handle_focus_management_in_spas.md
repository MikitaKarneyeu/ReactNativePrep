Focus management in single-page applications (SPAs) is critical for accessibility because unlike traditional multi-page apps, SPAs don't trigger a full page reload on navigation. Without proper focus management, screen reader users and keyboard users may not know that content has changed or where they are in the page.

**The problem:**

In a traditional website, clicking a link loads a new page and focus moves to the top. In an SPA, the URL changes but focus stays wherever it was — potentially on a now-invisible element or in a completely different part of the page.

**Key focus management patterns:**

**1. Move focus to new content on navigation:**

```jsx
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

function MainContent({ children }) {
  const mainRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    // Move focus to main content on route change
    mainRef.current.focus();
  }, [location.pathname]);

  return (
    <main ref={mainRef} tabIndex={-1} aria-label="Main content">
      {children}
    </main>
  );
}
```

**2. Announce route changes to screen readers:**

```jsx
function RouteAnnouncer() {
  const location = useLocation();
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    // Get the page title or generate an announcement
    const title = document.title;
    setAnnouncement(`Navigated to ${title}`);
  }, [location.pathname]);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    >
      {announcement}
    </div>
  );
}
```

**3. Focus management for modals and dialogs:**

```jsx
function Modal({ isOpen, onClose, title, children }) {
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // Save currently focused element
      previousFocusRef.current = document.activeElement;

      // Focus the modal
      modalRef.current.focus();

      // Trap focus inside modal
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          onClose();
          return;
        }

        if (e.key === 'Tab') {
          trapFocus(modalRef.current, e);
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    } else {
      // Restore focus to previous element
      previousFocusRef.current?.focus();
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      tabIndex={-1}
    >
      <h2 id="modal-title">{title}</h2>
      {children}
      <button onClick={onClose}>Close</button>
    </div>
  );
}

function trapFocus(element, event) {
  const focusable = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}
```

**4. Focus management for dynamic content:**

```jsx
function ErrorSummary({ errors }) {
  const summaryRef = useRef(null);

  useEffect(() => {
    if (errors.length > 0) {
      summaryRef.current.focus();
    }
  }, [errors]);

  if (errors.length === 0) return null;

  return (
    <div ref={summaryRef} tabIndex={-1} role="alert" aria-labelledby="error-heading">
      <h2 id="error-heading">Please fix the following errors:</h2>
      <ul>
        {errors.map((error, i) => (
          <li key={i}>
            <a href={`#${error.fieldId}`}>{error.message}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

**5. Skip links:**

```jsx
function SkipLink() {
  return (
    <a href="#main-content" className="skip-link">
      Skip to main content
    </a>
  );
}

// CSS
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  padding: 8px;
  background: #000;
  color: #fff;
  z-index: 100;
}

.skip-link:focus {
  top: 0;
}
```

**6. Focus management for lists and data tables:**

```jsx
function VirtualList({ items }) {
  const listRef = useRef(null);

  const handleKeyDown = (e) => {
    const items = listRef.current.querySelectorAll('[role="listitem"]');
    const currentIndex = Array.from(items).indexOf(document.activeElement);

    if (e.key === 'ArrowDown' && currentIndex < items.length - 1) {
      e.preventDefault();
      items[currentIndex + 1].focus();
    } else if (e.key === 'ArrowUp' && currentIndex > 0) {
      e.preventDefault();
      items[currentIndex - 1].focus();
    }
  };

  return (
    <div ref={listRef} role="list" onKeyDown={handleKeyDown}>
      {items.map(item => (
        <div key={item.id} role="listitem" tabIndex={-1}>
          {item.name}
        </div>
      ))}
    </div>
  );
}
```

**Best practices:**

1. Use `tabIndex={-1}` for programmatically focusable elements
2. Move focus to new content after route changes
3. Announce navigation changes via `aria-live` regions
4. Restore focus when modals/dialogs close
5. Trap focus inside modals and dialogs
6. Use skip links to bypass repetitive navigation
7. Test with keyboard and screen reader after every navigation change
