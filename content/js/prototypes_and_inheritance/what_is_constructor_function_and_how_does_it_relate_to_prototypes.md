A constructor function is a regular function that is intended to be called with the `new` keyword to create and initialize objects. By convention, constructor function names start with a capital letter. The constructor sets up instance properties, while its `prototype` property holds shared methods.

```js
function Car(make, model) {
  // Instance properties — unique to each instance
  this.make = make;
  this.model = model;
}

// Shared methods — all instances access the same function
Car.prototype.start = function() {
  return `${this.make} ${this.model} started`;
};

Car.prototype.stop = function() {
  return `${this.make} ${this.model} stopped`;
};

const myCar = new Car('Toyota', 'Camry');
const yourCar = new Car('Honda', 'Civic');

myCar.start();   // "Toyota Camry started"
yourCar.start(); // "Honda Civic started"
```

The relationship between a constructor and its prototype:

- Every function automatically gets a `prototype` property, which is an object with a `constructor` property pointing back to the function.
- `Car.prototype.constructor === Car` is `true`.
- Instances created with `new Car()` have `Object.getPrototypeOf(instance) === Car.prototype`.

```js
function Foo() {}
Foo.prototype;         // { constructor: Foo }
new Foo().__proto__    // Foo.prototype
new Foo().constructor  // Foo
```

ES6 `class` syntax is syntactic sugar over constructor functions:

```js
class Car {
  constructor(make, model) {
    this.make = make;
    this.model = model;
  }
  start() {
    return `${this.make} ${this.model} started`;
  }
}
```

This produces the same prototype structure. `Car` is still a function, `Car.prototype` still holds the methods, and instances still delegate to `Car.prototype`.

The key insight is that the constructor handles per-instance initialization (via `this`), while the prototype holds methods shared across all instances. This is memory-efficient—each instance does not get its own copy of every method.
