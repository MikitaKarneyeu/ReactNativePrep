`async` and `await` are syntactic sugar over Promises and generators. They make asynchronous code look and behave like synchronous code while still being non-blocking.

An `async` function always returns a Promise. If the function returns a value, it is wrapped in `Promise.resolve()`. If it throws, it returns `Promise.reject()`.

```js
async function getData() {
  return 'hello'; // equivalent to return Promise.resolve('hello')
}
```

`await` pauses execution of the async function until the awaited Promise settles. Under the hood, the JavaScript engine uses a generator-like mechanism: the function's execution context is suspended and resumed when the Promise resolves.

```js
async function fetchUser(id) {
  const response = await fetch(`/api/users/${id}`);  // pauses here
  const user = await response.json();                  // pauses here
  return user;
}
```

The engine essentially transforms this into a state machine:

```js
function fetchUser(id) {
  return new Promise((resolve, reject) => {
    fetch(`/api/users/${id}`)
      .then(response => response.json())
      .then(user => resolve(user))
      .catch(err => reject(err));
  });
}
```

Each `await` creates a new microtask. When a Promise resolves, the continuation of the async function is scheduled as a microtask. This means code after an `await` does not block the main thread.

Error handling uses standard `try/catch`:

```js
async function getData() {
  try {
    const res = await fetch('/api/data');
    return await res.json();
  } catch (err) {
    console.error('Fetch failed:', err);
    throw err;
  }
}
```

A common gotcha is that `await` inside a loop runs sequentially. For parallel execution, use `Promise.all`:

```js
// Sequential — slow
for (const url of urls) {
  await fetch(url);
}

// Parallel — fast
await Promise.all(urls.map(url => fetch(url)));
```

`async/await` does not change the non-blocking nature of JavaScript. It is purely syntactic sugar that makes async code easier to read and reason about.
