Prettier is an opinionated code formatter that automatically formats your code to ensure consistent style across your project. Unlike ESLint, which focuses on code quality rules, Prettier focuses exclusively on formatting — spaces, line breaks, quotes, semicolons, trailing commas, and other visual aspects of the code.

**What Prettier formats:**

```javascript
// Before Prettier
const user = { name: 'Alice', email: 'alice@example.com', age: 30, role: 'admin', isActive: true };
function greet(  name, greeting ){if(greeting){return greeting+', '+name+'!'}return 'Hello, '+name+'!'}

// After Prettier
const user = {
  name: "Alice",
  email: "alice@example.com",
  age: 30,
  role: "admin",
  isActive: true,
};
function greet(name, greeting) {
  if (greeting) {
    return greeting + ", " + name + "!";
  }
  return "Hello, " + name + "!";
}
```

**Configuration (.prettierrc):**

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80,
  "bracketSpacing": true,
  "arrowParens": "always",
  "endOfLine": "lf",
  "jsxSingleQuote": false
}
```

**Prettier vs ESLint:**

| Aspect | Prettier | ESLint |
|--------|----------|--------|
| Purpose | Code formatting | Code quality and rules |
| Focus | How code looks | How code works |
| Rules | Spacing, quotes, semicolons, line breaks | Logic errors, best practices, patterns |
| Opinion | Highly opinionated | Configurable |
| Auto-fix | Formats entire file | Fixes rule violations |

**How they work together:**

ESLint and Prettier serve complementary purposes and should be used together:

1. **Prettier** handles all formatting (spaces, line breaks, quotes)
2. **ESLint** handles code quality (no unused vars, no console.log, consistent-type-imports)
3. **`eslint-config-prettier`** disables ESLint rules that conflict with Prettier

**Setup:**

```bash
# Install
npm install -D prettier eslint-config-prettier
```

```javascript
// ESLint config — disable conflicting rules
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'prettier' // Must be LAST — overrides formatting rules
  ]
};
```

**Running Prettier:**

```bash
# Format specific files
npx prettier --write src/App.tsx

# Format all files
npx prettier --write "src/**/*.{js,jsx,ts,tsx,css,md}"

# Check without formatting (for CI)
npx prettier --check "src/**/*.{js,jsx,ts,tsx,css,md}"

# Format with package.json scripts
{
  "scripts": {
    "format": "prettier --write 'src/**/*.{js,jsx,ts,tsx,css,md}'",
    "format:check": "prettier --check 'src/**/*.{js,jsx,ts,tsx,css,md}'"
  }
}
```

**Ignore files (.prettierignore):**

```
node_modules/
dist/
build/
coverage/
*.min.js
package-lock.json
```

**IDE integration:**

```json
// VS Code settings.json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.formatOnPaste": true
}
```

**Prettier with other tools:**

```css
/* Prettier formats CSS */
.container {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

```html
<!-- Prettier formats HTML -->
<div class="container">
  <h1>Hello World</h1>
  <p>This is formatted by Prettier.</p>
</div>
```

```json
// Prettier formats JSON
{
  "name": "my-app",
  "version": "1.0.0"
}
```

**Prettier with Tailwind CSS:**

```bash
npm install -D prettier-plugin-tailwindcss
```

```json
// .prettierrc
{
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

This plugin automatically sorts Tailwind CSS classes in a consistent order.

**Why Prettier is valuable:**

1. **No style debates** — Removes formatting discussions from code reviews
2. **Consistent code** — All code looks the same regardless of who wrote it
3. **Faster development** — Don't worry about formatting while coding
4. **Easier onboarding** — New team members don't need to learn formatting rules
5. **Clean diffs** — Formatting changes don't pollute git diffs

**Modern setup recommendation:**

Use ESLint for code quality rules and Prettier for formatting. Run Prettier on save (IDE) and ESLint in CI. This combination provides the best developer experience and code quality.
