`Object.create(proto, propertiesObject)` creates a new object with its `__proto__` set to the provided `proto` argument. It is the most direct way to set up prototypal inheritance in JavaScript.

```js
const animal = {
  eat() {
    return 'eating';
  }
};

const dog = Object.create(animal);
dog.bark = function() {
  return 'woof';
};

dog.eat();  // 'eating' — inherited from animal
dog.bark(); // 'woof' — own property
Object.getPrototypeOf(dog) === animal; // true
```

The optional second argument is an object of property descriptors, allowing you to define own properties with full control over enumerability, writability, and configurability:

```js
const person = Object.create(animal, {
  name: {
    value: 'Alice',
    writable: true,
    enumerable: true,
    configurable: true
  },
  greet: {
    value: function() {
      return `Hi, I'm ${this.name}`;
    }
  }
});
```

A key use of `Object.create(null)` is creating a truly empty object with no prototype:

```js
const dict = Object.create(null);
dict.toString; // undefined (no inherited methods)
```

This is useful for creating dictionary/map objects that will not collide with inherited properties like `toString`, `hasOwnProperty`, or `constructor`. It avoids the need to use `hasOwnProperty` checks.

Under the hood, `Object.create(proto)` is roughly equivalent to:

```js
function create(proto) {
  function F() {}
  F.prototype = proto;
  return new F();
}
```

`Object.create` is preferred over manually setting `__proto__` because it is explicit, works with `null`, and does not trigger prototype setter deopts in JavaScript engines. It is the standard way to establish a prototype link without using a constructor function.
