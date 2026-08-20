Utility-first CSS frameworks provide a large set of small, single-purpose utility classes that you compose directly in your HTML to build custom designs. Tailwind CSS is the most popular example. Instead of writing custom CSS, you apply pre-existing classes that each do one thing.

**How Tailwind CSS works:**

```html
<!-- Traditional CSS approach -->
<div class="card">
  <h2 class="card-title">Hello</h2>
  <p class="card-body">Content here</p>
</div>

<!-- Tailwind utility-first approach -->
<div class="bg-white rounded-lg shadow-md p-6 max-w-sm">
  <h2 class="text-xl font-bold text-gray-900 mb-2">Hello</h2>
  <p class="text-gray-600 leading-relaxed">Content here</p>
</div>
```

**Common Tailwind utilities:**

```html
<!-- Layout -->
<div class="flex items-center justify-between gap-4">
<div class="grid grid-cols-3 gap-6">
<div class="container mx-auto px-4">

<!-- Spacing -->
<div class="p-4 m-2 px-6 py-3 mt-8">

<!-- Typography -->
<p class="text-lg font-bold text-gray-900 leading-tight">

<!-- Colors -->
<div class="bg-blue-500 text-white border-gray-200">

<!-- Borders -->
<div class="border border-gray-300 rounded-lg shadow-sm">

<!-- Responsive -->
<div class="hidden md:block lg:flex">
<div class="text-sm md:text-base lg:text-lg">

<!-- Hover/Focus -->
<button class="bg-blue-500 hover:bg-blue-600 focus:ring-2">

<!-- Dark mode -->
<div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
```

**Configuration (tailwind.config.js):**

```javascript
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx,html}'],
  theme: {
    extend: {
      colors: {
        primary: '#3498db',
        secondary: '#2ecc71',
      },
      spacing: {
        '128': '32rem',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography')
  ]
}
```

**Handling repeated patterns with @apply:**

```css
/* For frequently reused combinations */
@layer components {
  .btn-primary {
    @apply px-4 py-2 bg-blue-500 text-white rounded-md
           hover:bg-blue-600 focus:ring-2 focus:ring-blue-500
           transition-colors duration-200;
  }

  .card {
    @apply bg-white rounded-lg shadow-md p-6;
  }
}
```

**Component extraction (React):**

```jsx
// Instead of @apply, extract to components
function Button({ variant = 'primary', children, ...props }) {
  const base = 'px-4 py-2 rounded-md font-medium transition-colors';
  const variants = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    danger: 'bg-red-500 text-white hover:bg-red-600'
  };

  return (
    <button className={`${base} ${variants[variant]}`} {...props}>
      {children}
    </button>
  );
}
```

**Tailwind vs other approaches:**

| Aspect | Tailwind | BEM | CSS Modules | CSS-in-JS |
|--------|----------|-----|-------------|-----------|
| Approach | Utility classes | Naming convention | Scoped files | Runtime styles |
| Custom CSS | Minimal | All custom | All custom | Generated |
| File size | Purged (small) | Varies | Small | Varies |
| Learning curve | Medium | Low | Low | Medium |
| Responsiveness | Built-in | Manual | Manual | Manual |
| Dark mode | Built-in | Manual | Manual | Manual |
| Consistency | Enforced by design tokens | Depends on discipline | Depends on discipline | Depends on discipline |

**Advantages of utility-first:**

1. **Rapid development** — Style directly in HTML without switching files
2. **No naming debates** — No need to think of class names
3. **Consistent design** — Design tokens enforce consistency
4. **Small production CSS** — PurgeCSS removes unused utilities
5. **Responsive and state variants** — Built-in responsive, hover, focus, dark mode
6. **No specificity issues** — Flat utility classes, no nesting

**Disadvantages:**

1. **Verbose HTML** — Long class strings can be hard to read
2. **Learning curve** — Need to learn the utility class names
3. **HTML bloat** — Class attributes can get very long
4. **Harder to maintain global styles** — Utility-first works best with component extraction
5. **Requires tooling** — PurgeCSS is essential for production

**Modern utility-first alternatives:**

- **UnoCSS** — Instant on-demand utility engine
- **Windi CSS** — Tailwind alternative with on-demand scanning
- **Open Props** — CSS custom properties (not utility-first, but complementary)

Utility-first CSS with Tailwind has become the most popular approach for styling modern web applications, particularly in the React ecosystem. The combination of Tailwind for styling and React for components provides a highly productive development experience.
