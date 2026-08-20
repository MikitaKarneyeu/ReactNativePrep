Screen readers are assistive technology software that reads the content of a web page aloud or outputs it to a Braille display. They are used by people who are blind, have low vision, or have cognitive disabilities that make reading difficult. Screen readers interpret the DOM and announce content in a linearized, sequential manner.

**Common screen readers:**

| Screen Reader | Platform | Cost |
|--------------|----------|------|
| VoiceOver | macOS, iOS | Free (built-in) |
| NVDA | Windows | Free (open source) |
| JAWS | Windows | Paid |
| TalkBack | Android | Free (built-in) |
| Narrator | Windows | Free (built-in) |

**How screen readers interpret web pages:**

Screen readers read the DOM linearly — top to bottom, following the HTML structure. They announce:

1. **Element roles** — "button", "link", "heading level 2", "list with 5 items"
2. **Accessible names** — Text content, `aria-label`, `aria-labelledby`, `alt` text
3. **States** — "expanded", "selected", "checked", "disabled"
4. **Relationships** — "list item 3 of 5", "tab 2 of 4"

```html
<!-- What the screen reader announces -->
<button>Submit</button>
<!-- "Submit, button" -->

<a href="/about">About Us</a>
<!-- "About Us, link" -->

<h2>Products</h2>
<!-- "Products, heading level 2" -->

<img src="chart.png" alt="Revenue grew 50% year over year">
<!-- "Revenue grew 50% year over year, image" -->

<input type="email" aria-required="true" aria-describedby="email-hint">
<span id="email-hint">We'll never share your email</span>
<!-- "Email, required, edit text. We'll never share your email" -->

<div role="alert">Form submitted successfully</div>
<!-- "Alert: Form submitted successfully" (interrupts reading) -->
```

**How screen readers navigate:**

Screen reader users navigate differently than sighted users:

1. **Headings** — Jump between headings (h1, h2, h3) to understand page structure
2. **Landmarks** — Jump to landmarks (nav, main, aside, footer)
3. **Links** — List all links and jump to one
4. **Forms** — Navigate between form fields
5. **Tables** — Navigate table cells and hear headers
6. **Landmarks and regions** — Skip to main content, navigation, etc.

```html
<!-- Landmarks screen readers can jump to -->
<header role="banner">...</header>
<nav role="navigation" aria-label="Main">...</nav>
<main role="main">...</main>
<aside role="complementary">...</aside>
<footer role="contentinfo"></footer>
<form role="search">...</form>
```

**Best practices for screen reader compatibility:**

1. **Use semantic HTML** — Native elements have built-in screen reader support:
```html
<!-- ✅ Screen readers know this is a button -->
<button>Submit</button>

<!-- ❌ Screen readers don't know this is interactive -->
<div onclick="submit()">Submit</div>
```

2. **Provide text alternatives:**
```html
<!-- Images -->
<img src="photo.jpg" alt="Alice presenting at the conference">

<!-- Icon buttons -->
<button aria-label="Close dialog">
  <svg><!-- X icon --></svg>
</button>

<!-- Complex images -->
<figure>
  <img src="chart.png" alt="Bar chart showing revenue by quarter" aria-describedby="chart-desc">
  <figcaption id="chart-desc">
    Q1: $1M, Q2: $1.5M, Q3: $2M, Q4: $2.5M
  </figcaption>
</figure>
```

3. **Announce dynamic content:**
```html
<!-- Live regions for dynamic updates -->
<div aria-live="polite">3 items in your cart</div>
<div role="status">Form saved</div>
<div role="alert">Error: Email is required</div>

<!-- aria-live values:
  "polite" — Waits for user to finish current task
  "assertive" — Interrupts immediately (use sparingly)
-->
```

4. **Provide page structure:**
```html
<h1>Page Title</h1>
  <h2>Section 1</h2>
    <h3>Subsection</h3>
  <h2>Section 2</h2>
```

5. **Label form inputs:**
```html
<label for="name">Full Name</label>
<input id="name" type="text" aria-required="true">

<!-- Or with aria-label -->
<input aria-label="Search" type="search">
```

**Testing with screen readers:**

1. **VoiceOver (Mac)** — Cmd+F5 to toggle, use VO keys (Ctrl+Option) for navigation
2. **NVDA (Windows)** — Free, open source, widely used for testing
3. **Test checklist:**
   - Can you navigate by headings?
   - Are all images described?
   - Are form inputs labeled?
   - Do dynamic updates get announced?
   - Is the tab order logical?
   - Are interactive elements clearly identified?

Screen reader testing should be part of your development workflow, not just an afterthought. Even basic testing with VoiceOver (built into Mac) can catch major accessibility issues.
