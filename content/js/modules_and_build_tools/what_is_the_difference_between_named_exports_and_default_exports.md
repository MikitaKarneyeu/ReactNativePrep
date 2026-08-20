Named exports and default exports are the two ways to export values from an ES Module. They differ in syntax, quantity, and import behavior.

**Named exports** — identified by their name:

```js
// Exporting
export const PI = 3.14;
export function add(a, b) { return a + b; }
export class Logger { /* ... */ }

// Or grouped
export { PI, add, Logger };
```

```js
// Importing — names must match (or use alias)
import { PI, add } from './math.js';
import { add as sum } from './math.js';
import * as math from './math.js';
```

**Default export** — one per module, imported with any name:

```js
// Exporting
export default function Calculator() { /* ... */ }
export default class App { /* ... */ }

// Or
const value = 42;
export default value;
```

```js
// Importing — any name works
import Calculator from './math.js';
import MyCalc from './math.js';
```

Key differences:

| Feature | Named exports | Default export |
|---------|--------------|----------------|
| Quantity per module | Unlimited | One (max) |
| Import name | Must match (or alias) | Any name |
| Autocomplete/refactoring | Better | Weaker |
| Re-exporting | Easy | Needs renaming |
| Tree shaking | Works well | Less granular |

**Combining both** in a single module:

```js
export default class Logger {
  log(msg) { console.log(msg); }
}

export const LOG_LEVELS = { INFO: 'info', ERROR: 'error' };
```

```js
import Logger, { LOG_LEVELS } from './logger.js';
```

**Re-exporting considerations**:

```js
// Named — straightforward
export { add, subtract } from './math.js';

// Default — must rename to named
export { default as Calculator } from './math.js';
```

When to use which:
- **Named exports**: When a module provides multiple utilities, constants, or classes. Preferred for better discoverability, refactoring, and tree shaking.
- **Default export**: When a module has a single primary export (a class, a React component, a main function).

A common convention in React is default exports for components and named exports for hooks and utilities.
