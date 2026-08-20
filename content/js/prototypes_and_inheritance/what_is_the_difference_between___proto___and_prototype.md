`__proto__` and `prototype` are related but distinct concepts.

**`__proto__`** is an accessor property on every object that points to that object's prototype (the object it inherits from). It is the actual link in the prototype chain. Modern code should use `Object.getPrototypeOf()` and `Object.setPrototypeOf()` instead.

```js
const obj = {};
Object.getPrototypeOf(obj) === Object.prototype; // true
obj.__proto__ === Object.prototype;               // true (legacy)
```

**`prototype`** is a property that exists only on functions (and is used when the function is invoked with `new`). It is the object that will become the `__proto__` of instances created by that function.

```js
function Dog(name) {
  this.name = name;
}

Dog.prototype.bark = function() {
  return 'woof';
};

const rex = new Dog('Rex');
rex.__proto__ === Dog.prototype; // true
```

Key differences:

- `prototype` exists on functions; `__proto__` exists on all objects.
- `prototype` is the template for new instances; `__proto__` is the link an instance uses to look up inherited properties.
- When you do `new Foo()`, the engine sets the new object's `__proto__` to `Foo.prototype`.

Arrow functions do not have a `prototype` property since they cannot be used as constructors:

```js
const fn = () => {};
fn.prototype; // undefined
```

The `__proto__` property is deprecated in favor of `Object.getPrototypeOf()` and `Object.setPrototypeOf()`. Using `__proto__` in production code is discouraged because it is a performance deopt in some engines and is not available on objects created with `Object.create(null)`.

In summary: `prototype` is the blueprint that a constructor function defines for its instances. `__proto__` is the runtime link that each object has to its prototype in the chain.
