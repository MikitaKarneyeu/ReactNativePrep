Debugging JavaScript involves a combination of built-in browser tools, Node.js debugging capabilities, and code-level techniques.

**Browser DevTools (Chrome/Firefox)**:

- **Console**: `console.log()`, `console.table()`, `console.group()`, `console.trace()`, `console.time()`/`console.timeEnd()`.
- **Sources panel**: Set breakpoints, step through code, inspect variables, watch expressions, and use conditional breakpoints (right-click a line number).
- **Call stack**: View the execution path that led to the current point.
- **Scope panel**: Inspect local, closure, and global variables at any breakpoint.
- **Network panel**: Monitor API requests, check headers, responses, and timing.
- **Performance panel**: Profile CPU usage, identify long-running functions, and analyze rendering.
- **Memory panel**: Take heap snapshots, detect memory leaks, and track allocations.

**`debugger` statement**:
```js
function processData(data) {
  debugger; // Execution pauses here when DevTools is open
  return data.map(transform);
}
```

**Node.js debugging**:

- `node --inspect app.js` — enables Chrome DevTools connection.
- `node --inspect-brk app.js` — pauses before executing any code.
- `node --watch app.js` — restarts on file changes.
- VS Code debugger with launch configurations.

**Console techniques**:

```js
// Grouped logging
console.group('User Processing');
console.log('Step 1: Validate');
console.log('Step 2: Transform');
console.groupEnd();

// Conditional logging
console.assert(value > 0, 'Value must be positive');

// Structured data
console.table([{ name: 'Alice', age: 30 }, { name: 'Bob', age: 25 }]);

// Trace call path
function a() { b(); }
function b() { c(); }
function c() { console.trace(); }
```

**Error monitoring in production**:

- Services like Sentry, LogRocket, or Datadog capture unhandled errors with stack traces, user context, and breadcrumbs.
- Source maps allow mapping minified production code back to original source.
- `window.onerror` and `window.addEventListener('unhandledrejection', ...)` capture global errors.

**Linting as debugging prevention**:

- ESLint catches common bugs (unused variables, unreachable code, type mismatches).
- TypeScript catches type errors at compile time.

**Techniques**:

- **Binary search debugging**: Comment out half the code to isolate the bug.
- **Rubber duck debugging**: Explain the code line by line to find logical errors.
- **Minimal reproduction**: Isolate the bug in the smallest possible code snippet.
- **Git bisect**: Find the commit that introduced a bug.
