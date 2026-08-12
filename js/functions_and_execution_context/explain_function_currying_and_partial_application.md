Currying is the process of transforming a function that takes multiple arguments into a sequence of functions that each take one argument. Partial application is fixing a few arguments of a function, producing a function that takes the remaining arguments.

**Currying**:

```js
// Regular function
function add(a, b, c) {
  return a + b + c;
}

// Curried version
function curryAdd(a) {
  return function(b) {
    return function(c) {
      return a + b + c;
    };
  };
}

curryAdd(1)(2)(3); // 6

// Arrow function version
const curryAdd = a => b => c => a + b + c;
```

A generic curry helper:

```js
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    return (...moreArgs) => curried(...args, ...moreArgs);
  };
}

const add = curry((a, b, c) => a + b + c);
add(1)(2)(3);     // 6
add(1, 2)(3);     // 6
add(1)(2, 3);     // 6
```

**Partial application**:

```js
function multiply(a, b) {
  return a * b;
}

const double = multiply.bind(null, 2);
double(5); // 10

// Using closures
const triple = (b) => multiply(3, b);
triple(5); // 15
```

Currying vs. partial application: currying always produces a chain of unary functions, while partial application fixes some arguments and produces a function that takes the rest (which may be more than one).

Practical uses:

```js
// Logging utility
const log = level => timestamp => message => {
  console.log(`[${level}] ${timestamp}: ${message}`);
};

const errorLog = log('ERROR');
const errorNow = errorLog(new Date().toISOString());
errorNow('Something broke');

// Reusable mappers
const prop = key => obj => obj[key];
const getName = prop('name');
users.map(getName); // ['Alice', 'Bob']

// Event handlers
const handleEvent = eventType => handler => event => {
  if (event.type === eventType) handler(event);
};
```

Currying enables function composition, point-free style, and creating specialized functions from general-purpose ones.
