When a Promise is rejected and no `.catch()` handler or second argument to `.then()` is attached, it becomes an unhandled rejection. The behavior depends on the environment.

In Node.js, an `unhandledRejection` event is emitted on `process`. If no listener is attached, the process terminates with a non-zero exit code (since Node.js 15). Before Node.js 15, it was just a warning.

```js
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
});
```

In browsers, an `unhandledrejection` event is fired on `window`. You can listen for it:

```js
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled rejection:', event.reason);
  event.preventDefault(); // Prevents the default console error
});
```

```js
// These all result in unhandled rejections:
Promise.reject(new Error('fail'));

fetch('/nonexistent').then(res => res.json()); // fetch rejects on network error

async function broken() {
  throw new Error('oops');
}
broken(); // returned promise is rejected but not awaited/handled
```

The modern best practice is to always handle rejections:

```js
// Option 1: .catch()
fetch('/api/data')
  .then(res => res.json())
  .catch(err => console.error(err));

// Option 2: try/catch with async/await
async function getData() {
  try {
    const res = await fetch('/api/data');
    return await res.json();
  } catch (err) {
    console.error(err);
  }
}

// Option 3: .catch on the promise itself
const data = await fetch('/api/data').catch(err => {
  console.error(err);
  return null;
});
```

Unhandled rejections are a serious concern in production code. They can silently fail, cause memory leaks from retained references, or crash Node.js processes. Always ensure every Promise chain has a rejection handler.
