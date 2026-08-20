The prototype chain is JavaScript's mechanism for inheritance. Every object has an internal link to another object called its prototype. When a property or method is accessed on an object and it is not found, JavaScript walks up the prototype chain, checking each prototype until the property is found or the chain ends (at `null`).

```js
const animal = {
  eat() {
    console.log('eating');
  }
};

const dog = Object.create(animal);
dog.bark = function() {
  console.log('woof');
};

dog.bark(); // 'woof' — found on dog itself
dog.eat();  // 'eating' — found on animal (dog's prototype)
```

The chain here is: `dog` → `animal` → `Object.prototype` → `null`.

When you create a constructor function or a class, instances share methods through the prototype:

```js
function Person(name) {
  this.name = name;
}

Person.prototype.greet = function() {
  return `Hello, I'm ${this.name}`;
};

const alice = new Person('Alice');
alice.greet(); // "Hello, I'm Alice"
```

`alice` does not have its own `greet` method. It finds `greet` on `Person.prototype` through the chain.

The prototype chain can be inspected with `Object.getPrototypeOf()` (preferred) or the `__proto__` property. `Object.getPrototypeOf(alice) === Person.prototype` is `true`.

Key behaviors: property lookup is dynamic—if you add a method to a prototype after an instance is created, the instance immediately has access to it. Setting a property on an instance creates an own property that shadows the prototype property, it does not modify the prototype. The `in` operator and `for...in` loop check the entire chain, while `hasOwnProperty` checks only the object itself.

The chain terminates at `Object.prototype`, whose prototype is `null`. This is why all objects have access to methods like `toString` and `hasOwnProperty`.
