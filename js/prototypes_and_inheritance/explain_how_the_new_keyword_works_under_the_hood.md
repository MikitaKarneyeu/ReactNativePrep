When you call a function with `new`, JavaScript performs four steps:

1. **Creates a new empty object**: `const obj = {}`
2. **Sets the prototype**: Links the new object's `__proto__` to the constructor's `prototype` property — `Object.setPrototypeOf(obj, Constructor.prototype)`
3. **Executes the constructor**: Calls the function with `this` bound to the new object — `const result = Constructor.call(obj, ...args)`
4. **Returns the result**: If the constructor returns a non-null object, that object is used. Otherwise, the newly created object is returned.

```js
function Person(name, age) {
  this.name = name;
  this.age = age;
}

Person.prototype.greet = function() {
  return `Hi, I'm ${this.name}`;
};

const alice = new Person('Alice', 30);
// Equivalent to:
// 1. const obj = {}
// 2. Object.setPrototypeOf(obj, Person.prototype)
// 3. Person.call(obj, 'Alice', 30) — this.name = name; this.age = age;
// 4. return obj (since Person returns undefined)
```

The return value behavior is important:

```js
function Weird() {
  this.a = 1;
  return { b: 2 }; // returns an object, so `new Weird()` gives { b: 2 }
}

function NotWeird() {
  this.a = 1;
  return 2; // primitives are ignored, returns { a: 1 }
}
```

You can simulate `new` with a function:

```js
function myNew(Constructor, ...args) {
  const obj = Object.create(Constructor.prototype);
  const result = Constructor.apply(obj, args);
  return result instanceof Object ? result : obj;
}
```

This reveals the core of `new`: it is just object creation + prototype linking + constructor invocation + return value handling. This is why understanding prototypes is essential even when using ES6 `class` syntax.
