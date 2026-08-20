CSS Modules are a build-time feature that scopes CSS class names locally by default, preventing naming conflicts between components. When you use CSS Modules, each class name is automatically made unique by the build tool, so you can write simple class names without worrying about global scope pollution.

**How CSS Modules work:**

```css
/* Button.module.css */
.button {
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
}

.primary {
  background: #3498db;
  color: white;
}

.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

```jsx
// Button.jsx
import styles from './Button.module.css';

function Button({ variant, disabled, children }) {
  const className = `${styles.button} ${variant === 'primary' ? styles.primary : ''} ${disabled ? styles.disabled : ''}`;

  return (
    <button className={className} disabled={disabled}>
      {children}
    </button>
  );
}
```

**What happens at build time:**

The build tool transforms class names into unique identifiers:

```css
/* Original */
.button { padding: 8px 16px; }

/* Compiled (unique hash) */
.Button_button_a3xK2 { padding: 8px 16px; }
.Button_primary_b7jM9 { background: #3498db; }
```

```html
<!-- Rendered HTML -->
<button class="Button_button_a3xK2 Button_primary_b7jM9">Click</button>
```

**CSS Modules features:**

**1. Local scope by default:**
```css
/* Locally scoped */
.title { color: red; }

/* Global scope (when needed) */
:global(.global-title) { color: blue; }
:global {
  .some-global-class { }
}
```

**2. Composing classes:**
```css
.base {
  padding: 8px 16px;
  border-radius: 4px;
}

.primary {
  composes: base; /* Inherits styles from .base */
  background: #3498db;
  color: white;
}

/* Compose from other files */
.secondary {
  composes: base from './shared.module.css';
  background: #95a5a6;
}
```

**3. CSS variables integration:**
```css
.button {
  --button-bg: #3498db;
  background: var(--button-bg);
}
```

**CSS Modules in different frameworks:**

**Vite / Webpack:**
```javascript
// vite.config.js — CSS Modules work out of the box with .module.css
// webpack.config.js — css-loader handles CSS Modules
module: {
  rules: [{
    test: /\.module\.css$/,
    use: [
      'style-loader',
      { loader: 'css-loader', options: { modules: true } }
    ]
  }]
}
```

**Next.js:**
```jsx
// CSS Modules work automatically in Next.js
import styles from './Button.module.css';

export default function Button() {
  return <button className={styles.button}>Click</button>;
}
```

**CSS Modules vs other approaches:**

| Aspect | CSS Modules | BEM | CSS-in-JS | Tailwind |
|--------|-------------|-----|-----------|----------|
| Scoping | Build-time | Naming convention | Runtime | Utility classes |
| Global CSS | No | Yes | Limited | Yes |
| Performance | Static CSS | Static CSS | Runtime overhead | Static CSS |
| Learning curve | Low | Low | Medium | Low |
| Tooling required | Build tool | None | Runtime library | Build tool |
| Dynamic styles | Limited | N/A | Yes | Limited |

**Advantages of CSS Modules:**

1. **Zero naming conflicts** — Each class is unique by default
2. **Standard CSS** — Write normal CSS, no special syntax
3. **Static extraction** — CSS is extracted at build time, no runtime overhead
4. **Type safety** — With TypeScript, imports are typed
5. **Dead code elimination** — Unused styles can be detected and removed
6. **Works with preprocessors** — Sass, Less, PostCSS all work

**Disadvantages:**

1. **Build tool required** — Won't work without a build step
2. **Dynamic styles are limited** — Can't easily generate styles based on props
3. **Global styles need explicit declaration** — Adding global styles requires `:global`
4. **Debugging** — Generated class names can be confusing (though source maps help)

**Best practices:**

```css
/* Use descriptive local names */
.card { }        /* ✅ — simple, descriptive */
.a3xK2 { }       /* ❌ — not meaningful */

/* Keep files component-specific */
Button.module.css    /* For Button component */
Card.module.css      /* For Card component */

/* Use composition for shared styles */
.composes: base from './shared.module.css';
```

CSS Modules are an excellent choice for component-based applications. They provide the scoping benefits of CSS-in-JS with the performance and simplicity of static CSS files.
