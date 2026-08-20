Dynamic imports allow you to load ES Modules on demand at runtime using the `import()` function syntax, instead of static `import` declarations at the top of a file. The `import()` function returns a Promise that resolves to the module object.

```js
// Static import (resolved at parse time)
import { add } from './math.js';

// Dynamic import (resolved at runtime)
const module = await import('./math.js');
module.add(1, 2);

// Or with .then()
import('./math.js').then(module => {
  module.add(1, 2);
});
```

Use cases:

**1. Code splitting / lazy loading**: Load modules only when needed, reducing initial bundle size.

```js
// Lazy-load a route component
button.addEventListener('click', async () => {
  const { default: Chart } = await import('./Chart.js');
  const chart = new Chart(data);
  chart.render();
});
```

**2. Conditional loading**: Load a module only under certain conditions.

```js
if (navigator.language === 'zh') {
  const { translations } = await import('./zh.js');
  applyTranslations(translations);
} else {
  const { translations } = await import('./en.js');
  applyTranslations(translations);
}
```

**3. Loading modules based on user input or configuration**:

```js
async function loadPlugin(pluginName) {
  try {
    const plugin = await import(`./plugins/${pluginName}.js`);
    return plugin.default;
  } catch (err) {
    console.error(`Plugin ${pluginName} not found`);
  }
}
```

**4. Feature detection**: Load polyfills only when needed.

```js
if (!window.fetch) {
  await import('./fetch-polyfill.js');
}
```

**5. React lazy loading**:

```js
const Dashboard = React.lazy(() => import('./Dashboard.js'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Dashboard />
    </Suspense>
  );
}
```

Dynamic imports work in browsers (with `<script type="module">`), Node.js (ESM), and all modern bundlers (Webpack, Vite, esbuild) which use them for code splitting. The path can be a variable, but bundlers may not be able to statically analyze it—template literals with partial paths may create larger chunks than intended.
