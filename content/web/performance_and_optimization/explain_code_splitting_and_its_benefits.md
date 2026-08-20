Code splitting is the practice of breaking a large JavaScript bundle into smaller chunks that can be loaded on demand. Instead of loading the entire application upfront, you load only the code needed for the current page or feature, then load additional code as the user navigates or interacts.

**Without code splitting:**
```
Bundle.js (2MB) — loads everything on initial page load
├── Framework (React, Vue)
├── Application code
├── All routes/pages
├── All components
└── All third-party libraries
```

**With code splitting:**
```
main.js (200KB) — loads immediately
├── Framework
└── Core app shell

dashboard.js (150KB) — loads when user visits /dashboard
settings.js (80KB) — loads when user visits /settings
chart.js (120KB) — loads when user opens analytics
vendor.js (300KB) — shared dependencies
```

**How to implement code splitting:**

**Dynamic imports:**
```javascript
// Static import — always included in the bundle
import { Chart } from './chart';

// Dynamic import — creates a separate chunk, loaded on demand
button.addEventListener('click', async () => {
  const { Chart } = await import('./chart.js');
  const chart = new Chart(canvas);
});

// With error handling
async function loadChart() {
  try {
    const module = await import('./chart.js');
    return module.Chart;
  } catch (error) {
    console.error('Failed to load chart module:', error);
  }
}
```

**Route-based code splitting (React):**
```jsx
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const Home = lazy(() => import('./pages/Home'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Settings = lazy(() => import('./pages/Settings'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
```

**Component-level code splitting:**
```jsx
const HeavyEditor = lazy(() => import('./RichTextEditor'));

function BlogPost() {
  const [showEditor, setShowEditor] = useState(false);

  return (
    <div>
      <article>{content}</article>
      {showEditor ? (
        <Suspense fallback={<EditorSkeleton />}>
          <HeavyEditor />
        </Suspense>
      ) : (
        <button onClick={() => setShowEditor(true)}>Edit</button>
      )}
    </div>
  );
}
```

**Webpack configuration:**
```javascript
// webpack.config.js
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  }
};
```

**Benefits of code splitting:**

1. **Faster initial load** — Only critical code is loaded upfront, reducing Time to Interactive (TTI)
2. **Reduced bandwidth** — Users download only the code they actually use
3. **Better caching** — Vendor code changes less frequently, so it can be cached longer
4. **Improved Core Web Vitals** — Directly impacts Largest Contentful Paint (LCP) and First Input Delay (FID)

**When to split:**

- **Route boundaries** — Each page/view becomes a separate chunk
- **Large libraries** — Split heavy libraries (charts, editors, maps) that aren't needed on every page
- **Feature flags** — Load code for features the user has access to
- **Below-the-fold content** — Defer loading components that aren't immediately visible
- **Conditional features** — Load code only when a user takes a specific action

**Monitoring bundle size:**

```bash
# Analyze webpack bundles
npx webpack --profile --json > stats.json
npx webpack-bundle-analyzer stats.json

# Vite
npx vite-bundle-visualizer
```

Code splitting is a fundamental performance optimization for any non-trivial web application. Combined with lazy loading and proper caching strategies, it ensures users only download what they need when they need it.
