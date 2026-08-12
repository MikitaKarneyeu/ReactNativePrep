A shallow copy duplicates the top-level structure but shares references to nested objects. A deep copy duplicates everything recursively, creating a completely independent clone.

**Shallow copy**:

```js
const original = { name: 'Alice', address: { city: 'NYC' } };
const shallow = { ...original };

shallow.name = 'Bob';
console.log(original.name); // 'Alice' — independent

shallow.address.city = 'LA';
console.log(original.address.city); // 'LA' — shared reference!
```

Common shallow copy methods:

```js
// Object spread
const copy = { ...obj };

// Object.assign
const copy = Object.assign({}, obj);

// Array spread
const arrCopy = [...arr];

// Array.slice
const arrCopy = arr.slice();
```

**Deep copy**:

```js
const original = { name: 'Alice', address: { city: 'NYC' } };
const deep = structuredClone(original);

deep.address.city = 'LA';
console.log(original.address.city); // 'NYC' — completely independent
```

Deep copy methods:

```js
// structuredClone (modern, recommended)
const deep = structuredClone(original);

// JSON round-trip (has limitations)
const deep = JSON.parse(JSON.stringify(original));
// Limitations: no functions, no undefined, no Date/RegExp/Map/Set,
// no circular references, no Infinity/NaN
```

Key differences with a table:

| Feature | Shallow copy | Deep copy |
|---------|-------------|-----------|
| Top-level primitives | Independent | Independent |
| Nested objects | Shared references | Independent |
| Performance | Fast | Slower (recursive) |
| Memory | Less | More |

When to use which:

- **Shallow copy**: When the object has no nested objects, or when you intentionally want to share nested references (e.g., performance optimization).
- **Deep copy**: When you need a fully independent clone, especially when passing state to functions that should not mutate the original.

`structuredClone` (2022) is the modern standard for deep cloning. It handles most types including `Date`, `RegExp`, `Map`, `Set`, `ArrayBuffer`, and circular references. It does not handle functions, DOM nodes, or certain built-in objects.
