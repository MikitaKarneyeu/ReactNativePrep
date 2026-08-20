Arrow functions are a concise syntax for writing function expressions, introduced in ES6. They differ from regular functions in several important ways: `this` binding, `arguments` object, `new` keyword, and `prototype` property.

```js
// Arrow function
const add = (a, b) => a + b;

// Equivalent regular function
const add = function(a, b) {
  return a + b;
};
```

**`this` binding** — the most significant difference. Arrow functions do not have their own `this`. They inherit `this` from the enclosing lexical scope.

```js
function Timer() {
  this.seconds = 0;

  setInterval(() => {
    this.seconds++; // `this` refers to Timer instance
  }, 1000);
}

// With a regular function, you would need:
function Timer() {
  this.seconds = 0;
  const self = this;
  setInterval(function() {
    self.seconds++;
  }, 1000);
}
```

**No `arguments` object** — arrow functions do not have their own `arguments`. Use rest parameters instead:

```js
const fn = (...args) => console.log(args);
```

**Cannot be used as constructors** — arrow functions throw a `TypeError` when used with `new`:

```js
const Foo = () => {};
new Foo(); // TypeError: Foo is not a constructor
```

**No `prototype` property** — since they cannot be constructors:

```js
const fn = () => {};
fn.prototype; // undefined
```

**Cannot be generators** — the `yield` keyword cannot be used in arrow functions.

When NOT to use arrow functions:

- Object methods that need `this`:
```js
const obj = {
  name: 'Alice',
  greet: () => `Hi, I'm ${this.name}` // WRONG — `this` is global/undefined
};
```

- Event handlers where `this` should be the element:
```js
button.addEventListener('click', () => {
  console.log(this); // NOT the button
});
```

- Prototype methods:
```js
Person.prototype.greet = () => {
  // `this` is not the Person instance
};
```

Arrow functions are ideal for callbacks, array methods (`map`, `filter`, `reduce`), and any case where you want lexical `this`.
