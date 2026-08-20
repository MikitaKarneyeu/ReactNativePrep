You can `throw` any value—primitives, objects, strings, or Error instances. However, `throw new Error('message')` is strongly preferred over `throw 'message'` because Error objects provide stack traces and structured error information.

```js
// Throwing a string (discouraged)
throw 'Something went wrong';

// Throwing an Error object (recommended)
throw new Error('Something went wrong');
```

The `Error` object provides:

1. **Stack trace**: Captures the call stack at the point of creation, making debugging significantly easier.
2. **`message` property**: The error description.
3. **`name` property**: The error type (e.g., `'Error'`, `'TypeError'`).
4. **Prototype chain**: Allows `instanceof` checks for specific error handling.

```js
try {
  throw new Error('fail');
} catch (err) {
  console.log(err.message);    // 'fail'
  console.log(err.name);       // 'Error'
  console.log(err.stack);      // 'Error: fail\n    at ...'
  console.log(err instanceof Error); // true
}
```

When you throw a string, you lose all of this:

```js
try {
  throw 'fail';
} catch (err) {
  console.log(typeof err);     // 'string'
  console.log(err.stack);      // undefined
  // No way to get the call stack
}
```

Other built-in error types:

```js
throw new TypeError('Expected a string');
throw new RangeError('Value out of range');
throw new SyntaxError('Invalid syntax');
throw new ReferenceError('Variable not defined');
```

Custom error classes extend `Error`:

```js
class ValidationError extends Error {
  constructor(field, message) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}

throw new ValidationError('email', 'Invalid email format');
```

Always throw `Error` instances (or subclasses). Never throw strings, numbers, or plain objects—it makes debugging much harder and breaks tooling that expects standard Error objects.
