Lazy loading is a performance optimization technique that defers the loading of non-critical resources until they are actually needed. Instead of loading everything upfront, you load resources on demand — typically when they enter the viewport or when the user interacts with a feature.

**Image lazy loading with the native `loading` attribute:**

```html
<!-- Native lazy loading — simplest approach -->
<img src="photo.jpg" alt="Description" loading="lazy" width="800" height="600">

<!-- Eager loading for above-the-fold images (default) -->
<img src="hero.jpg" alt="Hero" loading="eager" fetchpriority="high">
```

**Image lazy loading with Intersection Observer:**

```html
<img data-src="photo.jpg" alt="Description" class="lazy">
```

```javascript
const lazyImages = document.querySelectorAll('img.lazy');

const imageObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
      img.classList.remove('lazy');
      imageObserver.unobserve(img);
    }
  });
}, { rootMargin: '200px' }); // Start loading 200px before visible

lazyImages.forEach(img => imageObserver.observe(img));
```

**Lazy loading JavaScript modules:**

```javascript
// Dynamic import — loads module on demand
button.addEventListener('click', async () => {
  const { Chart } = await import('./chart.js');
  const chart = new Chart(canvas);
});

// Route-based code splitting
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Settings = React.lazy(() => import('./pages/Settings'));
```

**Lazy loading with React:**

```jsx
import { lazy, Suspense } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeavyComponent />
    </Suspense>
  );
}
```

**Lazy loading CSS:**

```javascript
// Load non-critical CSS asynchronously
const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = '/css/non-critical.css';
document.head.appendChild(link);

// Or use media trick
<link rel="stylesheet" href="/css/non-critical.css" media="print" onload="this.media='all'">
```

**Benefits of lazy loading:**

1. **Faster initial page load** — Fewer resources to download on first render
2. **Reduced bandwidth** — Users who don't scroll to certain content never download those resources
3. **Better Core Web Vitals** — Improves LCP, FCP, and overall performance scores
4. **Reduced server load** — Fewer requests hitting the server initially

**Best practices:**

1. **Always set dimensions** — Use `width` and `height` on images to prevent layout shift (CLS)
2. **Use placeholders** — Show a low-quality image placeholder (LQIP) or skeleton while loading
3. **Don't lazy-load above-the-fold content** — Hero images and critical content should load immediately
4. **Set appropriate margins** — Use `rootMargin` in Intersection Observer to start loading before content is visible
5. **Provide fallbacks** — Use `<noscript>` for users without JavaScript
6. **Native is preferred** — Use `loading="lazy"` for images/iframes when browser support is sufficient

```html
<!-- Complete pattern with placeholder and fallback -->
<div class="image-wrapper" style="aspect-ratio: 16/9; background: #f0f0f0;">
  <img
    src="placeholder-low-quality.jpg"
    data-src="full-quality.jpg"
    alt="Description"
    loading="lazy"
    width="800"
    height="450"
    class="lazy"
  >
</div>
```
