A transpiler converts source code from one version of JavaScript to another, typically transforming modern (ES6+) syntax into older syntax (ES5) that is compatible with older browsers and environments. Babel is the most widely used JavaScript transpiler.

**What Babel does**:

1. **Syntax transformation**: Converts modern syntax to older equivalents.
```js
// Input (ES6+)
const greet = (name) => `Hello, ${name}!`;
const [a, b] = [1, 2];
class Person {
  constructor(name) { this.name = name; }
}

// Output (ES5)
var greet = function greet(name) {
  return "Hello, " + name + "!";
};
var _ref = [1, 2],
    a = _ref[0],
    b = _ref[1];
function Person(name) { this.name = name; }
```

2. **Polyfilling**: Babel can integrate with `core-js` to add missing APIs (e.g., `Promise`, `Array.from`, `Object.assign`) to environments that do not have them.

3. **JSX transformation**: Converts JSX syntax (React) to `React.createElement` calls.

4. **TypeScript stripping**: Babel can remove TypeScript type annotations (though it does not type-check).

**How Babel works** (three stages):

1. **Parsing**: Converts source code into an AST (Abstract Syntax Tree).
2. **Transforming**: Applies plugins to modify the AST. Each plugin handles a specific transformation.
3. **Generating**: Converts the modified AST back into source code.

**Configuration**:

```json
{
  "presets": [
    ["@babel/preset-env", {
      "targets": "> 0.25%, not dead",
      "useBuiltIns": "usage",
      "corejs": 3
    }],
    "@babel/preset-react",
    "@babel/preset-typescript"
  ],
  "plugins": ["@babel/plugin-proposal-decorators"]
}
```

`@babel/preset-env` is the key preset—it determines which transformations are needed based on your target browsers (using browserslist queries).

**Why transpiling is still needed**:

- Some users still use older browsers.
- New JavaScript features go through stages before being fully supported.
- Frameworks like React require JSX transformation.
- TypeScript needs to be compiled to JavaScript.

**Modern alternatives**:

- **SWC**: Written in Rust, much faster than Babel.
- **esbuild**: Written in Go, extremely fast.
- **Bun**: Has a built-in transpiler.

These tools are increasingly replacing Babel for performance-critical builds, while Babel remains the most flexible and plugin-rich option.
