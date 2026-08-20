Client-side routing is a technique where navigation between pages is handled by JavaScript in the browser rather than by the server. Instead of making a full page request to the server for each URL, the client-side router intercepts navigation, updates the URL, and renders the appropriate component — all without a full page reload.

**How it works:**

1. User clicks a link or navigates to a URL
2. The client-side router intercepts the navigation (prevents default browser behavior)
3. The URL is updated using the History API (`pushState`/`replaceState`)
4. The router matches the URL to a route configuration
5. The corresponding component is rendered
6. The browser's history stack is updated (back/forward buttons work)

**The History API:**

```javascript
// Push a new entry to the history stack
history.pushState({ page: 'about' }, '', '/about');

// Replace the current entry (no new history entry)
history.replaceState({ page: 'settings' }, '', '/settings');

// Listen for back/forward navigation
window.addEventListener('popstate', (event) => {
  // Render the component for the new URL
  handleRoute(window.location.pathname);
});
```

**Simple router implementation:**

```javascript
class Router {
  constructor(routes) {
    this.routes = routes;
    this.currentRoute = null;

    // Listen for popstate (back/forward)
    window.addEventListener('popstate', () => this.resolve());

    // Intercept link clicks
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (link && link.href.startsWith(window.location.origin)) {
        e.preventDefault();
        this.navigate(link.pathname);
      }
    });
  }

  navigate(path) {
    history.pushState({}, '', path);
    this.resolve();
  }

  resolve() {
    const path = window.location.pathname;
    const route = this.routes.find(r => r.path === path) ||
                  this.routes.find(r => r.path === '*');
    if (route && route !== this.currentRoute) {
      this.currentRoute = route;
      route.component();
    }
  }
}

// Usage
const router = new Router([
  { path: '/', component: () => renderHome() },
  { path: '/about', component: () => renderAbout() },
  { path: '*', component: () => render404() }
]);
```

**Server configuration requirement:**

With client-side routing, the server must return the same HTML (the SPA shell) for all routes, because the client handles routing:

```nginx
# Nginx — serve index.html for all routes
location / {
  try_files $uri $uri/ /index.html;
}
```

**Client-side routing vs server-side routing:**

| Aspect | Client-side | Server-side |
|--------|------------|-------------|
| Navigation | JavaScript handles it | Server returns new HTML |
| Page reload | No | Yes |
| Initial load | Heavier (loads full app) | Lighter (only page content) |
| Subsequent navigation | Instant (no server round trip) | Requires server request |
| SEO | Requires SSR/SSG | Natural |
| State preservation | Easy (app stays in memory) | Lost on each navigation |
| First Contentful Paint | Slower (JS must load first) | Faster |

**Types of client-side routing:**

1. **History API routing** — Clean URLs (`/about`), requires server configuration
2. **Hash routing** — Uses hash fragments (`/#/about`), no server configuration needed
3. **Memory routing** — Routes stored in memory (React Native, testing)

```javascript
// Hash-based routing
window.addEventListener('hashchange', () => {
  const hash = window.location.hash; // "#/about"
  handleRoute(hash);
});
```

**Client-side routing with data loading:**

Modern frameworks (Next.js, Remix, React Router v6.4+) support data loading at the route level:

```javascript
// React Router v6.4+ data loading
const router = createBrowserRouter([
  {
    path: '/users/:id',
    element: <UserProfile />,
    loader: async ({ params }) => {
      const user = await fetchUser(params.id);
      return user;
    }
  }
]);
```

Client-side routing is the foundation of single-page applications and enables smooth, app-like navigation experiences on the web.
