An execution context is an abstract concept that describes the environment in which JavaScript code is evaluated and executed. It contains information about the code's scope, variables, functions, and the value of `this`.

There are three types of execution contexts:

1. **Global execution context (GEC)**: Created when the JavaScript engine first executes your code. It creates the global object (`window` in browsers, `global` in Node.js), sets `this` to the global object, and sets up the global scope. There is only one GEC.

2. **Function execution context (FEC)**: Created each time a function is invoked. Each function call gets its own context with its own scope, local variables, and `this` binding.

3. **Eval execution context**: Created when code is executed inside the `eval()` function. Generally avoided.

Each execution context has two phases:

**Creation phase**: The engine sets up the environment before execution:
- Creates the Variable Environment (for `var` declarations, initialized to `undefined`)
- Creates the Lexical Environment (for `let`/`const`, in temporal dead zone)
- Determines the value of `this`
- Creates a reference to the outer (parent) lexical environment (scope chain)

**Execution phase**: The engine executes the code line by line, assigning values to variables, executing function calls, and so on.

```js
const name = 'Alice';

function greet(greeting) {
  const message = `${greeting}, ${name}!`;
  return message;
}

greet('Hello');
```

When `greet('Hello')` is called, a new FEC is created. Its lexical environment includes `greeting` (set to `'Hello'`), `message` (initially undefined), and a reference to the outer scope (the GEC where `name` lives).

Execution contexts are managed using the call stack. When a function is called, its context is pushed onto the stack. When it returns, the context is popped off. The top of the stack is the currently running execution context.
