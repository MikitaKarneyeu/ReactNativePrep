In classical inheritance (Java, C++), classes are blueprints that define behavior, and objects are instances of classes. Inheritance is class-to-class—a subclass extends a superclass, and the relationship is rigid and defined at class definition time.

In prototypal inheritance, objects inherit directly from other objects. There are no classes involved at the language level (ES6 `class` syntax is syntactic sugar over prototypes). Any object can serve as a prototype for another object.

```js
// Prototypal — objects inheriting from objects
const vehicle = {
  start() {
    return 'engine started';
  }
};

const car = Object.create(vehicle);
car.drive = function() {
  return 'driving';
};

const sedan = Object.create(car);
sedan.start(); // 'engine started' — via chain: sedan → car → vehicle
```

Key differences:

**Flexibility**: Prototypal inheritance is more flexible. You can dynamically change an object's prototype at runtime (`Object.setPrototypeOf()`), add or remove properties from prototypes at any time, and compose objects from multiple sources. Classical inheritance requires predefined class hierarchies.

**No class/instance distinction**: In prototypal inheritance, every object is a peer—there is no fundamental difference between a "class" and an "instance." Any object can be cloned or extended.

**Delegation vs. copying**: Prototypal inheritance uses delegation—property lookups walk the chain. Classical inheritance typically copies method definitions into the subclass vtable (though this is an implementation detail).

**Composition over inheritance**: Prototypal patterns naturally favor composition. You can mix behaviors from multiple objects:

```js
const canEat = { eat() {} };
const canWalk = { walk() {} };

const person = Object.assign({}, canEat, canWalk);
```

ES6 `class` syntax makes JavaScript look class-like, but under the hood it is still using prototypes:

```js
class Animal {
  eat() {}
}

class Dog extends Animal {}
```

`Dog.prototype` inherits from `Animal.prototype`—this is prototypal inheritance expressed with class syntax.
