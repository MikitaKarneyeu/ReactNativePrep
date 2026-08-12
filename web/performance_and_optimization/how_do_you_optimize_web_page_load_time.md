Optimizing web page load time involves reducing the amount of data transferred, minimizing the number of requests, prioritizing critical resources, and deferring non-essential work. Here are the key strategies organized by impact.

**1. Reduce file sizes:**
- Minify HTML, CSS, and JavaScript (remove whitespace, comments, unused code)
- Compress assets with gzip or Brotli (Brotli offers ~15-20% better compression)
- Optimize images: use modern formats (WebP, AVIF), compress, resize to display size
- Remove unused CSS (PurgeCSS, Chrome Coverage tool)
- Tree-shake JavaScript (remove unused exports)

```javascript
// Vite config — enables minification and compression
export default {
  build: {
    minify: 'terser',
    rollupOptions: {
      output: { manualChunks: { vendor: ['react', 'react-dom'] } }
    }
  }
};
```

**2. Minimize HTTP requests:**
- Bundle CSS and JavaScript files
- Use CSS sprites or inline SVGs for small icons
- Lazy load non-critical resources
- Use HTTP/2 (multiplexing reduces the cost of multiple requests)

**3. Prioritize critical resources:**

```html
<!-- Inline critical CSS -->
<style>/* Above-the-fold CSS */</style>

<!-- Preload critical assets -->
<link rel="preload" href="/fonts/main.woff2" as="font" crossorigin>
<link rel="preload" href="/hero.jpg" as="image">

<!-- Preconnect to third-party domains -->
<link rel="preconnect" href="https://fonts.googleapis.com">

<!-- DNS prefetch for less critical domains -->
<link rel="dns-prefetch" href="https://analytics.example.com">

<!-- Script loading strategies -->
<script defer src="app.js"></script>      <!-- Parse in parallel, execute after HTML -->
<script async src="analytics.js"></script> <!-- Parse and execute ASAP -->
```

**4. Implement caching:**

```javascript
// Server-side cache headers
res.setHeader('Cache-Control', 'public, max-age=31536000, immutable'); // 1 year for hashed assets
res.setHeader('Cache-Control', 'public, max-age=3600'); // 1 hour for HTML
res.setHeader('ETag', '"abc123"');

// Service Worker caching
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
```

**5. Optimize images:**
- Use responsive images (`srcset` and `sizes`)
- Serve modern formats (WebP, AVIF) with fallbacks
- Lazy load below-the-fold images
- Set explicit dimensions to prevent layout shift
- Use CDN for image delivery

**6. Optimize fonts:**

```html
<!-- Preload critical fonts -->
<link rel="preload" href="/fonts/main.woff2" as="font" type="font/woff2" crossorigin>

<!-- Use font-display for better loading behavior -->
<style>
@font-face {
  font-family: 'Main';
  src: url('/fonts/main.woff2') format('woff2');
  font-display: swap; /* Show fallback font immediately */
}
</style>
```

**7. Use a CDN:**
- Serve static assets from geographically distributed servers
- Reduces latency by serving from the nearest edge server
- Offloads traffic from your origin server

**8. Optimize rendering:**
- Minimize DOM size
- Avoid layout thrashing (batch DOM reads and writes)
- Use `will-change` and `transform` for animations (composited, not layout-triggering)
- Defer non-critical JavaScript

**9. Server-side optimizations:**
- Enable HTTP/2 or HTTP/3
- Use server-side rendering (SSR) for faster First Contentful Paint
- Implement streaming HTML for progressive rendering
- Use edge computing (Cloudflare Workers, Vercel Edge Functions)

**10. Monitoring:**
- Use Lighthouse for performance audits
- Monitor Core Web Vitals (LCP, FID/INP, CLS)
- Use Real User Monitoring (RUM) for field data
- Set performance budgets

```javascript
// Performance budget example (in webpack config)
performance: {
  maxAssetSize: 250000,     // 250KB per asset
  maxEntrypointSize: 400000, // 400KB for entry point
  hints: 'error'
}
```

The most impactful optimizations are typically: image optimization, code splitting, lazy loading, and proper caching. Start with these before diving into more advanced techniques.
