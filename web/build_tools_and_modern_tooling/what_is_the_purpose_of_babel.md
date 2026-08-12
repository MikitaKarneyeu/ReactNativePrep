Babel is a JavaScript transpiler that converts modern JavaScript (ES6+ and beyond) into backward-compatible versions that older browsers can understand. It also powers JSX transformation in React and can be extended with plugins for various code transformations.

**What Babel does:**

1. **Syntax transformation** — Converts modern syntax to older equivalents
2. **JSX transformation** — Transforms JSX syntax into `React.createElement` calls
3. **Polyfilling** — Adds missing APIs (via core-js) for older environments
4. **Code transformation** — Custom transformations via plugins

**Syntax transformation examples:**

```javascript
// Input (modern JavaScript)
const greet = (name) => `Hello, ${name}!`;
const { firstName, lastName } = user;
const numbers = [1, 2, 3];
const doubled = numbers.map(n => n * 2);
class Animal { constructor(name) { this.name = name; } }
const result = a ?? b;
const value = obj?.nested?.property;

// Output (ES5 compatible)
var greet = function greet(name) { return "Hello, " + name + "!"; };
var firstName = user.firstName;
var lastName = user.lastName;
var numbers = [1, 2, 3];
var doubled = numbers.map(function(n) { return n * 2; });
var Animal = function Animal(name) { this.name = name; };
var result = a !== null && a !== void 0 ? a : b;
var value = obj === null || obj === void 0 ? void 0 : (_obj$nested = obj.nested) === null || _obj$nested === void 0 ? void 0 : _obj$nested.property;
```

**Babel configuration:**

```json
// babel.config.json
{
  "presets": [
    ["@babel/preset-env", {
      "targets": "> 0.25%, not dead",
      "useBuiltIns": "usage",
      "corejs": 3
    }],
    ["@babel/preset-react", {
      "runtime": "automatic"
    }],
    "@babel/preset-typescript"
  ],
  "plugins": [
    "@babel/plugin-proposal-optional-chaining",
    "@babel/plugin-proposal-nullish-coalescing-operator"
  ]
}
```

**Key presets:**

- **`@babel/preset-env`** — Transforms modern JavaScript based on your target browsers
- **`@babel/preset-react`** — Transforms JSX
- **`@babel/preset-typescript`** — Strips TypeScript type annotations
- **`@babel/preset-flow`** — Strips Flow type annotations

**Browser targets:**

```json
{
  "presets": [
    ["@babel/preset-env", {
      "targets": "> 0.5%, last 2 versions, Firefox ESR, not dead"
    }]
  ]
}

// Or .browserslistrc
// > 0.5%
// last 2 versions
// Firefox ESR
// not dead
```

**Polyfills with core-js:**

```json
{
  "presets": [
    ["@babel/preset-env", {
      "useBuiltIns": "usage", // Only include needed polyfills
      "corejs": 3
    }]
  ]
}

// useBuiltIns options:
// "usage" — Automatically adds polyfills based on usage (recommended)
// "entry" — Import all polyfills for your target browsers
// false — No polyfills
```

**Babel in the build pipeline:**

```javascript
// Webpack integration
module: {
  rules: [
    {
      test: /\.jsx?$/,
      exclude: /node_modules/,
      use: 'babel-loader'
    }
  ]
}

// Vite uses esbuild by default, Babel is optional
// Rollup uses @rollup/plugin-babel
```

**Custom plugins:**

```javascript
// Babel plugin to console.log in development
module.exports = function() {
  return {
    visitor: {
      CallExpression(path) {
        if (path.node.callee.name === 'console.log') {
          if (process.env.NODE_ENV === 'production') {
            path.remove();
          }
        }
      }
    }
  };
};
```

**Babel vs esbuild vs SWC:**

| Tool | Speed | Language | Use Case |
|------|-------|----------|----------|
| Babel | Slow | JavaScript | Maximum compatibility, extensive plugins |
| esbuild | Very fast | Go | Vite's default, fast builds |
| SWC | Very fast | Rust | Webpack's replacement for Babel |

**Modern usage:**

In modern projects using Vite or newer Webpack configurations, Babel is often replaced by esbuild or SWC for speed. However, Babel remains essential when:

1. You need specific Babel plugins that have no equivalent in esbuild/SWC
2. You need maximum backward compatibility
3. You're doing custom code transformations
4. You need precise control over polyfilling

Most modern projects using Vite don't need Babel at all — esbuild handles JSX transformation and modern syntax, and `@vitejs/plugin-react` handles React-specific transformations.
