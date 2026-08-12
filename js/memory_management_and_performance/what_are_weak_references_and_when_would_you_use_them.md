Weak references are references to objects that do not prevent the garbage collector from reclaiming those objects. In JavaScript, `WeakRef` and `WeakMap`/`WeakSet` provide weak reference semantics.

**`WeakRef`** (ES2021): A weak reference to an object. You can check if the object is still alive by calling `.deref()`, which returns the object or `undefined` if it has been garbage collected.

```js
let obj = { data: 'large payload' };
const weakRef = new WeakRef(obj);

console.log(weakRef.deref()); // { data: 'large payload' }

obj = null; // Remove strong reference
// At some point, GC may collect the object
console.log(weakRef.deref()); // undefined (after GC)
```

**`FinalizationRegistry`** (ES2021): Registers a callback to run when an object is garbage collected.

```js
const registry = new FinalizationRegistry((heldValue) => {
  console.log(`Object with key "${heldValue}" was garbage collected`);
});

let obj = { data: 'test' };
registry.register(obj, 'my-obj');

obj = null; // Eventually triggers the callback
```

**`WeakMap`**: A Map where keys are objects held weakly. If the key object has no other references, the entry is automatically removed.

```js
const metadata = new WeakMap();

let element = document.getElementById('btn');
metadata.set(element, { clicks: 0 });

element.remove();
element = null; // Entry is automatically removed from WeakMap
```

**When to use weak references**:

1. **Caching/memoization**: Cache results keyed by objects without preventing their garbage collection.
```js
const cache = new WeakMap();
function processData(obj) {
  if (cache.has(obj)) return cache.get(obj);
  const result = expensiveComputation(obj);
  cache.set(obj, result);
  return result;
}
```

2. **DOM element metadata**: Attach data to DOM elements without preventing their removal.
```js
const elementData = new WeakMap();
elementData.set(document.getElementById('btn'), { initialized: true });
```

3. **Observer patterns**: Track observers without preventing their cleanup.

Weak references are NOT suitable when you need to guarantee the object stays alive, when you need to iterate over entries (`WeakMap`/`WeakSet` are not iterable), or when you need a `size` property.
