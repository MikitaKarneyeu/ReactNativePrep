`call`, `apply`, and `bind` are methods on `Function.prototype` that allow you to explicitly set the `this` context of a function. They differ in how they invoke the function and handle arguments.

**`call(thisArg, arg1, arg2, ...)`** — Invokes the function immediately with the given `this` and individual arguments.

```js
function greet(greeting, punctuation) {
  return `${greeting}, ${this.name}${punctuation}`;
}

const user = { name: 'Alice' };
greet.call(user, 'Hello', '!'); // "Hello, Alice!"
```

**`apply(thisArg, [argsArray])`** — Same as `call`, but takes arguments as an array.

```js
greet.apply(user, ['Hello', '!']); // "Hello, Alice!"
```

`apply` is useful when arguments are already in an array:

```js
const nums = [3, 1, 4, 1, 5];
Math.max.apply(null, nums); // 5
// Modern: Math.max(...nums)
```

**`bind(thisArg, arg1, ...)`** — Returns a new function with `this` permanently bound to the given object. It does not invoke the function immediately. Partial application of arguments is also possible.

```js
const greetAlice = greet.bind(user, 'Hi');
greetAlice('!'); // "Hi, Alice!"

// `this` cannot be overridden
greetAlice.call({ name: 'Bob' }, '?'); // "Hi, Alice!" (still user)
```

Key differences:

| Feature | `call` | `apply` | `bind` |
|---------|--------|---------|--------|
| Invocation | Immediate | Immediate | Returns new function |
| Arguments | Individual | Array | Individual (partial) |
| `this` override | Yes | Yes | Permanent |

`bind` is commonly used for callbacks where `this` would otherwise be lost:

```js
class Component {
  constructor() {
    this.value = 42;
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    console.log(this.value);
  }
}
```

Arrow functions have made `bind` less necessary for `this` binding, but it remains useful for partial application and when you need a permanently bound function reference.
