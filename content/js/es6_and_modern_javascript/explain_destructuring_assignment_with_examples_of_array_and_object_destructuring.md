Destructuring assignment is a syntax that unpacks values from arrays or properties from objects into distinct variables. It provides a concise way to extract data.

**Array destructuring** uses position-based matching:

```js
const [a, b, c] = [1, 2, 3];
// a=1, b=2, c=3

// Skip elements
const [, second] = [1, 2, 3];
// second=2

// Rest pattern
const [first, ...rest] = [1, 2, 3, 4];
// first=1, rest=[2, 3, 4]

// Default values
const [x = 10, y = 20] = [5];
// x=5, y=20

// Swapping variables
let a = 1, b = 2;
[a, b] = [b, a];
// a=2, b=1
```

**Object destructuring** uses property name matching:

```js
const { name, age } = { name: 'Alice', age: 30, city: 'NYC' };
// name='Alice', age=30

// Rename variables
const { name: userName, age: userAge } = { name: 'Alice', age: 30 };
// userName='Alice', userAge=30

// Default values
const { name, role = 'user' } = { name: 'Alice' };
// name='Alice', role='user'

// Nested destructuring
const { address: { city, zip } } = {
  name: 'Alice',
  address: { city: 'NYC', zip: '10001' }
};
// city='NYC', zip='10001'

// Rest pattern
const { name, ...details } = { name: 'Alice', age: 30, city: 'NYC' };
// details={ age: 30, city: 'NYC' }
```

Destructuring works in function parameters:

```js
function greet({ name, greeting = 'Hello' }) {
  return `${greeting}, ${name}!`;
}

greet({ name: 'Alice' }); // "Hello, Alice!"
```

It also works with `for...of` loops, `import` statements, and `try/catch` (in some environments). Destructuring does not mutate the original array or object.
