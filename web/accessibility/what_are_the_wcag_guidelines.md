The Web Content Accessibility Guidelines (WCAG) are the international standard for web accessibility, published by the W3C's Web Accessibility Initiative (WAI). They provide a comprehensive set of guidelines for making web content accessible to people with disabilities.

**WCAG versions:**

- **WCAG 2.0** (2008) — The foundation
- **WCAG 2.1** (2018) — Added mobile accessibility, low vision, and cognitive guidelines
- **WCAG 2.2** (2023) — Added focus appearance, dragging movements, and consistent help

**Conformance levels:**

| Level | Description | Requirement |
|-------|-------------|-------------|
| A | Minimum accessibility | Must satisfy for basic accessibility |
| AA | Standard accessibility | Required by most laws and regulations |
| AAA | Maximum accessibility | Highest level, often not fully achievable |

Most organizations target **WCAG 2.1 Level AA** compliance.

**The four principles (POUR):**

**1. Perceivable:**
- **1.1 Text Alternatives** — Provide text alternatives for non-text content (alt text for images)
- **1.2 Time-based Media** — Provide alternatives (captions, transcripts, audio descriptions)
- **1.3 Adaptable** — Content can be presented in different ways without losing meaning
- **1.4 Distinguishable** — Content is easy to see and hear (contrast, resize, spacing)

```css
/* 1.4.3 Contrast (AA) — minimum 4.5:1 for normal text */
color: #595959; background: #ffffff; /* Contrast: 7.0:1 ✅ */
color: #aaaaaa; background: #ffffff; /* Contrast: 2.3:1 ❌ */

/* 1.4.4 Resize text — text can be resized to 200% */
html { font-size: 100%; } /* Respect user's browser settings */

/* 1.4.12 Text spacing — content works with increased spacing */
p {
  line-height: 1.5;
  letter-spacing: 0.12em;
  word-spacing: 0.16em;
}
```

**2. Operable:**
- **2.1 Keyboard Accessible** — All functionality available via keyboard
- **2.2 Enough Time** — Users have enough time to read and interact
- **2.3 Seizures and Physical Reactions** — No content flashes more than 3 times per second
- **2.4 Navigable** — Users can navigate and find content
- **2.5 Input Modalities** — Functions work beyond keyboard (touch, voice)

```html
<!-- 2.4.1 Bypass blocks — provide skip links -->
<a href="#main" class="skip-link">Skip to main content</a>

<!-- 2.4.7 Focus visible — focus indicator is visible -->
<style>
:focus-visible {
  outline: 3px solid #4A90D9;
  outline-offset: 2px;
}
</style>

<!-- 2.4.6 Headings and labels -->
<h1>Page Title</h1>
<h2>Section Title</h2>
<label for="search">Search</label>
```

**3. Understandable:**
- **3.1 Readable** — Language of the page is identified
- **3.2 Predictable** — Pages appear and operate predictably
- **3.3 Input Assistance** — Users avoid and correct mistakes

```html
<!-- 3.1.1 Language of page -->
<html lang="en">

<!-- 3.3.1 Error identification -->
<label for="email">Email</label>
<input id="email" type="email" aria-invalid="true" aria-describedby="email-error">
<span id="email-error" role="alert">Please enter a valid email address</span>
```

**4. Robust:**
- **4.1 Compatible** — Content works with current and future tools

```html
<!-- 4.1.2 Name, role, value — custom widgets have proper ARIA -->
<div role="button" tabindex="0" aria-pressed="false">Toggle</div>
```

**Testing WCAG compliance:**

1. **Automated tools** — Catch ~30-40% of issues:
   - axe DevTools, Lighthouse, WAVE, Pa11y

2. **Manual testing** — Catches remaining issues:
   - Keyboard navigation
   - Screen reader testing (VoiceOver, NVDA, JAWS)
   - Color contrast verification
   - Zoom to 200%
   - Reduced motion testing

3. **User testing** — Most valuable but least common
   - Test with actual users who have disabilities

**WCAG success criteria examples (AA):**

| Criteria | Level | Description |
|----------|-------|-------------|
| 1.1.1 | A | Non-text content has text alternatives |
| 1.3.1 | A | Info and relationships programmatically determined |
| 1.4.3 | AA | Contrast ratio at least 4.5:1 |
| 2.1.1 | A | All functionality keyboard accessible |
| 2.4.7 | AA | Focus visible |
| 3.3.2 | A | Labels or instructions for user input |

WCAG is a living document. Staying current with the latest version ensures your applications meet modern accessibility expectations.
