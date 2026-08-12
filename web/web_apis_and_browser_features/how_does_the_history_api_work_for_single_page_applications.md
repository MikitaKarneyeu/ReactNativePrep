The History API allows JavaScript to manipulate the browser's session history — the list of pages the user has navigated through. It is the foundation of client-side routing in single-page applications (SPAs), enabling navigation without full page reloads while maintaining proper URLs and browser history.

**Core methods:**

```javascript
// pushState — add a new entry to the history stack
history.pushState(
  { page: 'home' },        // State object (serializable data)
  'Home Page',             // Title (ignored by most browsers)
  '/home'                  // URL (relative or absolute)
);

// replaceState — update the current history entry without adding a new one
history.replaceState(
  { page: 'settings' },
  'Settings',
  '/settings'
);

// Navigation
history.back();      // Go back one step (like clicking browser back button)
history.forward();   // Go forward one step
history.go(-2);      // Go back two steps
history.go(0);       // Reload current page
```

**The `popstate` event** fires when the user navigates using the browser's back/forward buttons:

```javascript
window.addEventListener('popstate', (event) => {
  console.log('Navigated to:', window.location.pathname);
  console.log('State:', event.state);

  // Update the page content based on the new URL
  routeTo(window.location.pathname);
});
```

**How SPAs use the History API:**

```javascript
// Router implementation (simplified)
class Router {
  constructor(routes) {
    this.routes = routes;
    window.addEventListener('popstate', () => this.handleRoute());
  }

  navigate(path, state = {}) {
    history.pushState(state, '', path);
    this.handleRoute();
  }

  handleRoute() {
    const path = window.location.pathname;
    const handler = this.routes[path] || this.routes['/404'];
    handler();
  }
}

// Usage
const router = new Router({
  '/': () => renderHome(),
  '/about': () => renderAbout(),
  '/users': () => renderUsers(),
  '/404': () => renderNotFound()
});

// Navigate programmatically
document.querySelector('.nav-home').addEventListener('click', (e) => {
  e.preventDefault();
  router.navigate('/');
});
```

**`pushState` vs `replaceState`:**

- `pushState` adds a new entry — the user can press "Back" to return to the previous state
- `replaceState` modifies the current entry — no new history entry, no back button entry

```javascript
// Tab switching — replace state (back button shouldn't cycle through tabs)
tab.addEventListener('click', () => {
  history.replaceState({ tab: 'reviews' }, '', '/product#reviews');
});

// Page navigation — push state (back button should work)
link.addEventListener('click', () => {
  history.pushState({ page: 'details' }, '', '/product/123');
});
```

**Handling the `hashchange` event (alternative for hash-based routing):**

```javascript
window.addEventListener('hashchange', () => {
  const hash = window.location.hash; // "#/about"
  routeTo(hash);
});
```

**Key considerations:**

1. **Server configuration** — With History API routing, the server must return the SPA's `index.html` for all routes (not just `/`), because direct navigation to `/about` needs to serve the SPA first, then JavaScript handles the routing.
2. **State limitations** — State objects must be serializable. Functions, DOM nodes, and circular references cannot be stored.
3. **URL update is cosmetic** — `pushState` only changes the URL displayed in the address bar; it does not load a new page.
4. **`popstate` does not fire on `pushState`** — Only browser back/forward and `history.go()` trigger `popstate`.
5. **Scroll restoration** — Browsers try to restore scroll position on back/forward. Use `history.scrollRestoration = 'manual'` to control this yourself.

**History API vs hash-based routing:**

| Aspect | History API (`pushState`) | Hash routing (`#/path`) |
|--------|--------------------------|------------------------|
| URLs | Clean (`/about`) | Hash-based (`/#/about`) |
| Server config | Required | Not required |
| SEO | Better (clean URLs) | Worse |
| Complexity | Higher | Simpler |
| Browser support | All modern | All browsers |
