When you declare a loop variable with `var`, it is function-scoped (or globally scoped), meaning a single binding is shared across all iterations. When you declare it with `let`, it is block-scoped, meaning a new binding is created for each iteration.

```js
// var — single shared variable
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// Output: 3, 3, 3
```

All three callbacks close over the same `i`. By the time the callbacks execute, the loop has finished and `i` is 3.

```js
// let — new binding per iteration
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// Output: 0, 1, 2
```

With `let`, the JavaScript engine creates a new `i` for each iteration. Each callback closes over a different `i`, capturing the value at that iteration. Under the hood, the engine essentially does this:

```js
{
  let i = 0;
  setTimeout(() => console.log(i), 100);
}
{
  let i = 1;
  setTimeout(() => console.log(i), 100);
}
{
  let i = 2;
  setTimeout(() => console.log(i), 100);
}
```

This behavior applies to `for`, `for...in`, and `for...of` loops. The `let` variable is re-bound at the start of each iteration, and its value is initialized from the previous iteration's value.

The classic workaround before `let` existed was an IIFE to capture the current value:

```js
for (var i = 0; i < 3; i++) {
  (function(j) {
    setTimeout(() => console.log(j), 100);
  })(i);
}
```

This is no longer necessary with `let`, which is one of the primary reasons `let` is preferred over `var` in modern JavaScript.
