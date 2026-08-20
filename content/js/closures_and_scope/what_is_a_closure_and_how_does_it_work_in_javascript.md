A closure is a function that retains access to variables from its outer (enclosing) scope even after the outer function has returned. In JavaScript, every function creates a closure. When a function is defined, it captures a reference to the surrounding lexical environment, and that reference persists as long as the inner function exists.

```js
function outer() {
  let count = 0;
  return function inner() {
    count++;
    return count;
  };
}

const counter = outer();
console.log(counter()); // 1
console.log(counter()); // 2
```

In this example, `inner` closes over the `count` variable. Even though `outer` has finished executing, `count` is not garbage collected because `inner` still holds a reference to it.

Closures work because of JavaScript's lexical scoping rules. When a function is invoked, the engine creates an execution context that includes a reference to the outer lexical environment. The closure is essentially this combination of the function and its environment. Each call to `outer()` creates a new closure with a separate `count` variable.

Closures are used extensively in practical code: callbacks, event handlers, module patterns, partial application, and maintaining state in functional programming. A common gotcha is closures in loops—when using `var`, all iterations share the same variable, so callbacks may see the final value rather than the value at the time the closure was created. Using `let` fixes this because it creates a new binding per iteration.

One important consideration is memory. Since closures retain references to their outer scope, those variables are not garbage collected until the closure itself is dereferenced. This can cause memory leaks if closures unintentionally hold references to large objects.
