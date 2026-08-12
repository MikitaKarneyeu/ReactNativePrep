`var`, `let`, and `const` differ in scope, hoisting behavior, and reassignability.

**`var`** is function-scoped. It is scoped to the nearest function (or global scope if declared outside a function), not to the nearest block. This means a `var` declared inside an `if` or `for` block is accessible outside that block. `var` declarations are hoisted to the top of their function scope and initialized as `undefined`.

```js
function example() {
  if (true) {
    var x = 10;
  }
  console.log(x); // 10 — var is function-scoped, not block-scoped
}
```

**`let`** is block-scoped. It is scoped to the nearest enclosing block (`{}`), including `if` statements, loops, and bare blocks. `let` declarations are hoisted but exist in a temporal dead zone from the start of the block until the declaration is reached, so accessing them before declaration throws a `ReferenceError`.

```js
function example() {
  if (true) {
    let x = 10;
  }
  console.log(x); // ReferenceError: x is not defined
}
```

**`const`** is also block-scoped and has the same temporal dead zone behavior as `let`. The difference is that `const` cannot be reassigned after initialization. However, for objects and arrays, the reference is constant but the contents can still be mutated.

```js
const obj = { a: 1 };
obj.a = 2;      // Allowed — mutating the object
obj = {};       // TypeError: Assignment to constant variable
```

Key practical differences: `var` can be redeclared in the same scope, while `let` and `const` cannot. `var` is hoisted and initialized as `undefined`, while `let` and `const` are hoisted but not initialized (temporal dead zone). Modern best practice is to use `const` by default, `let` when reassignment is needed, and to avoid `var` entirely.
