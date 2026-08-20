Closures enable data privacy by encapsulating variables inside a function scope and exposing only a controlled public API through returned methods. Variables defined in the outer function are inaccessible from outside—they can only be read or modified through the closure.

```js
function createBankAccount(initialBalance) {
  let balance = initialBalance;

  return {
    deposit(amount) {
      if (amount > 0) balance += amount;
      return balance;
    },
    withdraw(amount) {
      if (amount > 0 && amount <= balance) balance -= amount;
      return balance;
    },
    getBalance() {
      return balance;
    }
  };
}

const account = createBankAccount(100);
account.deposit(50);
console.log(account.getBalance()); // 150
console.log(account.balance);      // undefined
```

`balance` is private. There is no way to access it directly from outside `createBankAccount`. The only way to interact with it is through the returned methods, which act as the public interface.

This pattern is used in the module pattern, which was the primary way to create private members before ES6 classes supported private fields:

```js
const Counter = (function() {
  let count = 0;

  return {
    increment() { return ++count; },
    decrement() { return --count; },
    getCount() { return count; }
  };
})();
```

Modern ES6 classes now support private fields with the `#` prefix, but closures remain useful for: factory functions that need private state, libraries that expose a public API while hiding internals, and scenarios where you want fine-grained control over what is exposed.

The tradeoff is that each closure instance creates its own copies of the methods, which uses more memory than shared prototype methods. For most applications this is negligible, but it is worth considering when creating many instances.
