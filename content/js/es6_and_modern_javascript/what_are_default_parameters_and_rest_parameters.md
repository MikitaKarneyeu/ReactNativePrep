Default parameters allow function parameters to have fallback values when `undefined` or no argument is passed. Rest parameters allow a function to accept an indefinite number of arguments as an array.

**Default parameters**:

```js
function createUser(name, role = 'user', active = true) {
  return { name, role, active };
}

createUser('Alice');                // { name: 'Alice', role: 'user', active: true }
createUser('Bob', 'admin');         // { name: 'Bob', role: 'admin', active: true }
createUser('Charlie', undefined, false); // { name: 'Charlie', role: 'user', active: false }
```

Default values are evaluated at call time, not at definition time, so you can use expressions and reference other parameters:

```js
function createPoint(x = 0, y = x * 2) {
  return { x, y };
}

createPoint(5); // { x: 5, y: 10 }
```

Before ES6, the common pattern was `param = param || defaultValue`, but this falsely rejects `0`, `''`, `null`, and `false`. ES6 defaults only trigger on `undefined`.

**Rest parameters**:

```js
function sum(...numbers) {
  return numbers.reduce((total, n) => total + n, 0);
}

sum(1, 2, 3);       // 6
sum(1, 2, 3, 4, 5); // 15

function log(level, ...messages) {
  console.log(`[${level}]`, ...messages);
}

log('INFO', 'Server', 'started', 'on port 3000');
```

Rest parameters must be the last parameter. They collect remaining arguments into a real array (unlike the legacy `arguments` object, which is array-like and not a true array).

```js
// Before ES6
function oldSum() {
  return Array.from(arguments).reduce((total, n) => total + n, 0);
}

// With rest parameters — cleaner and supports array methods directly
function sum(...numbers) {
  return numbers.reduce((total, n) => total + n, 0);
}
```

Rest parameters and default parameters can be combined:

```js
function greet(greeting = 'Hello', ...names) {
  return names.map(name => `${greeting}, ${name}!`);
}
```
