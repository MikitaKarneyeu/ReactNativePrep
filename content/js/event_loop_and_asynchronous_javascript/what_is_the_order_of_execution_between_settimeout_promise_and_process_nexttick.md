The order of execution is: synchronous code first, then `process.nextTick` callbacks, then microtasks (Promises), then macrotasks (`setTimeout`).

In Node.js specifically:

1. **Synchronous code** runs immediately on the call stack.
2. **`process.nextTick`** callbacks run after the current operation completes, before the event loop continues to the next phase.
3. **Promise callbacks** (`.then`, `.catch`, `.finally`) run as microtasks, after `process.nextTick`.
4. **`setTimeout`** callbacks run as macrotasks in the timers phase of the next event loop iteration.

```js
setTimeout(() => console.log('setTimeout'), 0);

Promise.resolve().then(() => console.log('promise'));

process.nextTick(() => console.log('nextTick'));

console.log('sync');

// Output: sync, nextTick, promise, setTimeout
```

A more complex example:

```js
setTimeout(() => {
  console.log('setTimeout 1');
  Promise.resolve().then(() => console.log('promise inside setTimeout'));
  process.nextTick(() => console.log('nextTick inside setTimeout'));
}, 0);

setTimeout(() => console.log('setTimeout 2'), 0);

Promise.resolve().then(() => console.log('promise 1'));
Promise.resolve().then(() => console.log('promise 2'));

process.nextTick(() => console.log('nextTick 1'));
process.nextTick(() => console.log('nextTick 2'));

console.log('sync');

// Output:
// sync
// nextTick 1
// nextTick 2
// promise 1
// promise 2
// setTimeout 1
// nextTick inside setTimeout
// promise inside setTimeout
// setTimeout 2
```

`process.nextTick` callbacks are processed between phases of the event loop, not just at the end of a phase. They can cause I/O starvation if overused. The `setImmediate` function runs in the check phase, after I/O callbacks, and is generally safer for deferring work.

In the browser (without `process.nextTick`), only Promise microtasks and setTimeout macrotasks exist, with microtasks always running first.
