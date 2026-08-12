Tree shaking is a dead code elimination technique used by JavaScript bundlers (Webpack, Rollup, Vite, esbuild) to remove unused exports from the final bundle. The name comes from the analogy of shaking a tree to remove dead leaves — the bundler "shakes" the dependency tree to eliminate code that isn't actually used.

**How it works:**

Tree shaking relies on ES modules' static structure. Because `import` and `export` statements are at the top level and can be statically analyzed, the bundler can determine which exports are used and which are not.

```javascript
// utils.js — exports 3 functions
export function add(a, b) { return a + b; }
export function subtract(a, b) { return a - b; }
export function multiply(a, b) { return a * b; }

// app.js — only imports add
import { add } from './utils.js';
console.log(add(1, 2));

// After tree shaking, the bundle contains only:
// - add function
// - app.js code
// subtract and multiply are removed
```

**Requirements for tree shaking to work:**

1. **ES module syntax** — Must use `import`/`export`, not `require`/`module.exports`
2. **Static imports** — Dynamic imports can be tree-shaken at the module level, but not individual exports
3. **Side-effect-free modules** — Modules with side effects may not be fully tree-shaken

**ES modules vs CommonJS:**

```javascript
// ✅ Tree-shakeable (ES modules)
import { debounce } from 'lodash-es';
export { debounce, throttle };

// ❌ NOT tree-shakeable (CommonJS)
const _ = require('lodash');
module.exports = { debounce: _.debounce };
```

**Side effects and tree shaking:**

```javascript
// This module has side effects — cannot be fully tree-shaken
console.log('Module loaded!'); // Side effect
export function helper() { }

// package.json — declare side effects
{
  "sideEffects": false  // All modules are side-effect free
}

// Or specify which files have side effects
{
  "sideEffects": ["*.css", "./src/polyfills.js"]
}
```

**Webpack configuration for tree shaking:**

```javascript
// webpack.config.js
module.exports = {
  mode: 'production', // Enables tree shaking and minification
  optimization: {
    usedExports: true,     // Mark unused exports
    minimize: true,        // Remove dead code (terser)
    sideEffects: true,     // Respect package.json sideEffects flag
    concatenateModules: true // Scope hoisting — concatenate modules into one scope
  }
};
```

**Common tree-shaking pitfalls:**

```javascript
// Pitfall 1: Importing entire library
import _ from 'lodash'; // Imports everything
_.debounce(fn, 300);

// Solution: Use specific imports or lodash-es
import { debounce } from 'lodash-es';
import debounce from 'lodash/debounce';

// Pitfall 2: Re-exporting with barrel files
// index.js (barrel)
export * from './moduleA';
export * from './moduleB';
export * from './moduleC';
// If you import one thing from index.js, bundler may include all modules

// Solution: Import directly from specific modules
import { something } from './moduleA';

// Pitfall 3: Assigning to exports
export let count = 0;
export function increment() { count++; }
// count cannot be removed even if unused (it's mutable)

// Solution: Use const for values that shouldn't change

// Pitfall 4: Side effects in constructors or getters
export class Logger {
  constructor() {
    console.log('Logger created'); // Side effect
  }
}
```

**Verifying tree shaking:**

```bash
# Webpack bundle analyzer
npx webpack --profile --json > stats.json
npx webpack-bundle-analyzer stats.json

# Check for unused exports in the bundle
# Search for the code you expect to be removed
```

**Vite and Rollup** enable tree shaking by default in production builds, as they use ES modules natively. Tree shaking is a critical optimization — it can reduce bundle sizes by 30-70% for libraries with large APIs where only a fraction is used.
