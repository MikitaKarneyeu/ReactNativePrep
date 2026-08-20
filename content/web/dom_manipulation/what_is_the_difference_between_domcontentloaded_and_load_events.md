`DOMContentLoaded` and `load` are two important page lifecycle events that fire at different points during page loading, and understanding when each fires is critical for writing reliable JavaScript.

**`DOMContentLoaded`** fires when the HTML document has been completely parsed and all deferred scripts and stylesheets have been downloaded and executed. It does NOT wait for images, subframes, or other resources to finish loading.

```javascript
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM is ready — all HTML parsed, scripts executed');
  // Safe to query and manipulate the DOM
  const header = document.querySelector('header');
  header.textContent = 'Welcome!';
});
```

**`load`** fires when the entire page has finished loading, including all dependent resources: images, stylesheets, iframes, fonts, and other assets.

```javascript
window.addEventListener('load', () => {
  console.log('Page fully loaded — including images, styles, fonts');
  // All resources are available
  const img = document.querySelector('img');
  console.log(img.naturalWidth, img.naturalHeight); // Image dimensions available
});
```

**Timeline:**

```
1. HTML parsing begins
2. Scripts with `defer` are downloaded in parallel
3. CSS is downloaded and parsed
4. Deferred scripts are executed in order
5. DOM is fully constructed
   → DOMContentLoaded fires
6. Images, iframes, fonts, and other resources finish loading
   → window load fires
```

**Key differences:**

| Aspect | `DOMContentLoaded` | `load` |
|--------|-------------------|--------|
| Fires when | HTML parsed, deferred scripts run | All resources loaded |
| Listens on | `document` | `window` |
| Images ready | No | Yes |
| Fonts ready | Usually yes | Yes |
| Iframes ready | No | Yes |
| Use case | DOM manipulation, early initialization | Image dimensions, resource-dependent code |

**Script loading and timing:**

```html
<!-- Regular script — blocks parsing, DOMContentLoaded fires after it runs -->
<script src="app.js"></script>

<!-- Deferred — downloaded in parallel, executed after DOM is parsed -->
<script defer src="app.js"></script>
<!-- DOMContentLoaded fires after all deferred scripts -->

<!-- Async — downloaded in parallel, executed as soon as ready (may block parsing) -->
<script async src="analytics.js"></script>
<!-- DOMContentLoaded may fire before or after async script -->
```

**Practical usage:**

```javascript
// DOMContentLoaded — most common for DOM-dependent code
document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
  setupEventListeners();
  renderInitialData();
});

// load — when you need all resources
window.addEventListener('load', () => {
  calculateLayoutBasedOnImages();
  initializeAnimationLibrary();
  measurePagePerformance();
});

// Checking if DOM is already loaded (edge case)
if (document.readyState === 'loading') {
  // Still parsing — wait for DOMContentLoaded
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  // DOM already loaded — run immediately
  initApp();
}

// jQuery's $(document).ready() was equivalent to DOMContentLoaded
// jQuery's $(window).on('load', ...) was equivalent to load
```

**`beforeunload` and `unload`:**

```javascript
// Warn user before leaving (e.g., unsaved changes)
window.addEventListener('beforeunload', (event) => {
  if (hasUnsavedChanges) {
    event.preventDefault();
    event.returnValue = ''; // Required for Chrome
  }
});

// Cleanup on page unload (unreliable for important operations)
window.addEventListener('unload', () => {
  navigator.sendBeacon('/log', analyticsData);
});
```

**Best practice:** Use `DOMContentLoaded` for almost all JavaScript initialization. It ensures the DOM is ready without waiting for slow images. Use `load` only when you specifically need all resources to be available. With modern development using `defer` scripts at the end of `<body>`, you often don't need either event — the DOM is ready when the script executes.
