CommonJS (CJS) and ES Modules (ESM) are two module systems in JavaScript. They differ in syntax, loading behavior, and capabilities.

**CommonJS** — the Node.js module system (before ESM support):

```js
// Exporting
const PI = 3.14;
function add(a, b) { return a + b; }
module.exports = { PI, add };

// Importing
const { PI, add } = require('./math');
const math = require('./math');
```

**ES Modules** — the standard JavaScript module system:

```js
// Exporting
export const PI = 3.14;
export function add(a, b) { return a + b; }
export default class Calculator { /* ... */ }

// Importing
import { PI, add } from './math.js';
import Calculator from './math.js';
import * as math from './math.js';
```

Key differences:

| Feature | CommonJS | ES Modules |
|---------|----------|-----------|
| Loading | Synchronous, runtime | Asynchronous, parse-time |
| Syntax | `require()` / `module.exports` | `import` / `export` |
| Dynamic imports | Built-in (`require` is dynamic) | `import()` returns a Promise |
| Value binding | Copy of the value | Live bindings (reference) |
| Hoisting | No | Yes (imports are hoisted) |
| Top-level `this` | `module.exports` | `undefined` |
| Tree-shaking | Not possible | Supported by bundlers |
| In browsers | No (needs bundler) | Yes (with `type="module"`) |

**Live bindings** are a key ESM feature: imported variables reflect the current value of the export, not a copy:

```js
// counter.js
export let count = 0;
export function increment() { count++; }

// main.js
import { count, increment } from './counter.js';
console.log(count); // 0
increment();
console.log(count); // 1 — live binding
```

In CommonJS, the value would still be 0 because it was copied at import time.

**Loading**: CommonJS `require()` is synchronous and can be called anywhere (inside `if` blocks, functions). ESM `import` must be at the top level and is resolved before execution.

In Node.js, you can use both by using `.mjs` extension or setting `"type": "module"` in `package.json`. In browsers, only ESM is natively supported via `<script type="module">`.
