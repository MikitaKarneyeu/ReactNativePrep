Structuring a page for accessibility involves using semantic HTML, proper heading hierarchy, ARIA landmarks, and ensuring all content is perceivable and navigable by assistive technologies.

**Use semantic HTML elements** as the foundation. Replace generic `<div>` elements with meaningful tags that convey structure:

```html
<body>
  <header>
    <nav aria-label="Main navigation">
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/about">About</a></li>
      </ul>
    </nav>
  </header>
  <main>
    <article>
      <h1>Page Title</h1>
      <section>
        <h2>Section Heading</h2>
        <p>Content here...</p>
      </section>
    </article>
    <aside aria-label="Related links">
      <h2>Sidebar</h2>
    </aside>
  </main>
  <footer>
    <p>Footer content</p>
  </footer>
</body>
```

**Maintain a logical heading hierarchy**. Use exactly one `<h1>` per page, followed by `<h2>`, `<h3>`, etc. in order. Never skip heading levels for visual styling — use CSS instead. Screen reader users often navigate by headings, so this hierarchy acts as a table of contents.

**Ensure keyboard accessibility**. All interactive elements (links, buttons, form fields) must be reachable and operable via keyboard. Use native HTML elements rather than building custom ones when possible, as they come with built-in keyboard support. For custom components, manage `tabindex` and keyboard event handlers.

**Provide sufficient color contrast**. Text must have a contrast ratio of at least 4.5:1 against its background (3:1 for large text). Don't convey information through color alone — use text labels, patterns, or icons in addition.

**Add labels to form elements**. Every input should have an associated `<label>` element or `aria-label`/`aria-labelledby` attribute:

```html
<label for="email">Email address</label>
<input type="email" id="email" name="email" required aria-describedby="email-hint">
<span id="email-hint">We'll never share your email.</span>
```

**Handle focus management** in single-page applications. When content changes dynamically, move focus to the new content or announce changes using `aria-live` regions. Ensure focus is visible and never traps keyboard users without a way to escape.
