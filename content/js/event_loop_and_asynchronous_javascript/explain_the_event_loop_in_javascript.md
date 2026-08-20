The event loop is the mechanism that allows JavaScript to perform non-blocking operations despite being single-threaded. It continuously checks if the call stack is empty and, if so, pulls tasks from the queue to execute.

JavaScript has a few key components: the call stack (where synchronous code executes), the Web APIs (or Node.js APIs) for async operations like `setTimeout`, fetch, and I/O, the microtask queue (for Promises), and the macrotask queue (for callbacks like `setTimeout`, `setInterval`, I/O).

The event loop works in this order:

1. Execute all synchronous code on the call stack.
2. When the stack is empty, check the microtask queue. Execute all microtasks until it is empty.
3. Pick one macrotask from the macrotask queue, execute it, then go back to step 2.
4. If there are rendering steps (in browsers), they happen between macrotasks.

```js
console.log('1');               // synchronous

setTimeout(() => {
  console.log('2');             // macrotask
}, 0);

Promise.resolve().then(() => {
  console.log('3');             // microtask
});

console.log('4');               // synchronous

// Output: 1, 4, 3, 2
```

Synchronous code runs first (`1`, `4`). Then the microtask queue is drained (`3`). Then the macrotask runs (`2`).

The event loop never blocks. When an async operation like `setTimeout` or `fetch` is initiated, it is handed off to the Web API layer. When the operation completes, its callback is placed in the appropriate queue. The event loop picks it up only when the call stack is empty.

In Node.js, the event loop has additional phases (timers, pending callbacks, poll, check, close) and uses `libuv` under the hood. The `process.nextTick` queue is processed between phases, and the microtask queue is drained after each phase.

Understanding the event loop is essential for reasoning about the order of operations in asynchronous code, avoiding race conditions, and writing performant applications.
