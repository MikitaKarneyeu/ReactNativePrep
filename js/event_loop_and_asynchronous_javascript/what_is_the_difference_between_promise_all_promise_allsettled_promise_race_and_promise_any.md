These four Promise combinators differ in how they handle resolution and rejection.

**`Promise.all(iterable)`** — Resolves when all promises resolve. Rejects immediately if any promise rejects (fail-fast). The resolved value is an array of all results in order.

```js
const results = await Promise.all([
  fetch('/api/users'),
  fetch('/api/posts'),
  fetch('/api/comments')
]);
// results is [usersResponse, postsResponse, commentsResponse]
```

**`Promise.allSettled(iterable)`** — Resolves when all promises have settled (either resolved or rejected). Never rejects. The result is an array of objects with `status` ("fulfilled" or "rejected") and either `value` or `reason`.

```js
const results = await Promise.allSettled([
  Promise.resolve('ok'),
  Promise.reject('fail'),
  Promise.resolve('also ok')
]);
// [
//   { status: 'fulfilled', value: 'ok' },
//   { status: 'rejected', reason: 'fail' },
//   { status: 'fulfilled', value: 'also ok' }
// ]
```

**`Promise.race(iterable)`** — Resolves or rejects as soon as the first promise settles (whichever comes first). Useful for implementing timeouts:

```js
const result = await Promise.race([
  fetch('/api/data'),
  new Promise((_, reject) => setTimeout(() => reject('timeout'), 5000))
]);
```

**`Promise.any(iterable)`** — Resolves as soon as the first promise resolves. Rejects only if all promises reject (with an `AggregateError`). This is the success-first counterpart to `race`:

```js
try {
  const result = await Promise.any([
    fetch('https://mirror1.example.com/api'),
    fetch('https://mirror2.example.com/api'),
    fetch('https://mirror3.example.com/api')
  ]);
} catch (aggregateError) {
  console.log(aggregateError.errors); // all rejection reasons
}
```

Summary: `all` fails fast, `allSettled` waits for everything, `race` takes the first to settle, `any` takes the first to succeed.
