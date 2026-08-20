An IIFE (Immediately Invoked Function Expression) is a function that is defined and executed immediately. It is wrapped in parentheses to be treated as an expression, then invoked with another set of parentheses.

```js
(function() {
  const secret = 'hidden';
  console.log(secret);
})();

// console.log(secret); // ReferenceError — not accessible outside
```

Variations:

```js
// Arrow function IIFE
(() => {
  console.log('arrow IIFE');
})();

// Async IIFE
(async () => {
  const data = await fetch('/api/data');
  console.log(data);
})();

// With parameters
(function(name) {
  console.log(`Hello, ${name}`);
})('Alice');

// IIFE that returns a value
const result = (function() {
  return 42;
})();
```

Common use cases:

**1. Avoiding global scope pollution**: Encapsulate variables so they do not conflict with other code.

```js
(function() {
  const config = { apiUrl: 'https://api.example.com' };
  // config is private to this scope
})();
```

**2. Module pattern**: Create private state with a public API (before ES6 modules).

```js
const Counter = (function() {
  let count = 0;
  return {
    increment() { return ++count; },
    decrement() { return --count; },
    getCount() { return count; }
  };
})();
```

**3. Initialization code**: Run setup logic without leaving artifacts in scope.

```js
(function() {
  document.addEventListener('DOMContentLoaded', () => {
    // Initialize app
  });
})();
```

**4. Async context** (top-level await not available):

```js
(async function() {
  const response = await fetch('/api/config');
  const config = await response.json();
  initApp(config);
})();
```

**5. Capturing loop variable values** (pre-ES6):

```js
for (var i = 0; i < 3; i++) {
  (function(j) {
    setTimeout(() => console.log(j), 100);
  })(i);
}
```

IIFEs are less commonly needed today due to ES6 modules (which have their own scope), `let`/`const` (which are block-scoped), and async/await. However, they remain useful for initialization scripts, non-module environments, and when you need a self-contained scope.
