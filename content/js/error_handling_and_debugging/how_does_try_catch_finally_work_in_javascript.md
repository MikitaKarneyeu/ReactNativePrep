`try...catch...finally` is JavaScript's mechanism for handling runtime errors gracefully. Code that might throw is placed in `try`, errors are caught and handled in `catch`, and cleanup code runs in `finally` regardless of the outcome.

```js
try {
  const data = JSON.parse(input);
  console.log(data.name);
} catch (error) {
  console.error('Parse failed:', error.message);
} finally {
  console.log('This always runs');
}
```

**`try` block**: Required. Contains the code to monitor for errors. If an error occurs, execution jumps to `catch`.

**`catch` block**: Optional (at least one of `catch` or `finally` is required). Receives the error object. In ES2019+, you can omit the binding:

```js
try {
  riskyOperation();
} catch {
  console.error('Something failed');
}
```

**`finally` block**: Optional. Always executes after `try` (and `catch` if present), whether or not an error occurred. Even if `try` or `catch` contains a `return`, `finally` still runs:

```js
function test() {
  try {
    return 'try';
  } finally {
    console.log('finally runs');
  }
}
test(); // logs 'finally', returns 'try'
```

`finally` runs even when `catch` rethrows:

```js
function process() {
  try {
    riskyOperation();
  } catch (err) {
    throw err; // rethrow
  } finally {
    cleanup(); // still runs
  }
}
```

`try...catch` only catches synchronous errors. For async errors in callbacks, you need other patterns:

```js
// Promises
fetch('/api').catch(err => { /* ... */ });

// async/await
async function getData() {
  try {
    const res = await fetch('/api');
  } catch (err) {
    // catches both fetch errors and await errors
  }
}
```

`try...catch` has a performance cost when errors are thrown (not when used normally). Avoid using it as flow control—use it for genuinely exceptional conditions.
