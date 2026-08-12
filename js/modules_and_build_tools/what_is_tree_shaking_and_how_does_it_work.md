Tree shaking is a dead-code elimination technique used by bundlers (Webpack, Rollup, esbuild, Vite) to remove unused exports from the final bundle. The name comes from the idea of "shaking" a tree so dead leaves (unused code) fall off.

Tree shaking works because ES Modules have a static structure—all `import` and `export` statements are at the top level and resolved at parse time, not runtime. This allows bundlers to analyze the dependency graph and determine which exports are actually used.

```js
// math.js
export function add(a, b) { return a + b; }
export function subtract(a, b) { return a - b; }
export function multiply(a, b) { return a * b; }

// main.js
import { add } from './math.js';
console.log(add(1, 2));
```

The bundler sees that only `add` is imported from `math.js`. It marks `subtract` and `multiply` as unused and removes them from the output.

For tree shaking to work:

1. **Use ES Modules**: CommonJS `require()` is dynamic and cannot be statically analyzed. Tree shaking only works with `import`/`export`.

2. **Avoid side effects**: If a module has side effects (modifying globals, polyfills), the bundler cannot safely remove it. Mark modules as side-effect-free in `package.json`:
```json
{ "sideEffects": false }
```

3. **Do not re-export everything unnecessarily**:
```js
// Bad — forces bundler to include entire utils
export * from './utils';

// Better — only export what's needed
export { add, subtract } from './utils';
```

4. **Use named exports, not only default exports**: Named exports are more granular. A default export is a single value—if it is used, the entire module is included.

Bundler tools that support tree shaking:
- **Rollup**: Excellent tree shaking, designed for it from the start.
- **Webpack**: Supports it (production mode), but requires careful configuration.
- **esbuild**: Very fast, good tree shaking support.
- **Vite**: Uses esbuild/Rollup under the hood.

Tree shaking does not work at runtime—it is a build-time optimization. The unused code never makes it into the production bundle, reducing file size and load time.
