There are several ways to check if a property exists on an object, each with different semantics.

**1. `in` operator** — checks the entire prototype chain:

```js
const obj = { a: 1 };
const arr = [1, 2, 3];

'a' in obj;          // true
'b' in obj;          // false
'toString' in obj;   // true (inherited from Object.prototype)
'length' in arr;     // true
'0' in arr;          // true
```

**2. `hasOwnProperty()`** — checks own properties only:

```js
obj.hasOwnProperty('a');        // true
obj.hasOwnProperty('toString'); // false (inherited)
```

**3. `Object.hasOwn()`** (ES2022) — preferred modern replacement for `hasOwnProperty`:

```js
Object.hasOwn(obj, 'a');        // true
Object.hasOwn(obj, 'toString'); // false
```

Unlike `hasOwnProperty`, it works safely on objects created with `Object.create(null)` and does not risk throwing if the method is overridden.

**4. Property access / `undefined` check** — checks if the value is not `undefined`:

```js
obj.a !== undefined; // true
obj.b !== undefined; // false
```

This can give false positives if the property exists but its value is `undefined`:

```js
const obj = { a: undefined };
obj.a !== undefined; // false — but the property exists!
```

**5. Optional chaining** — safe deep property access:

```js
const nested = { a: { b: { c: 1 } } };
nested?.a?.b?.c !== undefined; // true
```

Comparison:

| Method | Own only | Handles `undefined` values | Works with `null` prototype |
|--------|----------|---------------------------|----------------------------|
| `in` | No | Yes | Yes |
| `hasOwnProperty` | Yes | Yes | No (needs call) |
| `Object.hasOwn` | Yes | Yes | Yes |
| `!== undefined` | Yes | No | Yes |

Recommendations:
- Use `Object.hasOwn()` for checking own properties (modern code).
- Use `in` when you need to check the prototype chain (e.g., checking for inherited methods).
- Avoid `!== undefined` checks when `undefined` is a valid property value.
