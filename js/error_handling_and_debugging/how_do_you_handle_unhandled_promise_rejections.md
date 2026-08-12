Unhandled promise rejections occur when a Promise is rejected and no `.catch()` handler or rejection callback is attached. Handling them properly is critical for application stability.

**In browsers**, listen for the `unhandledrejection` event on `window`:

```js
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled rejection:', event.reason);
  event.preventDefault(); // Prevents the default console error
});
```

**In Node.js**, listen for the `unhandledRejection` event on `process`:

```js
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Log to monitoring service, optionally exit
  process.exit(1);
});
```

Since Node.js 15, unhandled rejections cause the process to exit with a non-zero code by default.

**Prevention strategies**:

1. **Always add `.catch()` to Promise chains**:
```js
fetch('/api/data')
  .then(res => res.json())
  .then(data => process(data))
  .catch(err => console.error('Error:', err));
```

2. **Use try/catch with async/await**:
```js
async function loadData() {
  try {
    const data = await fetch('/api/data');
    return data.json();
  } catch (err) {
    console.error('Error:', err);
    return null;
  }
}
```

3. **Attach handlers to all Promises in concurrent operations**:
```js
// Don't do this — if fetchA rejects, fetchB is unhandled
const [a, b] = await Promise.all([fetchA(), fetchB()]);

// Do this — handle individually
const results = await Promise.allSettled([fetchA(), fetchB()]);
```

4. **Use global handlers as a safety net** (not as primary error handling):
```js
process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled rejection:', reason);
  metrics.increment('unhandled_rejection');
});
```

5. **Use `void` to explicitly discard a Promise** (when you intentionally do not await):
```js
void fetch('/analytics', { method: 'POST', body: data }).catch(() => {});
```

The key principle: every Promise should have a rejection handler. Global handlers are a last resort, not a substitute for proper error handling at the call site.
