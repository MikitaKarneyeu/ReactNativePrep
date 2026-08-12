PostCSS is a tool for transforming CSS with JavaScript plugins. It parses CSS into an AST (Abstract Syntax Tree), allows plugins to modify that tree, and then generates the final CSS. It serves as a platform for CSS processing, similar to how Babel works for JavaScript.

**What PostCSS does:**

PostCSS itself is just a parser and generator. Its power comes from plugins that transform CSS in various ways:

**1. Autoprefixer** (most common use case):
```css
/* Input */
.container {
  display: flex;
  user-select: none;
}

/* Output (with Autoprefixer) */
.container {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
```

Autoprefixer automatically adds vendor prefixes based on your browser targets (from browserslist).

**2. cssnano** (CSS minification):
```css
/* Input */
.container {
  color: #ff0000;
  margin: 10px 10px 10px 10px;
  background-color: rgb(255, 0, 0);
}

/* Output */
.container{color:red;margin:10px;background-color:red}
```

**3. PostCSS Preset Env** (modern CSS features):
```css
/* Input — uses modern CSS features */
:root {
  --main-color: #06c;
}

.container {
  color: var(--main-color);
  font-size: clamp(1rem, 2.5vw, 2rem);
  gap: 1rem;
}

/* Output — polyfills for older browsers */
.container {
  color: #06c;
  font-size: 2rem;
  font-size: clamp(1rem, 2.5vw, 2rem);
}
```

**4. postcss-import** (inlines @import rules):
```css
/* Input */
@import './variables.css';
@import './components/button.css';

/* Output — all files combined */
:root { --primary: #3498db; }
.button { background: var(--primary); }
```

**5. postcss-nesting** (CSS nesting support):
```css
/* Input */
.card {
  background: white;

  & .title {
    font-size: 1.5rem;
  }

  &:hover {
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
}

/* Output */
.card { background: white; }
.card .title { font-size: 1.5rem; }
.card:hover { box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
```

**PostCSS configuration:**

```javascript
// postcss.config.js
module.exports = {
  plugins: [
    require('postcss-import'),
    require('postcss-nesting'),
    require('autoprefixer'),
    require('cssnano')({ preset: 'default' })
  ]
};

// Or with Vite (built-in PostCSS support)
// vite.config.js
export default defineConfig({
  css: {
    postcss: {
      plugins: [
        require('autoprefixer'),
        require('cssnano')
      ]
    }
  }
});
```

**PostCSS vs preprocessors (Sass/Less):**

| Aspect | PostCSS | Sass/Less |
|--------|---------|-----------|
| Approach | Plugin-based transformations | Full language with features |
| Syntax | Standard CSS (or extended via plugins) | Own syntax (.scss, .less) |
| Variables | CSS custom properties | Own variable system |
| Nesting | Via plugin (postcss-nesting) | Built-in |
| Mixins | Via plugin (postcss-mixins) | Built-in |
| Extensibility | Unlimited via plugins | Limited to built-in features |
| Modern CSS | Polyfills new features | Doesn't help with new features |

**PostCSS vs preprocessors:**

PostCSS is not a replacement for preprocessors, but it can do everything they do and more:

```css
/* PostCSS with postcss-nesting, postcss-custom-properties, postcss-mixins */
:root {
  --primary: #3498db;
}

.button {
  background: var(--primary);

  &--large {
    padding: 1rem 2rem;
  }

  &:hover {
    opacity: 0.9;
  }
}
```

**Popular PostCSS plugins:**

- **autoprefixer** — Adds vendor prefixes
- **cssnano** — Minifies CSS
- **postcss-import** — Inlines @import
- **postcss-nesting** — CSS nesting
- **postcss-preset-env** — Modern CSS features
- **postcss-custom-properties** — CSS variables support
- **postcss-mixins** — Sass-like mixins
- **postcss-sort-media-queries** — Sorts media queries
- **postcss-pxtorem** — Converts px to rem
- **postcss-color-function** — Color functions

**How PostCSS fits in the build pipeline:**

```
Sass/Less → Preprocessor Compiler → PostCSS (with plugins) → Output CSS
                    OR
CSS → PostCSS (with plugins) → Output CSS
```

Most modern build tools (Vite, Webpack with postcss-loader, Next.js) automatically run PostCSS when configured. Tailwind CSS is built on top of PostCSS — the `tailwindcss` package is a PostCSS plugin.
