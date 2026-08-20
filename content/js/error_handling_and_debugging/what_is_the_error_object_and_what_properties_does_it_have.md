The `Error` object is the base class for all errors in JavaScript. It captures information about what went wrong and where, making debugging possible.

**Constructor**: `new Error(message)` or `new Error(message, options)`.

```js
const err = new Error('Something failed');
```

**Standard properties**:

- **`message`** (string): A human-readable description of the error.
```js
const err = new Error('File not found');
err.message; // 'File not found'
```

- **`name`** (string): The error type. Default is `'Error'`, but subclasses override it.
```js
err.name; // 'Error'
new TypeError('bad type').name; // 'TypeError'
```

- **`stack`** (string, non-standard but widely supported): A stack trace showing where the error was created and the call chain.
```js
const err = new Error('fail');
console.log(err.stack);
// Error: fail
//     at Object.<anonymous> (/app/index.js:1:15)
//     at Module._compile (node:internal/modules/cjs:1120:14)
//     ...
```

**ES2022 `cause` property**: Allows chaining errors to preserve the original cause:

```js
try {
  parseJSON(input);
} catch (originalError) {
  throw new Error('Failed to process data', { cause: originalError });
}

// Later:
catch (err) {
  console.log(err.message);       // 'Failed to process data'
  console.log(err.cause.message);  // Original error message
}
```

**Built-in Error subclasses**:

| Type | When used |
|------|-----------|
| `Error` | General errors |
| `TypeError` | Wrong type (e.g., calling non-function) |
| `ReferenceError` | Accessing undefined variable |
| `SyntaxError` | Invalid syntax (e.g., `JSON.parse`) |
| `RangeError` | Value out of range (e.g., invalid array length) |
| `URIError` | Invalid URI (e.g., `decodeURI`) |
| `AggregateError` | Multiple errors (from `Promise.any`) |

```js
throw new TypeError('Expected a string');
throw new RangeError('Index out of bounds');
throw new AggregateError([err1, err2], 'Multiple errors occurred');
```

The `Error` object also has static methods:

- `Error.captureStackTrace(targetObj, constructorOpt)` — V8-specific, captures stack trace on a custom object.
- `Error.stackTraceLimit` — Controls the number of stack frames captured (V8).

Always throw Error instances (or subclasses), never raw strings or objects, to get proper stack traces and enable structured error handling.
