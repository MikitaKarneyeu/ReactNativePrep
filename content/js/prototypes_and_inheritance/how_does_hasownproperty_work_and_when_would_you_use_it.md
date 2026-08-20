`hasOwnProperty(key)` returns `true` if the object has the specified property as its own (direct) property, not inherited from its prototype chain.

```js
function Animal(name) {
  this.name = name;
}

Animal.prototype.eat = function() {
  return 'eating';
};

const dog = new Animal('Rex');

dog.hasOwnProperty('name');      // true — own property set in constructor
dog.hasOwnProperty('eat');       // false — inherited from Animal.prototype
dog.hasOwnProperty('toString');  // false — inherited from Object.prototype
```

Use `hasOwnProperty` when you need to distinguish own properties from inherited ones. This is critical in several scenarios:

**Iterating over object properties**: `for...in` iterates over all enumerable properties, including inherited ones:

```js
const obj = { a: 1, b: 2 };

for (const key in obj) {
  if (obj.hasOwnProperty(key)) {
    console.log(key); // Only 'a' and 'b', not prototype methods
  }
}
```

**Checking property existence safely**: The `in` operator checks the entire chain, which may not be what you want:

```js
'eat' in dog;               // true (inherited)
dog.hasOwnProperty('eat');  // false (not own)
```

**Safe method call**: When using an object as a dictionary, inherited methods like `hasOwnProperty` itself could be shadowed:

```js
const obj = Object.create(null);
obj.key = 'value';
obj.hasOwnProperty('key'); // TypeError — obj has no hasOwnProperty

// Safe approach
Object.prototype.hasOwnProperty.call(obj, 'key'); // true
```

ES2022 introduced `Object.hasOwn()` as a cleaner replacement:

```js
Object.hasOwn(obj, 'key'); // true
```

This is safer (works with `Object.create(null)` objects), shorter, and is the recommended approach in modern code. `hasOwnProperty` does not check the prototype chain—it only checks whether the property is directly on the object itself.
