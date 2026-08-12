Microtasks and macrotasks are two types of asynchronous tasks in JavaScript that are processed at different points in the event loop.

**Macrotasks** (also called tasks) include `setTimeout`, `setInterval`, `setImmediate` (Node.js), I/O operations, and UI rendering. Each event loop iteration processes one macrotask at a time.

**Microtasks** include `Promise.then/catch/finally`, `queueMicrotask`, `MutationObserver`, and `process.nextTick` (Node.js). After each macrotask completes and before the next macrotask begins, the event loop drains the entire microtask queue.

```js
console.log('start');

setTimeout(() => console.log('macrotask'), 0);

Promise.resolve().then(() => console.log('microtask 1'))
  .then(() => console.log('microtask 2'));

console.log('end');

// Output: start, end, microtask 1, microtask 2, macrotask
```

Key differences:

1. **Priority**: Microtasks have higher priority. They are processed before the next macrotask and before rendering.
2. **Draining**: The entire microtask queue is drained before moving to the next macrotask. If microtasks add more microtasks, those are processed too (which can starve macrotasks and rendering).
3. **Rendering**: In browsers, rendering may happen between macrotasks but not between microtasks.

```js
// Microtask starvation example
Promise.resolve().then(function loop() {
  Promise.resolve().then(loop);
});

setTimeout(() => console.log('macrotask'), 0);
// The macrotask never runs because microtasks keep being added
```

In Node.js, `process.nextTick` callbacks are processed even before other microtasks, making them the highest priority async callbacks.

Understanding the distinction is critical for predicting execution order in complex async code and avoiding starvation scenarios where high-priority microtasks prevent other work from executing.
