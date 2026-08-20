ARIA (Accessible Rich Internet Applications) attributes are a set of HTML attributes prefixed with `aria-` that provide additional accessibility information to assistive technologies when native HTML semantics are insufficient. They help bridge the gap between complex UI components and what screen readers can understand.

ARIA attributes fall into several categories:

**Roles** define what an element is or does:
```html
<div role="alert">Your session will expire in 5 minutes.</div>
<div role="tablist">
  <button role="tab" aria-selected="true">Tab 1</button>
  <button role="tab" aria-selected="false">Tab 2</button>
</div>
<div role="tabpanel">Content for Tab 1</div>
```

**States** describe the current condition of an element:
```html
<button aria-expanded="false">Menu</button>
<input aria-invalid="true" aria-describedby="error-msg">
<div aria-hidden="true">Decorative content</div>
```

**Properties** provide additional information about an element:
```html
<nav aria-label="Main navigation">
<nav aria-label="Footer navigation">
<input aria-required="true" aria-labelledby="name-label">
<div aria-live="polite">Dynamic content updates</div>
```

When to use ARIA:

1. **When native HTML lacks the needed semantics** — custom dropdowns, tabs, modals, carousels, and tree views don't have HTML equivalents, so ARIA roles and attributes are necessary.
2. **To label multiple landmarks of the same type** — use `aria-label` to distinguish between multiple `<nav>` elements.
3. **To announce dynamic content changes** — `aria-live` regions announce updates without requiring focus changes.
4. **To describe relationships** — `aria-labelledby`, `aria-describedby`, and `aria-controls` establish connections between elements that aren't obvious from the DOM structure.

The five rules of ARIA use (from the W3C):

1. Don't use ARIA if you can use native HTML instead.
2. Don't change native semantics unless absolutely necessary.
3. All interactive ARIA controls must be keyboard accessible.
4. Don't use `role="presentation"` or `aria-hidden="true"` on focusable elements.
5. All interactive elements must have an accessible name.

ARIA does not change behavior or appearance — it only affects what assistive technologies report. You still need CSS for visual styling and JavaScript for interactive behavior.
