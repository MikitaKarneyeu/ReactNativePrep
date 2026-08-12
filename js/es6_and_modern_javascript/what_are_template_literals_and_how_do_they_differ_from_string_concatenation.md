Template literals are string literals delimited by backticks (`` ` ``) that support embedded expressions and multi-line strings. They differ from string concatenation (using `+`) in syntax, readability, and capabilities.

```js
// String concatenation
const name = 'Alice';
const greeting = 'Hello, ' + name + '! You are ' + age + ' years old.';

// Template literal
const greeting2 = `Hello, ${name}! You are ${age} years old.`;
```

The `${}` syntax can contain any JavaScript expression, not just variables:

```js
const price = 10;
const quantity = 3;
console.log(`Total: $${price * quantity}`);
console.log(`Status: ${quantity > 0 ? 'in stock' : 'out of stock'}`);
```

Multi-line strings are a major advantage. With concatenation, you need explicit `\n` or string joining. Template literals preserve newlines:

```js
const html = `
  <div class="card">
    <h2>${title}</h2>
    <p>${description}</p>
  </div>
`;
```

Template literals also support **tagged templates**, where a function processes the template:

```js
function highlight(strings, ...values) {
  return strings.reduce((result, str, i) => {
    return result + str + (values[i] ? `<b>${values[i]}</b>` : '');
  }, '');
}

const name = 'Alice';
const age = 30;
highlight`Name: ${name}, Age: ${age}`;
// "Name: <b>Alice</b>, Age: <b>30</b>"
```

Tagged templates are used in libraries like styled-components and for safe HTML escaping.

Performance-wise, template literals and concatenation are comparable in modern engines. The choice comes down to readability and functionality—template literals are preferred for string interpolation, multi-line strings, and when tagged templates are needed.
