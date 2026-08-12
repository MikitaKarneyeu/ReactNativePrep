**Symbol** is a primitive type that creates unique, immutable identifiers. Each Symbol is guaranteed to be unique, even with the same description.

```js
const s1 = Symbol('id');
const s2 = Symbol('id');
s1 === s2; // false — always unique
```

Symbols are primarily used as non-colliding property keys. Since they are unique, they prevent name clashes when adding properties to objects you do not own:

```js
const id = Symbol('id');
const user = {
  name: 'Alice',
  [id]: 123
};

console.log(user[id]); // 123
```

Well-known Symbols like `Symbol.iterator`, `Symbol.toPrimitive`, and `Symbol.toStringTag` allow customizing object behavior:

```js
const collection = {
  items: [1, 2, 3],
  [Symbol.iterator]() {
    let index = 0;
    return {
      next: () => ({
        value: this.items[index],
        done: index++ >= this.items.length
      })
    };
  }
};
```

**WeakMap** is a collection of key-value pairs where keys must be objects and are held weakly. This means if there are no other references to a key object, it can be garbage collected, and its entry in the WeakMap is automatically removed.

```js
const metadata = new WeakMap();

function processObj(obj) {
  metadata.set(obj, { processed: true, timestamp: Date.now() });
}

let obj = { data: 'test' };
processObj(obj);
metadata.get(obj); // { processed: true, timestamp: ... }

obj = null; // Entry is garbage collected automatically
```

WeakMap is used for:

- **Private data**: Storing per-instance private data without modifying the object:
```js
const privates = new WeakMap();
class Person {
  constructor(name) {
    privates.set(this, { name });
  }
  getName() {
    return privates.get(this).name;
  }
}
```

- **Caching/memoization**: Attaching computed results to objects without preventing garbage collection.
- **DOM element metadata**: Storing metadata on DOM elements without memory leaks when elements are removed.

WeakMap is not iterable and does not have `size`, `keys()`, `values()`, or `entries()` methods—this is by design since entries can disappear at any time.
