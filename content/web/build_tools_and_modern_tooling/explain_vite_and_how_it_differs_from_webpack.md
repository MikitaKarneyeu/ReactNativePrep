Vite is a modern build tool and development server created by Evan You (Vue.js creator). It uses native ES modules in the browser for instant development server startup and Rollup for optimized production builds, providing a significantly faster development experience compared to Webpack.

**How Vite works in development:**

Unlike Webpack, which bundles all modules before serving, Vite serves source files over native ES modules:

1. The browser requests the entry HTML file
2. Vite transforms and serves the entry module
3. The browser encounters `import` statements and requests those modules directly
4. Vite transforms each module on-demand as the browser requests it
5. No bundling in development — modules are served individually

```
Webpack:  Build entire bundle → Serve bundle → Browser loads bundle
Vite:     Serve entry → Browser requests imports → Vite transforms on demand
```

**Why Vite is fast:**

1. **No bundling in development** — Uses native ES modules, so there's no bundling step
2. **esbuild for dependencies** — Pre-bundles node_modules using esbuild (written in Go, 10-100x faster than JavaScript-based bundlers)
3. **On-demand transformation** — Only transforms files that are actually requested
4. **Hot Module Replacement (HMR)** — Faster HMR because it only needs to update the changed module

**Basic Vite configuration:**

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://localhost:8080'
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom']
        }
      }
    }
  }
});
```

**Vite vs Webpack:**

| Aspect | Vite | Webpack |
|--------|------|---------|
| Dev startup | Instant (ES modules) | Slower (bundles everything) |
| HMR speed | Milliseconds | Seconds (large projects) |
| Build tool | Rollup (production) | Webpack itself |
| Configuration | Minimal, sensible defaults | Extensive configuration |
| Dependencies pre-bundling | esbuild (Go) | JavaScript-based |
| Source maps | Fast (esbuild) | Slower |
| Learning curve | Low | High |
| Plugin ecosystem | Growing (Rollup + Vite plugins) | Mature, extensive |
| Module Federation | Via plugin | Native support |
| Legacy browser support | Via @vitejs/plugin-legacy | Built-in |

**Vite plugins:**

```javascript
// vite.config.js
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    svgr(),
    VVitePWA({ registerType: 'autoUpdate' })
  ]
});
```

**Environment variables:**

```javascript
// .env
VITE_API_URL=https://api.example.com
VITE_APP_TITLE=My App

// Access in code (must be prefixed with VITE_)
console.log(import.meta.env.VITE_API_URL);
console.log(import.meta.env.MODE);
console.log(import.meta.env.PROD);
```

**SSR support:**

```javascript
// Vite has built-in SSR support
// server.js
import { createServer } from 'vite';

const vite = await createServer({
  server: { middlewareMode: true }
});

app.use(vite.middlewares);
```

**When to choose Vite:**

1. **New projects** — Vite is the default choice for new React, Vue, or Svelte projects
2. **Developer experience priority** — Instant startup and fast HMR improve productivity
3. **Modern browsers** — Vite targets modern browsers by default
4. **Simple to moderate configuration needs** — Vite's defaults work well for most projects

**When to choose Webpack:**

1. **Existing Webpack projects** — Migration may not be worth the effort
2. **Module Federation** — Micro-frontend architecture
3. **Complex custom requirements** — Webpack's extensive plugin system offers more flexibility
4. **Legacy browser support** — More mature legacy support options

**Vite project setup:**

```bash
# Create new Vite project
npm create vite@latest my-app -- --template react

# Or with TypeScript
npm create vite@latest my-app -- --template react-ts

# Add to existing project
npm install vite @vitejs/plugin-react --save-dev
```

Vite has become the standard build tool for modern frontend development. Create React App has been deprecated in favor of Vite, and most new projects default to Vite.
