An **iterator** is an object that implements the iterator protocol: a `next()` method that returns an object with `value` and `done` properties. An **iterable** is an object that implements `Symbol.iterator`, which returns an iterator.

```js
// Manual iterator
const range = {
  from: 1,
  to: 5,
  [Symbol.iterator]() {
    let current = this.from;
    const last = this.to;
    return {
      next() {
        return current <= last
          ? { value: current++, done: false }
          : { done: true };
      }
    };
  }
};

for (const num of range) {
  console.log(num); // 1, 2, 3, 4, 5
}
```

Arrays, strings, Maps, Sets, and `arguments` are built-in iterables. They work with `for...of`, spread, destructuring, and `Array.from`.

A **generator** is a special function that can pause and resume execution. It is defined with `function*` and uses `yield` to produce values. Calling a generator function returns a generator object, which is both an iterator and an iterable.

```js
function* countUp(from, to) {
  for (let i = from; i <= to; i++) {
    yield i;
  }
}

const gen = countUp(1, 3);
gen.next(); // { value: 1, done: false }
gen.next(); // { value: 2, done: false }
gen.next(); // { value: 3, done: false }
gen.next(); // { value: undefined, done: true }

for (const num of countUp(1, 5)) {
  console.log(num); // 1, 2, 3, 4, 5
}
```

Generators are lazy—they compute values on demand, which is memory-efficient for large or infinite sequences:

```js
function* fibonacci() {
  let a = 0, b = 1;
  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
}

const fib = fibonacci();
fib.next().value; // 0
fib.next().value; // 1
fib.next().value; // 1
fib.next().value; // 2
```

Generators also support two-way communication via `yield` expressions and the `.return()` / `.throw()` methods, enabling patterns like coroutines and async flow control (before async/await).
