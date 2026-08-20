Skip links are hidden navigation links that become visible when focused via keyboard (Tab key). They allow keyboard and screen reader users to bypass repetitive content — like navigation menus, headers, and sidebars — and jump directly to the main content of the page.

**Why skip links are needed:**

On most websites, the navigation menu appears at the top of every page. A keyboard user must tab through every navigation link before reaching the main content. On a site with 20+ navigation items, this is extremely tedious. Skip links solve this by providing a shortcut.

**Basic implementation:**

```html
<body>
  <a href="#main-content" class="skip-link">
    Skip to main content
  </a>

  <header>
    <nav>
      <!-- 20+ navigation links -->
    </nav>
  </header>

  <main id="main-content" tabindex="-1">
    <h1>Page Title</h1>
    <!-- Page content -->
  </main>
</body>
```

```css
.skip-link {
  position: absolute;
  top: -100%;
  left: 0;
  padding: 12px 24px;
  background: #1a1a1a;
  color: #ffffff;
  font-weight: bold;
  text-decoration: none;
  z-index: 1000;
  border-radius: 0 0 4px 0;
}

.skip-link:focus {
  top: 0;
  outline: 3px solid #4A90D9;
  outline-offset: 2px;
}
```

**How it works:**

1. The skip link is visually hidden (positioned off-screen)
2. When the user presses Tab on page load, the skip link receives focus
3. The link becomes visible (via `:focus` styles)
4. Pressing Enter moves focus to the main content area
5. The main content has `tabindex="-1"` to receive programmatic focus

**Multiple skip links:**

```html
<a href="#main-content" class="skip-link">Skip to main content</a>
<a href="#search" class="skip-link">Skip to search</a>
<a href="#sidebar" class="skip-link">Skip to sidebar</a>

<header>
  <nav aria-label="Main">...</nav>
</header>

<main id="main-content" tabindex="-1">...</main>

<aside id="sidebar" tabindex="-1">...</aside>
```

**Skip links in React (SPA):**

```jsx
function SkipLinks() {
  const handleSkip = (e, targetId) => {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (target) {
      target.focus();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="skip-links" aria-label="Skip links">
      <a href="#main-content" onClick={(e) => handleSkip(e, 'main-content')}>
        Skip to main content
      </a>
      <a href="#search" onClick={(e) => handleSkip(e, 'search')}>
        Skip to search
      </a>
    </nav>
  );
}

function App() {
  return (
    <>
      <SkipLinks />
      <Header />
      <main id="main-content" tabIndex={-1}>
        <Routes>...</Routes>
      </main>
    </>
  );
}
```

**Variations:**

```css
/* Always visible (some sites show skip links permanently) */
.skip-link.visible {
  position: static;
}

/* Animated appearance */
.skip-link {
  transform: translateY(-100%);
  transition: transform 0.2s ease;
}
.skip-link:focus {
  transform: translateY(0);
}

/* Using sr-only pattern (screen reader only, visible on focus) */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.sr-only:focus {
  position: static;
  width: auto;
  height: auto;
  padding: 12px 24px;
  margin: 0;
  overflow: visible;
  clip: auto;
  white-space: normal;
}
```

**When to use skip links:**

1. **Pages with repetitive navigation** — Any page with more than a few navigation links
2. **Complex layouts** — Pages with sidebars, headers, and multiple sections
3. **Single-page applications** — SPA navigation doesn't reset focus like traditional page loads
4. **WCAG compliance** — Skip links are required for WCAG 2.4.1 (Bypass Blocks, Level A)

**Testing skip links:**

1. Load the page and press Tab — the skip link should appear
2. Press Enter — focus should move to the main content
3. Verify focus is visible on the target element
4. Verify screen readers announce the skip link

Skip links are a simple, high-impact accessibility feature that should be included on every website with significant navigation content.
