A higher-order function is a function that either takes one or more functions as arguments, returns a function, or both. It is a fundamental concept in functional programming and is pervasive in JavaScript.

```js
// Takes a function as an argument
function repeat(n, action) {
  for (let i = 0; i < n; i++) {
    action(i);
  }
}

repeat(3, console.log); // 0, 1, 2

// Returns a function
function multiply(factor) {
  return (number) => number * factor;
}

const double = multiply(2);
double(5); // 10
```

JavaScript's array methods are higher-order functions:

```js
const numbers = [1, 2, 3, 4, 5];

numbers.map(n => n * 2);           // [2, 4, 6, 8, 10]
numbers.filter(n => n > 3);        // [4, 5]
numbers.reduce((sum, n) => sum + n, 0); // 15
numbers.find(n => n > 3);          // 4
numbers.every(n => n > 0);         // true
numbers.some(n => n > 4);          // true
```

Higher-order functions enable composition—building complex behavior from simple pieces:

```js
const compose = (...fns) => (x) => fns.reduceRight((acc, fn) => fn(acc), x);

const addOne = x => x + 1;
const double = x => x * 2;
const square = x => x * x;

const transform = compose(square, double, addOne);
transform(3); // square(double(addOne(3))) = square(double(4)) = square(8) = 64
```

Other common higher-order functions: event handlers, middleware (Express), decorators, `setTimeout`/`setInterval`, Promise `.then()`/`.catch()`, and `Array.prototype.sort()`.

Higher-order functions promote code reuse, separation of concerns, and declarative programming. Instead of writing loops with imperative logic, you describe what you want done by passing behavior (functions) to other functions.
