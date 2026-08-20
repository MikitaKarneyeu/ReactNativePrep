Memoization is an optimization technique that caches the results of expensive function calls and returns the cached result when the same inputs occur again. It trades memory for speed by avoiding redundant computation.

```js
function memoize(fn) {
  const cache = new Map();
  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

const expensiveAdd = memoize((a, b) => {
  console.log('computing...');
  return a + b;
});

expensiveAdd(1, 2); // 'computing...', 3
expensiveAdd(1, 2); // 3 (cached, no 'computing...')
```

A classic use case is the Fibonacci sequence:

```js
// Without memoization — O(2^n)
function fib(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
}

// With memoization — O(n)
const fib = memoize((n) => {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
});

fib(50); // 12586269025 — instant
```

For functions with object arguments, use a `WeakMap` keyed by the object itself instead of `JSON.stringify`:

```js
function memoizeObj(fn) {
  const cache = new WeakMap();
  return function(obj) {
    if (cache.has(obj)) return cache.get(obj);
    const result = fn.call(this, obj);
    cache.set(obj, result);
    return result;
  };
}
```

Considerations and limitations:

- **Cache invalidation**: Stale data is the hardest problem. You need a strategy to clear or expire cached values.
- **Memory**: Unbounded caches can grow indefinitely. Consider LRU caches with size limits.
- **Pure functions only**: Memoization only makes sense for pure functions (same inputs always produce the same output). Side effects will not be re-executed on cache hits.
- **Cache key**: Using `JSON.stringify` for arguments is simple but has limitations (functions, `undefined` values, key ordering).

Many libraries like Lodash provide `_.memoize` with configurable resolvers. In React, `useMemo` and `React.memo` serve similar purposes for rendering optimization.
