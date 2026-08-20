Source maps are files that map transformed/minified code back to the original source code. They allow developers to debug production code using the original source, making it possible to set breakpoints, read meaningful variable names, and see the correct file and line numbers in browser DevTools.

**How source maps work:**

When you build a production bundle, your code undergoes several transformations:
- TypeScript → JavaScript
- JSX → `React.createElement`
- ES6+ → ES5 (via Babel)
- Multiple files → Single bundle
- Minification (whitespace removal, variable mangling)

Source maps create a mapping between the final output and the original source, so DevTools can show you the original code.

**What a source map looks like:**

```json
{
  "version": 3,
  "file": "bundle.min.js",
  "sources": ["../src/App.tsx", "../src/utils.ts"],
  "sourcesContent": ["import ...", "export function ..."],
  "names": ["useState", "handleClick"],
  "mappings": "AAAA,SAASA..."
}
```

**Enabling source maps:**

```javascript
// Vite — development has source maps by default
// vite.config.js
export default defineConfig({
  build: {
    sourcemap: true // Generate source maps for production
  }
});

// Webpack
module.exports = {
  devtool: 'source-map',           // Full source map (separate file)
  devtool: 'eval-source-map',     // Inline, fast (development)
  devtool: 'hidden-source-map',   // Generated but not referenced
  devtool: 'nosources-source-map' // Shows stack traces without source code
};

// TypeScript
// tsconfig.json
{
  "compilerOptions": {
    "sourceMap": true
  }
}
```

**Source map types (Webpack devtool options):**

| Option | Speed | Quality | Use Case |
|--------|-------|---------|----------|
| `eval` | Fastest | Generated code | Development |
| `eval-source-map` | Fast | Original source | Development |
| `source-map` | Slow | Original source | Production (separate file) |
| `hidden-source-map` | Slow | Original source | Production (no reference in bundle) |
| `nosources-source-map` | Slow | Stack traces only | Production (hide source from users) |
| `cheap-module-source-map` | Medium | Module-level only | Development (faster) |

**Production source map strategies:**

```javascript
// 1. Generate and upload to error tracking service
// webpack.config.js
const { SourceMapDevToolPlugin } = require('webpack');

module.exports = {
  devtool: 'hidden-source-map', // Generate but don't expose
  plugins: [
    new SourceMapDevToolPlugin({
      filename: 'sourcemaps/[file].map',
      publicPath: 'https://cdn.example.com/',
      noSources: true // Don't include source content
    })
  ]
};

// Upload to Sentry
// sentry-cli releases files VERSION upload-sourcemaps ./dist --url-prefix '~/static/js'
```

```javascript
// 2. Keep source maps private (server-side only)
// Don't serve .map files to users
// nginx config
location ~ \.map$ {
  deny all;
}
```

**Debugging with source maps:**

1. Open browser DevTools (F12)
2. Go to the Sources tab
3. Navigate to `webpack://` or `vite://` in the file tree
4. Find your original source files
5. Set breakpoints, inspect variables, step through code

**Why source maps are useful:**

1. **Production debugging** — Debug minified production code using original source
2. **Error tracking** — Services like Sentry, Datadog, and New Relic use source maps to show original stack traces
3. **Performance profiling** — Profile production code while seeing original function names
4. **Development** — Debug transpiled TypeScript/JSX using the original source

**Security considerations:**

Source maps can expose your source code to anyone who accesses them. For production:

1. **Don't serve source maps publicly** — Use `hidden-source-map` or restrict access
2. **Upload to error tracking** — Upload source maps to Sentry/Datadog for stack traces, then delete them
3. **Use `nosources-source-map`** — Shows stack traces without source content
4. **Remove source maps from production builds** — Generate them separately and upload to error tracking

**Source maps and CSS:**

CSS source maps work the same way — they map minified CSS back to the original Sass/Less/PostCSS source:

```javascript
// PostCSS
module.exports = {
  plugin: {
    // PostCSS plugins
  },
  map: { inline: false }
};
```

**Browser support:**

All modern browsers support source maps. DevTools automatically loads source maps when they're available, making debugging production code nearly as easy as debugging development code.
