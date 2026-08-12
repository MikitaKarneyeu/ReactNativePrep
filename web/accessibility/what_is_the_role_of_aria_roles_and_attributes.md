ARIA (Accessible Rich Internet Applications) roles and attributes provide additional semantics to HTML elements when native HTML is insufficient to convey the purpose, state, or behavior of a component to assistive technologies. They bridge the gap between complex custom UI components and what screen readers can understand.

**ARIA Roles** define what an element is or does:

```html
<!-- Landmark roles -->
<header role="banner">Site header</header>
<nav role="navigation" aria-label="Main">Main navigation</nav>
<main role="main">Primary content</main>
<aside role="complementary">Sidebar</aside>
<footer role="contentinfo">Site footer</footer>
<form role="search">Search form</form>

<!-- Widget roles -->
<div role="button" tabindex="0">Click me</div>
<div role="tablist">
  <button role="tab" aria-selected="true" aria-controls="panel-1">Tab 1</button>
  <button role="tab" aria-selected="false" aria-controls="panel-2">Tab 2</button>
</div>
<div role="tabpanel" id="panel-1">Content 1</div>

<div role="dialog" aria-modal="true" aria-labelledby="dialog-title">
  <h2 id="dialog-title">Confirm</h2>
</div>

<div role="alert">Error: Invalid email</div>
<div role="status">3 items in cart</div>
<ul role="listbox">
  <li role="option" aria-selected="true">Option 1</li>
  <li role="option">Option 2</li>
</ul>
```

**ARIA States** describe the current condition:

```html
<!-- Expanded/collapsed -->
<button aria-expanded="false" aria-controls="menu">Menu</button>
<ul id="menu" hidden>...</ul>

<!-- Selected -->
<div role="tab" aria-selected="true">Active Tab</div>

<!-- Checked -->
<div role="checkbox" aria-checked="true" tabindex="0">Enable notifications</div>

<!-- Invalid -->
<input aria-invalid="true" aria-describedby="error-msg">
<span id="error-msg" role="alert">Invalid email format</span>

<!-- Disabled -->
<button aria-disabled="true">Submit</button>

<!-- Busy/loading -->
<div aria-busy="true" aria-live="polite">Loading...</div>

<!-- Hidden -->
<div aria-hidden="true">Decorative content (hidden from screen readers)</div>
```

**ARIA Properties** provide additional information:

```html
<!-- Labels -->
<button aria-label="Close dialog">×</button>
<nav aria-label="Main navigation">...</nav>
<nav aria-label="Footer navigation">...</nav>

<!-- Descriptions -->
<input aria-describedby="password-hint">
<span id="password-hint">Must be at least 8 characters</span>

<!-- Relationships -->
<button aria-controls="dropdown-menu">Options</button>
<ul id="dropdown-menu">...</ul>

<div role="tab" aria-controls="panel-1" aria-labelledby="tab-1-label">
  <span id="tab-1-label">Overview</span>
</div>

<!-- Owns (alternative to DOM nesting) -->
<div role="list" aria-owns="item-1 item-2 item-3"></div>
<div role="listitem" id="item-1">...</div>

<!-- Live regions -->
<div aria-live="polite">Updates announced when user is idle</div>
<div aria-live="assertive">Updates announced immediately</div>

<!-- Modal -->
<div role="dialog" aria-modal="true">Content behind is inert</div>

<!-- Required -->
<input aria-required="true">

<!-- Current -->
<a aria-current="page" href="/about">About</a>
```

**The five rules of ARIA use:**

1. **Don't use ARIA if native HTML works** — `<button>` is better than `<div role="button">`
2. **Don't change native semantics** — Don't put `role="button"` on a `<a>` tag
3. **All interactive ARIA controls must be keyboard accessible** — `role="button"` needs Enter/Space handlers
4. **Don't hide focusable elements** — Don't put `aria-hidden="true"` on interactive elements
5. **All interactive elements need accessible names** — Use `aria-label` or `aria-labelledby`

**Common ARIA patterns:**

```html
<!-- Tab panel -->
<div role="tablist" aria-label="Account settings">
  <button role="tab" aria-selected="true" aria-controls="panel-profile" id="tab-profile">
    Profile
  </button>
  <button role="tab" aria-selected="false" aria-controls="panel-security" id="tab-security">
    Security
  </button>
</div>
<div role="tabpanel" id="panel-profile" aria-labelledby="tab-profile">
  Profile content
</div>
<div role="tabpanel" id="panel-security" aria-labelledby="tab-security" hidden>
  Security content
</div>

<!-- Accordion -->
<h3>
  <button aria-expanded="false" aria-controls="section-1">
    Section 1
  </button>
</h3>
<div id="section-1" hidden>
  Content
</div>

<!-- Combobox/autocomplete -->
<input role="combobox" aria-expanded="false" aria-autocomplete="list"
       aria-controls="suggestions" aria-activedescendant="option-2">
<ul id="suggestions" role="listbox">
  <li role="option" id="option-1">Suggestion 1</li>
  <li role="option" id="option-2" aria-selected="true">Suggestion 2</li>
</ul>
```

**When to use ARIA:**

- Custom components without native HTML equivalents (tabs, accordions, carousels, trees)
- Adding labels to multiple landmarks of the same type
- Announcing dynamic content changes
- Describing relationships between elements
- Providing additional context for screen readers

ARIA doesn't change behavior — it only changes what assistive technologies report. You still need JavaScript for interactivity and CSS for visual styling.
