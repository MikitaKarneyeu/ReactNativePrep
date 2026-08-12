The `this` keyword refers to the object that is executing the current function. Its value is determined by how the function is called (the call site), not where it is defined—except for arrow functions, which use lexical `this`.

There are four rules for determining `this`:

**1. Default binding**: In a standalone function call (not on an object), `this` is the global object (`window` in browsers) in non-strict mode, or `undefined` in strict mode.

```js
function showThis() {
  console.log(this);
}
showThis(); // window (non-strict) or undefined (strict)
```

**2. Implicit binding**: When a function is called as a method on an object, `this` is the object.

```js
const user = {
  name: 'Alice',
  greet() {
    console.log(this.name);
  }
};
user.greet(); // 'Alice' — this = user
```

Beware of detached methods:

```js
const greet = user.greet;
greet(); // undefined — this = global/undefined (default binding)
```

**3. Explicit binding**: `call()`, `apply()`, and `bind()` let you explicitly set `this`.

```js
function greet() {
  console.log(this.name);
}
const user = { name: 'Alice' };
greet.call(user); // 'Alice'
```

**4. `new` binding**: When a function is called with `new`, `this` is the newly created object.

```js
function Person(name) {
  this.name = name;
}
const alice = new Person('Alice'); // this = new object
```

**Priority** (highest to lowest): `new` > explicit binding (`bind`/`call`/`apply`) > implicit binding (method call) > default binding.

**Arrow functions** are an exception—they do not have their own `this`. They inherit `this` from the enclosing lexical scope at the time they are defined:

```js
function Timer() {
  this.seconds = 0;
  setInterval(() => {
    this.seconds++; // `this` is the Timer instance
  }, 1000);
}
```

`bind()` creates a permanently bound function that cannot be overridden by `call`/`apply`, while arrow functions capture `this` from their defining scope.
