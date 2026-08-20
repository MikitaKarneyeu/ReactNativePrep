`localStorage` and `sessionStorage` are both part of the Web Storage API that allow you to store key-value pairs in the browser, but they differ in persistence, scope, and use cases.

**`localStorage`** persists data with no expiration time. Data remains available even after the browser is closed and reopened.

```javascript
// Store data
localStorage.setItem('username', 'alice');
localStorage.setItem('theme', 'dark');
localStorage.setItem('preferences', JSON.stringify({ fontSize: 16, lang: 'en' }));

// Retrieve data
const username = localStorage.getItem('username'); // "alice"
const prefs = JSON.parse(localStorage.getItem('preferences')); // {fontSize: 16, lang: 'en"}

// Remove data
localStorage.removeItem('username');

// Clear all data
localStorage.clear();

// Get key by index
localStorage.key(0);

// Check number of stored items
localStorage.length;
```

**`sessionStorage`** persists data for the duration of the browser session. Data is cleared when the tab or browser is closed.

```javascript
// Same API as localStorage
sessionStorage.setItem('formData', JSON.stringify({ name: 'Alice', step: 2 }));
const formData = JSON.parse(sessionStorage.getItem('formData'));
sessionStorage.removeItem('formData');
```

**Key differences:**

| Aspect | `localStorage` | `sessionStorage` |
|--------|---------------|-----------------|
| Lifetime | Until explicitly deleted | Until tab/browser is closed |
| Scope | Shared across all tabs of same origin | Isolated per tab |
| Storage limit | ~5-10MB per origin | ~5-10MB per origin |
| API | `setItem`, `getItem`, `removeItem`, `clear` | Same API |
| Survives refresh | Yes | Yes |
| Survives tab close | Yes | No |
| Shared between tabs | Yes | No (each tab has its own) |

**When to use each:**

**Use `localStorage` for:**
- User preferences (theme, language, layout)
- Cached data that should persist across sessions
- Authentication tokens (with security considerations)
- Application state that should survive browser restarts

**Use `sessionStorage` for:**
- Multi-step form data (survives accidental refresh, cleared on close)
- Temporary UI state per tab
- Sensitive data that shouldn't persist
- Per-tab application state

**Important considerations:**

```javascript
// Both are synchronous — can block the main thread for large data
// Both only store strings — must serialize objects
localStorage.setItem('data', JSON.stringify(largeObject)); // Serialize
const data = JSON.parse(localStorage.getItem('data'));      // Deserialize

// Both are per-origin (protocol + domain + port)
// https://example.com and http://example.com have different storage
// https://example.com:3000 and https://example.com:8080 have different storage

// Error handling — storage can be full or disabled
try {
  localStorage.setItem('key', 'value');
} catch (e) {
  if (e.name === 'QuotaExceededError') {
    console.log('Storage is full');
  }
}

// Listen for storage changes across tabs (localStorage only)
window.addEventListener('storage', (e) => {
  console.log(e.key, e.oldValue, e.newValue);
  // Fires in OTHER tabs when localStorage changes in one tab
});
```

**Security concerns:**

- Both are accessible via JavaScript — vulnerable to XSS attacks
- Never store sensitive data (passwords, tokens) without encryption
- Data is visible in browser DevTools → Application tab
- Consider using `httpOnly` cookies for authentication tokens instead

**Alternatives:**
- **IndexedDB** — For large, structured data with async API
- **Cookies** — For small data that needs to be sent with every request
- **Cache API** — For caching network responses
