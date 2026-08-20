There are several ways to iterate over an object's properties in JavaScript, each with different behaviors regarding inherited properties, enumerability, and Symbol keys.

**1. `for...in`** — iterates over all enumerable string properties, including inherited ones:

```js
const obj = { a: 1, b: 2, c: 3 };

for (const key in obj) {
  if (obj.hasOwnProperty(key)) { // filter out inherited properties
    console.log(key, obj[key]);
  }
}
```

**2. `Object.keys()`** — returns an array of the object's own enumerable string properties:

```js
Object.keys(obj).forEach(key => {
  console.log(key, obj[key]);
});
```

**3. `Object.values()`** — returns an array of the object's own enumerable values:

```js
Object.values(obj).forEach(value => {
  console.log(value);
});
```

**4. `Object.entries()`** — returns an array of `[key, value]` pairs:

```js
for (const [key, value] of Object.entries(obj)) {
  console.log(key, value);
}
```

**5. `Object.getOwnPropertyNames()`** — returns all own string properties, including non-enumerable ones:

```js
Object.getOwnPropertyNames(obj).forEach(key => {
  console.log(key, obj[key]);
});
```

**6. `Object.getOwnPropertySymbols()`** — returns own Symbol properties:

```js
const sym = Symbol('id');
const obj = { [sym]: 123, a: 1 };
Object.getOwnPropertySymbols(obj).forEach(sym => {
  console.log(sym, obj[sym]);
});
```

**7. `Reflect.ownKeys()`** — returns all own properties (string + Symbol, enumerable + non-enumerable):

```js
Reflect.ownKeys(obj).forEach(key => {
  console.log(key, obj[key]);
});
```

Comparison:

| Method | Own only | Enumerable | String keys | Symbol keys |
|--------|----------|-----------|-------------|-------------|
| `for...in` | No | Yes | Yes | No |
| `Object.keys()` | Yes | Yes | Yes | No |
| `Object.values()` | Yes | Yes | — | No |
| `Object.entries()` | Yes | Yes | Yes | No |
| `Object.getOwnPropertyNames()` | Yes | All | Yes | No |
| `Object.getOwnPropertySymbols()` | Yes | All | No | Yes |
| `Reflect.ownKeys()` | Yes | All | Yes | Yes |

For most use cases, `Object.entries()` is the most convenient since it provides both key and value in a clean syntax.
