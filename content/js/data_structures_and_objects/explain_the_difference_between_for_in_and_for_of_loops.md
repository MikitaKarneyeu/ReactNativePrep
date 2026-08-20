`for...in` iterates over the enumerable property names (keys) of an object. `for...of` iterates over the values of an iterable (arrays, strings, Maps, Sets, generators, etc.).

**`for...in`** — for objects:

```js
const obj = { a: 1, b: 2, c: 3 };

for (const key in obj) {
  console.log(key);      // 'a', 'b', 'c'
  console.log(obj[key]); // 1, 2, 3
}
```

It iterates over all enumerable properties, including inherited ones. On arrays, it iterates over indices as strings and includes any added non-index properties:

```js
const arr = [10, 20, 30];
arr.custom = 'hello';

for (const key in arr) {
  console.log(key); // '0', '1', '2', 'custom'
}
```

This is why `for...in` should not be used on arrays.

**`for...of`** — for iterables:

```js
const arr = [10, 20, 30];
for (const value of arr) {
  console.log(value); // 10, 20, 30
}

const str = 'hello';
for (const char of str) {
  console.log(char); // 'h', 'e', 'l', 'l', 'o'
}

const map = new Map([['a', 1], ['b', 2]]);
for (const [key, value] of map) {
  console.log(key, value);
}

const set = new Set([1, 2, 3]);
for (const value of set) {
  console.log(value);
}
```

Key differences:

| Feature | `for...in` | `for...of` |
|---------|-----------|-----------|
| Iterates over | Property keys (strings) | Values |
| Works with | Objects | Iterables (arrays, strings, Map, Set, etc.) |
| Inherited props | Yes | No |
| Use on arrays | No (string indices, inherited props) | Yes |
| Protocols | Enumerable properties | Iterator protocol (`Symbol.iterator`) |

To iterate over an object's values with `for...of`, use `Object.values()`:

```js
for (const value of Object.values(obj)) {
  console.log(value);
}
```

For both keys and values:

```js
for (const [key, value] of Object.entries(obj)) {
  console.log(key, value);
}
```

Rule of thumb: use `for...in` for object keys, `for...of` for everything else.
