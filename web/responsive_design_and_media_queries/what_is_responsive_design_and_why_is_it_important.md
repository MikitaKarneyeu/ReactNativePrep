Responsive design is an approach to web development that ensures web pages render well across a wide range of devices and screen sizes, from desktop monitors to tablets to smartphones. Instead of building separate sites for each device, responsive design uses flexible layouts, fluid images, and media queries to adapt the presentation to the viewing environment.

**Why responsive design is important:**

1. **Mobile traffic dominates** — Over 50% of global web traffic comes from mobile devices. A site that doesn't work on mobile alienates a majority of potential users.

2. **User experience** — Users expect content to be readable and interactive regardless of device. Pinching, zooming, and horizontal scrolling on a non-responsive site leads to frustration and high bounce rates.

3. **SEO** — Google uses mobile-first indexing, meaning it primarily uses the mobile version of content for ranking. A non-responsive site will rank lower in search results.

4. **Cost efficiency** — Maintaining one responsive codebase is cheaper and more sustainable than maintaining separate desktop and mobile sites.

5. **Accessibility** — Responsive design often overlaps with accessibility best practices, such as sufficient text size and touch-friendly targets.

**Core techniques of responsive design:**

**Fluid layouts** use relative units instead of fixed pixels:
```css
.container {
  width: 90%;           /* Fluid width */
  max-width: 1200px;    /* Cap at maximum */
  margin: 0 auto;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}
```

**Media queries** apply styles based on viewport characteristics:
```css
@media (max-width: 768px) {
  .sidebar { display: none; }
  .main { width: 100%; }
}
```

**Responsive images** scale within their containers:
```css
img, video {
  max-width: 100%;
  height: auto;
}
```

**Responsive typography** uses relative units:
```css
html { font-size: 16px; }
h1 { font-size: clamp(1.5rem, 4vw, 3rem); }
```

**The viewport meta tag** is essential for mobile devices:
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

Without this tag, mobile browsers render pages at a virtual viewport width (typically 980px) and then scale them down, making text tiny and layouts broken.

Responsive design is now considered a baseline expectation rather than a feature. Modern CSS tools like flexbox, grid, `clamp()`, container queries, and the `aspect-ratio` property have made responsive design significantly easier to implement.
