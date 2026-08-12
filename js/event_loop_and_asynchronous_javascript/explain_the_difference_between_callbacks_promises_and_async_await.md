Callbacks, Promises, and async/await are three approaches to handling asynchronous operations in JavaScript, each building on the previous one.

**Callbacks** are functions passed as arguments to other functions, called when an async operation completes. They are the oldest pattern and can lead to "callback hell" (deeply nested, hard-to-read code).

```js
fs.readFile('file.txt', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  fs.writeFile('output.txt', data, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('done');
  });
});
```

**Promises** represent the eventual completion or failure of an async operation. They are chainable and solve the nesting problem of callbacks.

```js
readFile('file.txt')
  .then(data => writeFile('output.txt', data))
  .then(() => console.log('done'))
  .catch(err => console.error(err));
```

Promises provide: single error handling point with `.catch()`, composability with `Promise.all`/`race`/`allSettled`, and guaranteed async execution (callbacks are always async with Promises).

**Async/await** is syntactic sugar over Promises that makes async code read like synchronous code.

```js
async function processFiles() {
  try {
    const data = await readFile('file.txt');
    await writeFile('output.txt', data);
    console.log('done');
  } catch (err) {
    console.error(err);
  }
}
```

Key differences:

- **Error handling**: Callbacks use the error-first convention (`err, result`). Promises use `.catch()`. Async/await uses `try/catch`.
- **Readability**: Callbacks are linear but nest deeply. Promises flatten the chain. Async/await looks synchronous.
- **Composition**: Promises offer `all`, `race`, `allSettled`, `any`. Callbacks require manual coordination.
- **Debugging**: Async/await provides better stack traces and is easier to step through in debuggers.

Callbacks are still used for event listeners and Node.js EventEmitter patterns. Promises are the foundation. Async/await is the preferred syntax for sequential async logic in modern code.
