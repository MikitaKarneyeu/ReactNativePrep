ESLint is a static analysis tool for identifying and fixing problems in JavaScript and TypeScript code. It enforces coding standards, catches potential errors before runtime, and helps maintain consistent code style across a project.

**How ESLint works:**

ESLint parses your code into an AST (Abstract Syntax Tree) and applies rules to each node. Rules can report errors, warnings, or suggest automatic fixes.

**Basic configuration:**

```javascript
// eslint.config.js (flat config — ESLint v9+)
import js from '@eslint/js';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import tsPlugin from '@typescript-eslint/eslint-plugin';

export default [
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      '@typescript-eslint': tsPlugin
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'warn',
      'react/react-in-jsx-scope': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn'
    }
  }
];
```

**Legacy configuration (.eslintrc.js):**

```javascript
module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: { jsx: true }
  },
  plugins: ['react', 'react-hooks', '@typescript-eslint'],
  rules: {
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'react/prop-types': 'off',
    'eqeqeq': ['error', 'always']
  },
  settings: {
    react: { version: 'detect' }
  }
};
```

**Rule severity levels:**

```javascript
rules: {
  'no-unused-vars': 'off',     // 0 — disabled
  'no-console': 'warn',        // 1 — warning (yellow)
  'no-debugger': 'error',      // 2 — error (red, fails CI)
  'eqeqeq': ['error', 'always'] // Rule with options
}
```

**Useful ESLint rules:**

```javascript
// Error prevention
'no-undef': 'error',
'no-constant-condition': 'error',
'no-dupe-keys': 'error',
'no-duplicate-case': 'error',
'no-unreachable': 'error',

// Best practices
'eqeqeq': ['error', 'always'],
'no-eval': 'error',
'no-implied-eval': 'error',
'no-return-await': 'error',
'prefer-const': 'error',
'no-var': 'error',

// React
'react/jsx-key': 'error',
'react/no-array-index-key': 'warn',
'react/self-closing-comp': 'warn',
'react-hooks/rules-of-hooks': 'error',
'react-hooks/exhaustive-deps': 'warn',

// TypeScript
'@typescript-eslint/no-explicit-any': 'warn',
'@typescript-eslint/consistent-type-imports': 'error'
```

**Extending popular configurations:**

```javascript
// Install
// npm install -D eslint-config-airbnb eslint-plugin-import

// Or use simpler alternatives
// npm install -D eslint-config-standard

module.exports = {
  extends: [
    'airbnb',        // or 'standard'
    'plugin:react/recommended',
    'prettier'       // Must be last — disables rules that conflict with Prettier
  ]
};
```

**ESLint ignore:**

```javascript
// .eslintignore
node_modules/
dist/
build/
*.config.js
coverage/
```

**Running ESLint:**

```bash
# Check files
npx eslint src/

# Fix auto-fixable issues
npx eslint src/ --fix

# Check specific file
npx eslint src/App.tsx

# With package.json scripts
{
  "scripts": {
    "lint": "eslint src/",
    "lint:fix": "eslint src/ --fix"
  }
}
```

**IDE integration:**

ESLint integrates with VS Code, WebStorm, and other editors to show errors and warnings in real-time:

```json
// VS Code settings.json
{
  "eslint.validate": ["javascript", "typescript", "javascriptreact", "typescriptreact"],
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

**ESLint with TypeScript:**

```javascript
// eslint.config.js
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json'
      }
    },
    plugins: {
      '@typescript-eslint': tsPlugin
    },
    rules: {
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/await-thenable': 'error'
    }
  }
];
```

ESLint is essential for maintaining code quality in any JavaScript project. It catches bugs early, enforces consistency, and helps teams follow best practices.
