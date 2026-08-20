The Web Storage API provides mechanisms for storing key-value pairs in the browser. It includes two interfaces: `localStorage` and `sessionStorage`. Both provide a simple synchronous API for persisting data on the client side.

**`localStorage` — persistent storage:**

```javascript
// Store data (always strings)
localStorage.setItem('username', 'alice');
localStorage.setItem('theme', 'dark');

// Store objects/arrays (must serialize)
localStorage.setItem('user', JSON.stringify({
  name: 'Alice',
  email: 'alice@example.com',
  preferences: { theme: 'dark', fontSize: 16 }
}));

// Retrieve data
const username = localStorage.getItem('username'); // "alice"
const user = JSON.parse(localStorage.getItem('user')); // {name: "Alice", ...}

// Remove a single item
localStorage.removeItem('username');

// Clear all storage for this origin
localStorage.clear();

// Get the key name at a specific index
localStorage.key(0);

// Number of stored items
localStorage.length;
```

**`sessionStorage` — tab-scoped storage:**

```javascript
// Same API as localStorage
sessionStorage.setItem('formData', JSON.stringify({ step: 2, name: 'Bob' }));
const formData = JSON.parse(sessionStorage.getItem('formData'));
sessionStorage.removeItem('formData');
sessionStorage.clear();
```

**Key differences:**

| Aspect | `localStorage` | `sessionStorage` |
|--------|---------------|-----------------|
| Lifetime | Until explicitly cleared | Until tab/browser is closed |
| Scope | Shared across all tabs of the same origin | Isolated per tab |
| Storage limit | ~5-10MB per origin | ~5-10MB per origin |
| Survives refresh | Yes | Yes |
| Survives tab close | Yes | No |
| Cross-tab sharing | Yes (storage event fires in other tabs) | No |

**Listening for changes across tabs (`localStorage` only):**

```javascript
window.addEventListener('storage', (event) => {
  console.log(event.key);       // Key that changed
  console.log(event.oldValue);  // Previous value
  console.log(event.newValue);  // New value
  console.log(event.url);       // URL of the page that made the change

  // This fires in OTHER tabs, not the one that made the change
  if (event.key === 'theme') {
    applyTheme(event.newValue);
  }
});
```

**Error handling:**

```javascript
try {
  localStorage.setItem('key', 'value');
} catch (error) {
  if (error.name === 'QuotaExceededError') {
    console.error('Storage is full');
    // Clean up old data or inform the user
  }
  // In private browsing mode, some browsers may throw on setItem
}
```

**Use cases:**

- **User preferences** — Theme, language, layout settings
- **Form data persistence** — Save form state to survive page refreshes
- **Caching API responses** — Store non-sensitive, frequently accessed data
- **Feature flags** — Simple on/off toggles
- **Shopping cart** — Temporary cart data before checkout

**Security considerations:**

- Storage is per-origin (protocol + hostname + port)
- Data is accessible to any JavaScript on the page — vulnerable to XSS
- Never store tokens, passwords, or sensitive data in Web Storage
- For sensitive data, use `httpOnly` cookies which are not accessible to JavaScript
- Data is visible in browser DevTools (Application tab)

**Comparison with other storage mechanisms:**

| Feature | localStorage | sessionStorage | Cookies | IndexedDB |
|---------|-------------|---------------|---------|-----------|
| Capacity | ~5-10MB | ~5-10MB | ~4KB | Hundreds of MB |
| API | Synchronous | Synchronous | Synchronous | Asynchronous |
| Auto-expiry | No | Tab close | Configurable | No |
| Sent with requests | No | No | Yes | No |
| Structured data | Strings only | Strings only | Strings only | Any |
