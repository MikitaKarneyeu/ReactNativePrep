ES Modules use `import` and `export` statements to share code between files. There are several forms of each.

**Exporting**:

Named exports — export individual values by name:
```js
// utils.js
export const PI = 3.14;
export function add(a, b) { return a + b; }
export class Logger { /* ... */ }
```

Or group exports at the bottom:
```js
const PI = 3.14;
function add(a, b) { return a + b; }
export { PI, add };
```

Rename on export:
```js
export { add as sum };
```

Default export — one per module:
```js
export default function Calculator() { /* ... */ }
// or
export default class App { /* ... */ }
// or
export default 42;
```

**Importing**:

Named imports:
```js
import { PI, add } from './utils.js';
```

Rename on import:
```js
import { add as sum } from './utils.js';
```

Default import:
```js
import Calculator from './utils.js';
```

Combine default and named:
```js
import Calculator, { PI, add } from './utils.js';
```

Import all as namespace:
```js
import * as utils from './utils.js';
utils.PI; // 3.14
utils.add(1, 2);
```

Side-effect-only import (no exports needed):
```js
import './polyfills.js';
```

Dynamic import (returns a Promise):
```js
const module = await import('./utils.js');
module.add(1, 2);
```

Re-exporting:
```js
// Re-export named
export { PI, add } from './utils.js';

// Re-export all
export * from './utils.js';

// Re-export and rename
export { add as sum } from './utils.js';

// Re-export default as named
export { default as Calculator } from './utils.js';
```

File extensions are required in browser ESM and recommended in Node.js ESM. Imports are hoisted and resolved before code execution, so `import` statements cannot be inside `if` blocks or functions (use dynamic `import()` for that).
