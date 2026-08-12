The temporal dead zone (TDZ) is the period between the start of a block and the point where a `let` or `const` variable is declared, during which the variable cannot be accessed. Accessing it throws a `ReferenceError`.

```js
{
  // TDZ for `x` starts here
  console.log(x); // ReferenceError
  // TDZ for `x` ends here
  let x = 5;
  console.log(x); // 5
}
```

The TDZ exists because `let` and `const` are hoisted but not initialized. When the JavaScript engine enters a block, it scans for declarations and registers them in the scope, but unlike `var` (which is initialized to `undefined`), `let` and `const` remain in an uninitialized state until the actual declaration statement is executed. The TDZ is the gap between those two moments.

The TDZ applies to `const` as well, and for `const` the variable must also be initialized at declaration:

```js
{
  const x; // SyntaxError: Missing initializer in const declaration
}
```

The TDZ also applies to function parameters with default values. Parameters are evaluated left to right, and a parameter's default can reference a later parameter only after that later parameter has been initialized:

```js
function foo(a = b, b = 2) {}
foo(); // ReferenceError: Cannot access 'b' before initialization
```

The TDZ is a deliberate design choice. It catches bugs caused by using variables before they are logically intended to be available. It also makes `let` and `const` behave more predictably by eliminating the confusing `undefined` value that `var` produces when accessed before its assignment.
