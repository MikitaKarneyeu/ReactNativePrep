The spread operator (`...`) and the rest operator (`...`) use the same syntax but serve opposite purposes. Spread expands an iterable into individual elements. Rest collects multiple elements into an array.

**Spread** — expanding:

```js
// Array spreading
const arr1 = [1, 2, 3];
const arr2 = [...arr1, 4, 5]; // [1, 2, 3, 4, 5]

// Object spreading
const obj1 = { a: 1, b: 2 };
const obj2 = { ...obj1, c: 3 }; // { a: 1, b: 2, c: 3 }

// Function arguments
const nums = [1, 2, 3];
Math.max(...nums); // 3 (equivalent to Math.max(1, 2, 3))

// Copying (shallow)
const copy = [...arr1];
const objCopy = { ...obj1 };
```

**Rest** — collecting:

```js
// Array destructuring
const [first, ...rest] = [1, 2, 3, 4];
// first=1, rest=[2, 3, 4]

// Object destructuring
const { name, ...details } = { name: 'Alice', age: 30, city: 'NYC' };
// name='Alice', details={ age: 30, city: 'NYC' }

// Function parameters
function sum(...numbers) {
  return numbers.reduce((a, b) => a + b, 0);
}
```

The distinction is context-dependent: when `...` appears in a value position (right side of assignment, function call argument, array/object literal), it is spread. When it appears in a binding position (left side of assignment, function parameter list), it is rest.

```js
// Spread: right side
const combined = [...arr1, ...arr2];

// Rest: left side
const [a, b, ...remaining] = combined;

// Spread: function call
console.log(...arr1);

// Rest: function definition
function fn(...args) {}
```

Object spread performs a shallow merge—nested objects are still by reference:

```js
const original = { nested: { x: 1 } };
const copy = { ...original };
copy.nested.x = 2;
console.log(original.nested.x); // 2 — same reference
```

The spread operator works with all iterables (arrays, strings, Maps, Sets, generators), while rest works with any remaining elements in destructuring or function arguments.
