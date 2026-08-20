The Critical Rendering Path (CRP) is the sequence of steps the browser performs to convert HTML, CSS, and JavaScript into pixels on the screen. Understanding this process is essential for optimizing page load performance.

**The steps:**

**1. HTML Parsing → DOM Tree**
The browser parses the HTML document and builds the Document Object Model (DOM) tree — a tree representation of the HTML structure.

**2. CSS Parsing → CSSOM Tree**
As CSS is encountered (external stylesheets, inline styles), the browser parses it and builds the CSS Object Model (CSSOM) tree — a tree of all CSS rules that apply to each element.

**3. DOM + CSSOM → Render Tree**
The browser combines the DOM and CSSOM into a render tree. This includes only the visible elements — elements with `display: none` are excluded, but `visibility: hidden` elements are included (they take up space).

**4. Layout (Reflow)**
The browser calculates the exact position and size of each element in the render tree based on the viewport dimensions. This is where geometry calculations happen — box model, flexbox, grid positions.

**5. Paint**
The browser fills in pixels — drawing text, colors, images, borders, shadows, and other visual properties to layers.

**6. Composite**
The browser combines the painted layers in the correct order (respecting z-index, opacity, transforms) to produce the final image on screen.

```
HTML → DOM ─────┐
                 ├→ Render Tree → Layout → Paint → Composite
CSS  → CSSOM ──┘
```

**Render-blocking resources:**

- **CSS** — External stylesheets are render-blocking. The browser won't paint until all CSS is downloaded and parsed, because it needs the CSSOM to build the render tree.
- **JavaScript** — Scripts are parser-blocking by default. The browser pauses HTML parsing when it encounters a `<script>` tag, because JavaScript might modify the DOM.

```html
<!-- Render-blocking CSS -->
<link rel="stylesheet" href="styles.css">

<!-- Parser-blocking JavaScript -->
<script src="app.js"></script>

<!-- Non-blocking alternatives -->
<link rel="stylesheet" href="critical.css">                    <!-- Critical CSS inline -->
<link rel="stylesheet" href="non-critical.css" media="print" onload="this.media='all'">
<script defer src="app.js"></script>                           <!-- Deferred -->
<script async src="analytics.js"></script>                     <!-- Async -->
```

**Optimizing the Critical Rendering Path:**

**1. Minimize critical resources:**
```html
<!-- Inline critical CSS -->
<style>
  /* Only the CSS needed for above-the-fold content */
  body { margin: 0; font-family: system-ui; }
  .hero { height: 100vh; display: flex; align-items: center; }
</style>

<!-- Defer non-critical CSS -->
<link rel="preload" href="full.css" as="style" onload="this.rel='stylesheet'">
```

**2. Minimize critical bytes:**
- Minify HTML, CSS, and JavaScript
- Compress with gzip or Brotli
- Remove unused CSS and JavaScript

**3. Reduce the number of critical round trips:**
- Inline critical CSS in the HTML
- Use `defer` or `async` for non-critical scripts
- Preconnect to required origins
- Use HTTP/2 multiplexing

```html
<!-- Preconnect to third-party origins -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://cdn.example.com">

<!-- Preload critical resources -->
<link rel="preload" href="/fonts/main.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/css/critical.css" as="style">
```

**Measuring the CRP:**

- Chrome DevTools → Performance tab → look for the "Network" and "Main" threads
- Lighthouse audits provide CRP analysis
- WebPageTest.org shows detailed waterfall charts

**Key metrics affected:**

- **First Contentful Paint (FCP)** — When the first content appears (affected by CSS and font loading)
- **Largest Contentful Paint (LCP)** — When the largest content element renders
- **Time to Interactive (TTI)** — When the page is fully interactive

Understanding the CRP helps you make informed decisions about resource loading order, inlining strategies, and script loading behavior.
