There are several patterns for handling errors in async code, depending on whether you use callbacks, Promises, or async/await.

**With async/await and try/catch** (preferred):

```js
async function fetchUser(id) {
  try {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw error; // rethrow if caller should handle it
  }
}
```

**Concurrent async errors with Promise.all**:

```js
async function fetchAll() {
  try {
    const [users, posts] = await Promise.all([
      fetch('/api/users').then(r => r.json()),
      fetch('/api/posts').then(r => r.json())
    ]);
    return { users, posts };
  } catch (error) {
    // Catches the first rejection
    console.error('One of the requests failed:', error);
  }
}
```

**Promise chain error handling**:

```js
fetch('/api/users')
  .then(response => {
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  })
  .then(data => process(data))
  .catch(error => {
    console.error('Error:', error);
  })
  .finally(() => {
    hideSpinner();
  });
```

**Handling multiple independent errors**:

```js
// Promise.allSettled — handles all results regardless of success/failure
const results = await Promise.allSettled([
  fetch('/api/a'),
  fetch('/api/b'),
  fetch('/api/c')
]);

results.forEach((result, i) => {
  if (result.status === 'rejected') {
    console.error(`Request ${i} failed:`, result.reason);
  }
});
```

**Top-level async errors** (Node.js scripts):

```js
// Using async IIFE
(async () => {
  try {
    await main();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();

// Or with top-level await (ES modules)
try {
  await main();
} catch (err) {
  console.error(err);
}
```

Common pitfalls:
- Forgetting that `await` in a `for` loop catches errors per iteration, but `Promise.all` fails fast.
- Not handling errors from `fetch` when the response is a non-2xx status (fetch only rejects on network errors).
- Swallowing errors in catch blocks without logging or rethrowing.
