`Object.freeze()` and `Object.seal()` are methods that control the mutability of objects. They differ in what changes they prevent.

**`Object.seal(obj)`** — Prevents adding new properties and removes the ability to configure (delete or reconfigure) existing properties. However, existing property values can still be changed.

```js
const user = { name: 'Alice', age: 30 };
Object.seal(user);

user.name = 'Bob';       // Allowed — modifying existing value
user.email = 'a@b.com';  // Silently fails (or TypeError in strict mode)
delete user.name;         // Silently fails (or TypeError in strict mode)

Object.isSealed(user); // true
```

**`Object.freeze(obj)`** — Does everything `seal` does, and also makes existing properties read-only (values cannot be changed).

```js
const config = { apiUrl: 'https://api.example.com', timeout: 5000 };
Object.freeze(config);

config.apiUrl = 'https://hacked.com'; // Silently fails (or TypeError in strict mode)
config.timeout = 0;                   // Silently fails
config.newProp = 'value';             // Silently fails
delete config.apiUrl;                 // Silently fails

Object.isFrozen(config); // true
```

**Shallow vs. deep**: Both `freeze` and `seal` are shallow. Nested objects can still be mutated:

```js
const obj = { nested: { x: 1 } };
Object.freeze(obj);

obj.nested.x = 2;     // Allowed! obj.nested is not frozen
console.log(obj.nested.x); // 2
```

Deep freeze requires recursion:

```js
function deepFreeze(obj) {
  Object.freeze(obj);
  Object.values(obj).forEach(val => {
    if (typeof val === 'object' && val !== null && !Object.isFrozen(val)) {
      deepFreeze(val);
    }
  });
  return obj;
}
```

Comparison:

| Feature | `seal` | `freeze` |
|---------|--------|----------|
| Add new properties | No | No |
| Delete properties | No | No |
| Reconfigure properties | No | No |
| Modify values | Yes | No |

Use cases:
- **Seal**: When you want a fixed shape but mutable values (e.g., configuration objects where keys are fixed).
- **Freeze**: When you need immutability (e.g., constants, Redux state, configuration that should never change).
- In strict mode, violations throw `TypeError`. In non-strict mode, they silently fail.
