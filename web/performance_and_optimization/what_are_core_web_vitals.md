Core Web Vitals are a set of three specific metrics defined by Google that measure the real-world user experience of a web page. They focus on loading performance, interactivity, and visual stability, and are used as ranking signals by Google Search.

**The three Core Web Vitals:**

**1. Largest Contentful Paint (LCP)** — Measures loading performance
- What: Time from page load until the largest content element (image, text block, video) is rendered
- Good: ≤ 2.5 seconds
- Needs improvement: 2.5 - 4 seconds
- Poor: > 4 seconds

```javascript
// Measuring LCP
const observer = new PerformanceObserver((list) => {
  const entries = list.getEntries();
  const lcp = entries[entries.length - 1];
  console.log('LCP:', lcp.startTime);
  console.log('LCP element:', lcp.element);
});
observer.observe({ type: 'largest-contentful-paint', buffered: true });
```

**Improving LCP:**
- Optimize and preload hero images
- Inline critical CSS
- Remove render-blocking JavaScript
- Use server-side rendering (SSR)
- Optimize server response time (TTFB)
- Use a CDN
- Preconnect to third-party origins

**2. Interaction to Next Paint (INP)** — Measures responsiveness (replaced First Input Delay in March 2024)
- What: Time from when a user interacts (click, tap, keypress) to when the next frame is painted
- Good: ≤ 200 milliseconds
- Needs improvement: 200 - 500 milliseconds
- Poor: > 500 milliseconds

```javascript
// Measuring INP (requires web-vitals library)
import { onINP } from 'web-vitals';
onINP(console.log);
```

**Improving INP:**
- Break up long JavaScript tasks (use `requestIdleCallback` or `scheduler.yield()`)
- Avoid blocking the main thread
- Use Web Workers for heavy computations
- Minimize DOM size
- Avoid forced synchronous layouts

**3. Cumulative Layout Shift (CLS)** — Measures visual stability
- What: Sum of all layout shift scores for unexpected layout shifts during the page lifecycle
- Good: ≤ 0.1
- Needs improvement: 0.1 - 0.25
- Poor: > 0.25

```javascript
// Measuring CLS
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (!entry.hadRecentInput) {
      console.log('Layout shift:', entry.value);
    }
  }
});
observer.observe({ type: 'layout-shift', buffered: true });
```

**Improving CLS:**
- Always set `width` and `height` on images and videos
- Reserve space for ads and dynamic content
- Use `font-display: optional` or preload fonts
- Avoid inserting content above existing content
- Use CSS `contain` for dynamic containers
- Prefer `transform` animations over layout-triggering properties

**Measuring Core Web Vitals:**

```javascript
// Using the web-vitals library
import { onLCP, onINP, onCLS } from 'web-vitals';

onLCP(console.log);
onINP(console.log);
onCLS(console.log);

// Send to analytics
function sendToAnalytics(metric) {
  const body = JSON.stringify({
    name: metric.name,
    value: metric.value,
    id: metric.id,
    rating: metric.rating // 'good', 'needs-improvement', 'poor'
  });
  navigator.sendBeacon('/analytics', body);
}

onLCP(sendToAnalytics);
onINP(sendToAnalytics);
onCLS(sendToAnalytics);
```

**Lab data vs field data:**
- **Lab data** — Measured in controlled environments (Lighthouse, WebPageTest). Consistent but may not reflect real-world conditions.
- **Field data** — Measured from real users via Chrome UX Report (CrUX). Reflects actual user experience but varies by network, device, and location.

Google uses field data for Search ranking. Both are important for development — lab data for catching issues early, field data for understanding real user impact.
