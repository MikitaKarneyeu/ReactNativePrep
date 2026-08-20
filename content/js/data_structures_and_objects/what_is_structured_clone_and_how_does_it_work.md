`structuredClone(value, options)` is a global function (added in 2022) that creates a deep clone of a given value using the structured clone algorithm. It is the standard way to deep-copy complex JavaScript objects.

```js
const original = {
  name: 'Alice',
  date: new Date(),
  map: new Map([['key', 'value']]),
  set: new Set([1, 2, 3]),
  regex: /hello/gi,
  nested: { a: { b: 1 } }
};

const clone = structuredClone(original);

clone.nested.a.b = 2;
console.log(original.nested.a.b); // 1 — fully independent
```

Supported types: plain objects, arrays, `Date`, `RegExp`, `Map`, `Set`, `ArrayBuffer`, `TypedArray`, `DataView`, `Blob`, `File`, `ImageData`, and more. It also handles circular references:

```js
const obj = { a: 1 };
obj.self = obj; // circular reference
const clone = structuredClone(obj); // Works!
```

What `structuredClone` does NOT support:
- Functions (throws `DataCloneError`)
- DOM nodes (throws `DataCloneError`)
- Symbol properties (silently omitted)
- Property descriptors (getter/setter are not cloned)
- Prototype chain (clones own properties into a plain object)

```js
const fn = () => {};
structuredClone({ fn }); // DataCloneError

const sym = Symbol('id');
structuredClone({ [sym]: 1 }); // {} — Symbol is silently dropped
```

`structuredClone` vs. `JSON.parse(JSON.stringify())`:

| Feature | `structuredClone` | `JSON` round-trip |
|---------|------------------|-------------------|
| Date | Cloned as Date | Converted to string |
| Map/Set | Cloned | Lost |
| RegExp | Cloned | Lost |
| Circular refs | Supported | Throws error |
| undefined values | Preserved | Lost |
| Functions | Throws | Lost |

`structuredClone` is available in browsers (2022), Node.js (17+), Deno, and Bun. For older environments, use a polyfill like `core-js` or a library like `lodash.cloneDeep`.
