Browser caching stores copies of resources (HTML, CSS, JavaScript, images) locally so they don't need to be re-downloaded from the server on subsequent visits. This dramatically improves page load times and reduces bandwidth usage.

**How caching works:**

When the browser requests a resource, it checks its local cache first. If a valid cached version exists, it uses that instead of making a network request. The server controls caching behavior through HTTP headers.

**Cache-Control header** (primary caching mechanism):

```javascript
// Cache for 1 year (immutable — for hashed filenames)
res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');

// Cache for 1 hour
res.setHeader('Cache-Control', 'public, max-age=3600');

// Don't cache
res.setHeader('Cache-Control', 'no-store');

// Cache but revalidate with server every time
res.setHeader('Cache-Control', 'no-cache');

// Private — only browser can cache, not CDNs
res.setHeader('Cache-Control', 'private, max-age=300');
```

**Cache-Control directives:**

| Directive | Meaning |
|-----------|---------|
| `public` | Can be cached by browsers and CDNs |
| `private` | Only the browser can cache (not CDNs) |
| `no-cache` | Cache but revalidate with server before using |
| `no-store` | Don't cache at all |
| `max-age=N` | Cache for N seconds |
| `s-maxage=N` | Cache for N seconds (CDN-specific, overrides max-age) |
| `immutable` | Resource will never change (skip revalidation) |
| `must-revalidate` | Must revalidate after max-age expires |

**ETag / If-None-Match** (conditional requests):

```javascript
// Server sends ETag with response
res.setHeader('ETag', '"abc123"');

// On next request, browser sends If-None-Match
// GET /styles.css
// If-None-Match: "abc123"

// If resource hasn't changed, server returns 304 Not Modified (no body)
if (req.headers['if-none-match'] === currentETag) {
  return res.status(304).end(); // Use cached version
}
```

**Last-Modified / If-Modified-Since** (alternative validation):

```javascript
res.setHeader('Last-Modified', 'Wed, 15 Jan 2024 10:30:00 GMT');

// Browser sends: If-Modified-Since: Wed, 15 Jan 2024 10:30:00 GMT
// Server returns 304 if not modified since that date
```

**Caching strategies for web applications:**

```javascript
// 1. Hash-based filenames (best for static assets)
// main.a1b2c3d4.js — filename changes when content changes
// Cache with immutable, long max-age
res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');

// 2. HTML — short cache or no-cache (must always be fresh)
res.setHeader('Cache-Control', 'no-cache'); // Revalidate every time

// 3. API responses — varies by data freshness needs
res.setHeader('Cache-Control', 'private, max-age=300'); // 5 minutes
res.setHeader('Cache-Control', 'no-store'); // Never cache (sensitive data)

// 4. Images — long cache, content-addressable names
res.setHeader('Cache-Control', 'public, max-age=2592000'); // 30 days
```

**Cache busting:**

The most reliable way to invalidate cached resources is to change the filename:

```html
<!-- Hash in filename — changes when file content changes -->
<script src="/js/main.a1b2c3.js"></script>
<link rel="stylesheet" href="/css/styles.d4e5f6.css">

<!-- Query string (less reliable — some proxies ignore it) -->
<script src="/js/main.js?v=2"></script>
```

**The caching flow:**

1. Browser requests `/styles.css`
2. Cache exists and `max-age` not expired → use cached version (no network request)
3. Cache exists but `max-age` expired → send conditional request with `If-None-Match` or `If-Modified-Since`
4. Server returns `304 Not Modified` → use cached version (small response)
5. Server returns `200 OK` with new content → update cache

**Service Worker caching:**

```javascript
// Cache-first strategy
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request).then(response => {
        const clone = response.clone();
        caches.open('v1').then(cache => cache.put(event.request, clone));
        return response;
      });
    })
  );
});
```

Effective caching is one of the most impactful performance optimizations. The general rule: use long cache times with hash-based filenames for static assets, and short/no cache for HTML and dynamic content.
