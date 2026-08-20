CSS preprocessors and postprocessors are both tools that transform CSS, but they operate at different stages of the development workflow. Preprocessors extend CSS syntax before compilation, while postprocessors transform standard CSS after it's written.

**Preprocessors (Sass, Less, Stylus):**

Preprocessors add features to CSS that don't exist in the standard. They have their own syntax and compile to standard CSS.

```scss
// Sass (preprocessor) — adds features not in CSS
$primary: #3498db;
$spacing: 16px;

@mixin flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

@function calculate-rem($size) {
  @return $size / 16px * 1rem;
}

.card {
  background: lighten($primary, 40%);
  padding: $spacing;

  &__title {
    font-size: calculate-rem(24px);
    color: $primary;
  }

  @include flex-center;

  @media (min-width: 768px) {
    padding: $spacing * 2;
  }
}
```

**What preprocessors add:**
- Variables (`$variable`)
- Nesting
- Mixins and functions
- Partials and imports
- Extends/inheritance
- Operators and math
- Conditionals and loops
- Color manipulation

**Postprocessors (PostCSS):**

Postprocessors transform standard CSS using plugins. They parse CSS into an AST, apply transformations, and output the result. PostCSS is the most common postprocessor.

```css
/* Input (standard CSS with modern features) */
:root {
  --primary: #3498db;
}

.card {
  background: var(--primary);
  display: flex;
  gap: 1rem;
  user-select: none;
}

/* PostCSS with plugins transforms this */

/* autoprefixer output */
.card {
  background: var(--primary);
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  gap: 1rem;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
```

**What postprocessors do:**
- Add vendor prefixes (Autoprefixer)
- Minify CSS (cssnano)
- Inline @import (postcss-import)
- Convert units (postcss-pxtrem)
- Future CSS features (postcss-preset-env)
- Sort media queries
- Lint CSS (Stylelint)
- Analyze unused CSS

**Key differences:**

| Aspect | Preprocessors | Postprocessors |
|--------|--------------|----------------|
| Input | Custom syntax (Sass, Less) | Standard CSS |
| Output | Standard CSS | Transformed CSS |
| When | Before writing CSS | After writing CSS |
| Features | New syntax (variables, nesting, mixins) | Transformations (prefixing, minifying) |
| Examples | Sass, Less, Stylus | PostCSS, autoprefixer, cssnano |
| Syntax | Own syntax | Standard CSS (or plugins add syntax) |

**How they work together:**

```
Sass (.scss) → Sass Compiler → PostCSS (with plugins) → Final CSS
```

```javascript
// Webpack pipeline
module.exports = {
  module: {
    rules: [{
      test: /\.scss$/,
      use: [
        'style-loader',
        'css-loader',
        'postcss-loader',  // PostCSS runs after Sass
        'sass-loader'      // Sass compiles first
      ]
    }]
  }
};
```

**Modern CSS has absorbed many preprocessor features:**

```css
/* CSS custom properties (variables) */
:root { --primary: #3498db; }
.button { background: var(--primary); }

/* CSS nesting (new) */
.card {
  background: white;

  & .title { font-size: 1.5rem; }
  &:hover { box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
}

/* CSS functions */
.element {
  color: color-mix(in srgb, var(--primary) 50%, white);
  font-size: clamp(1rem, 2vw, 1.5rem);
  width: calc(100% - 2rem);
}
```

**PostCSS as a preprocessor:**

PostCSS can also act as a preprocessor with the right plugins:

```javascript
// postcss.config.js
module.exports = {
  plugins: [
    require('postcss-import'),        // @import
    require('postcss-nesting'),       // Nesting
    require('postcss-mixins'),        // Mixins
    require('postcss-custom-properties'), // Variables
    require('postcss-preset-env'),    // Modern CSS features
    require('autoprefixer'),          // Vendor prefixes
    require('cssnano')                // Minification
  ]
};
```

**When to use preprocessors:**

- Existing Sass/Less codebases
- Teams comfortable with Sass syntax
- Complex projects needing functions, loops, and conditionals
- Design systems with shared variables and mixins

**When to use postprocessors (PostCSS):**

- Modern projects that want to write standard CSS
- When you need specific transformations (prefixing, minifying)
- When you want to use modern CSS features with backward compatibility
- When you want a plugin-based, customizable pipeline

**When to use both:**

- Large projects that use Sass for organization and PostCSS for transformations
- When migrating from Sass to standard CSS (gradual migration)
- When you need Sass features AND PostCSS plugins

**Modern recommendation:**

For new projects, PostCSS with plugins (postcss-preset-env) can replace most preprocessor functionality while keeping your CSS standards-based. CSS custom properties handle variables, native CSS nesting handles nesting, and PostCSS plugins handle everything else.
