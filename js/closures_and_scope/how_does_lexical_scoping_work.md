Lexical scoping (also called static scoping) means that the scope of a variable is determined by its position in the source code at the time the code is written, not by the call stack at runtime. When a function is defined, it captures the scope chain that exists at that point in the code.

```js
const global = 'global';

function outer() {
  const outerVar = 'outer';

  function inner() {
    const innerVar = 'inner';
    console.log(global);   // accessible
    console.log(outerVar); // accessible
    console.log(innerVar); // accessible
  }

  inner();
}
```

When `inner` tries to resolve a variable, it first checks its own scope. If not found, it walks up the scope chain to `outer`'s scope, then to the global scope. This chain is determined lexically—by where `inner` is defined in the code, not where it is called from.

```js
function createGreeter(greeting) {
  return function(name) {
    console.log(`${greeting}, ${name}!`);
  };
}

const hello = createGreeter('Hello');
const hi = createGreeter('Hi');

hello('Alice'); // "Hello, Alice!"
hi('Bob');      // "Hi, Bob!"
```

Each call to `createGreeter` creates a new closure with its own `greeting`. The returned function remembers the `greeting` from the scope where it was defined.

Lexical scoping contrasts with dynamic scoping, where scope is determined by the call stack. JavaScript uses lexical scoping exclusively (except for `this`, which behaves dynamically). This makes code more predictable because you can determine variable resolution by reading the code, without needing to know the runtime call order.

Variables declared with `var`, `let`, and `const` all follow lexical scoping rules, though they differ in their block-level scope boundaries. The lexical scope is established when the function is parsed, which is why closures work—they carry a reference to their defining environment.
