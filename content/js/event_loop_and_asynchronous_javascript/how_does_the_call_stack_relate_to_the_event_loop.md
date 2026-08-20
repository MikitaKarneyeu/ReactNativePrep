The call stack is the core data structure the event loop interacts with. The event loop's primary job is to monitor the call stack and feed it new work when it becomes empty.

The call stack is a LIFO (last-in, first-out) structure that tracks function execution. When a function is called, a new frame is pushed onto the stack. When it returns, the frame is popped off. JavaScript is single-threaded, so only one function can execute at a time.

```js
function a() {
  b();
}

function b() {
  c();
}

function c() {
  console.log('done');
}

a();
// Stack: a → b → c → console.log → (empty)
```

The event loop continuously checks: "Is the call stack empty?" If yes, it picks the next task from the queues and pushes it onto the stack.

```js
console.log('A');

setTimeout(() => {
  console.log('B');
}, 0);

console.log('C');

// Stack execution:
// 1. Push console.log('A') → pop → output 'A'
// 2. Push setTimeout(...) → registers callback → pop
// 3. Push console.log('C') → pop → output 'C'
// 4. Stack empty → event loop picks macrotask
// 5. Push console.log('B') → pop → output 'B'
```

The call stack being blocked prevents the event loop from processing other tasks:

```js
// This blocks the event loop for ~5 seconds
const end = Date.now() + 5000;
while (Date.now() < end) {}

setTimeout(() => console.log('delayed'), 0);
// 'delayed' won't print until the while loop finishes
```

This is why long-running synchronous computations, infinite loops, or heavy DOM manipulation can freeze the UI. The event loop cannot process user input, timer callbacks, or rendering until the stack empties.

In Node.js, the call stack operates the same way but is managed by the V8 engine, while the event loop is provided by libuv with additional phases for I/O, timers, and system callbacks.
