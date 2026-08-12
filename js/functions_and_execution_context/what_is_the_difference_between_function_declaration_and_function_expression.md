Function declarations and function expressions are two ways to define functions in JavaScript. They differ in syntax, hoisting behavior, and when they can be used.

**Function declaration**:

```js
function greet(name) {
  return `Hello, ${name}!`;
}
```

- Hoisted entirely (both the name and the body) to the top of its scope. Can be called before the line where it is defined.
- Must have a name (anonymous function declarations are not allowed).
- Creates a variable in the enclosing scope with the function's name.

```js
greet('Alice'); // Works — function is hoisted

function greet(name) {
  return `Hello, ${name}!`;
}
```

**Function expression**:

```js
const greet = function(name) {
  return `Hello, ${name}!`;
};

// Named function expression
const greet = function greetFn(name) {
  return `Hello, ${name}!`;
};
```

- Only the variable declaration is hoisted (as `undefined` with `var`, or in TDZ with `let`/`const`). The function itself is not hoisted.
- Can be anonymous or named. The name of a named function expression is only accessible inside the function itself (useful for recursion without relying on the outer variable).
- Cannot be called before the line where it is assigned.

```js
greet('Alice'); // TypeError (if var) or ReferenceError (if let/const)

const greet = function(name) {
  return `Hello, ${name}!`;
};
```

**Arrow function expressions** follow the same hoisting rules as regular function expressions since they are always assigned to a variable:

```js
const greet = (name) => `Hello, ${name}!`;
```

Other differences:
- Function declarations are statements; function expressions are expressions (can be used inline, passed as arguments, or returned from functions).
- In strict mode inside blocks (`if`, `for`), function declarations are block-scoped. In non-strict mode, behavior varies across engines.
- Named function expressions provide a readable stack trace for debugging.

Modern best practice: use `const` with function expressions (or arrow functions) to prevent accidental reassignment and to make hoisting behavior explicit.
