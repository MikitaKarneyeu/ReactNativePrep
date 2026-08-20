Route-level code splitting is the practice of loading the JavaScript for each route only when the user navigates to that route. Instead of bundling the entire application into a single file, each route's code becomes a separate chunk that is loaded on demand, dramatically reducing the initial bundle size.

**How it works:**

```jsx
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Lazy-loaded route components
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Settings = lazy(() => import('./pages/Settings'));
const UserProfile = lazy(() => import('./pages/UserProfile'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/users/:id" element={<UserProfile />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

function PageLoader() {
  return <div className="page-loader">Loading...</div>;
}
```

**Without code splitting:**
```
Initial load:
app.js (2MB) — contains ALL routes
├── Home page code
├── Dashboard page code
├── Settings page code
├── Admin panel code
├── Charts library
└── Rich text editor

User visits /dashboard → loads 2MB (but only needs ~200KB)
```

**With code splitting:**
```
Initial load:
main.js (200KB) — framework + router + app shell

On navigation:
dashboard.chunk.js (150KB) — loaded only when visiting /dashboard
settings.chunk.js (80KB) — loaded only when visiting /settings
admin.chunk.js (250KB) — loaded only when visiting /admin
```

**React Router v6.4+ with lazy loading:**

```jsx
const router = createBrowserRouter([
  {
    path: '/',
    lazy: () => import('./pages/Home')
  },
  {
    path: '/dashboard',
    lazy: () => import('./pages/Dashboard')
  }
]);

// Each page exports a component and optionally a loader
// pages/Dashboard.jsx
export function Component() {
  return <Dashboard />;
}

export async function loader() {
  const data = await fetchDashboardData();
  return data;
}
```

**Nested route code splitting:**

```jsx
const Dashboard = lazy(() => import('./pages/Dashboard'));
const DashboardOverview = lazy(() => import('./pages/dashboard/Overview'));
const DashboardAnalytics = lazy(() => import('./pages/dashboard/Analytics'));
const DashboardSettings = lazy(() => import('./pages/dashboard/Settings'));

<Routes>
  <Route path="/dashboard" element={<Dashboard />}>
    <Route index element={<DashboardOverview />} />
    <Route path="analytics" element={<DashboardAnalytics />} />
    <Route path="settings" element={<DashboardSettings />} />
  </Route>
</Routes>
```

**Preloading route chunks:**

```jsx
// Preload on hover/focus for instant navigation
function NavLink({ to, children }) {
  const handleMouseEnter = () => {
    // Trigger the lazy import — starts downloading the chunk
    const route = routes[to];
    if (route?.preload) route.preload();
  };

  return (
    <Link to={to} onMouseEnter={handleMouseEnter} onFocus={handleMouseEnter}>
      {children}
    </Link>
  );
}

// Route preload map
const routes = {
  '/dashboard': { preload: () => import('./pages/Dashboard') },
  '/settings': { preload: () => import('./pages/Settings') }
};
```

**Suspense with route-level loading states:**

```jsx
function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Suspense fallback={<PageSkeleton />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </Suspense>
      </Layout>
    </BrowserRouter>
  );
}

// Per-route Suspense for granular loading states
<Routes>
  <Route
    path="/dashboard"
    element={
      <Suspense fallback={<DashboardSkeleton />}>
        <Dashboard />
      </Suspense>
    }
  />
</Routes>
```

**Benefits of route-level code splitting:**

1. **Faster initial load** — Users download only the framework and current page
2. **Better caching** — Route chunks are cached independently; updating one doesn't invalidate others
3. **Reduced bandwidth** — Users who visit only the homepage never download admin code
4. **Improved Core Web Vitals** — Better TTI (Time to Interactive) and LCP

**Build tools handle this automatically:**

When you use `React.lazy()` with dynamic `import()`, bundlers like Webpack, Vite, and Rollup automatically create separate chunks. No additional configuration is needed.

```javascript
// Vite/Webpack automatically create:
// - Home.chunk.js
// - Dashboard.chunk.js
// - Settings.chunk.js
// etc.
```

Route-level code splitting is one of the most impactful performance optimizations for single-page applications and should be implemented in any non-trivial application.
