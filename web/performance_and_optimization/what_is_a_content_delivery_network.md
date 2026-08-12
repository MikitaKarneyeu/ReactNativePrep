A Content Delivery Network (CDN) is a geographically distributed network of servers (edge servers) that deliver web content to users from the location closest to them. Instead of all requests going to a single origin server, the CDN caches and serves content from edge locations around the world.

**How a CDN works:**

1. User requests a resource (e.g., `https://cdn.example.com/image.jpg`)
2. DNS resolves to the nearest CDN edge server
3. If the edge server has the resource cached → serves it immediately (cache hit)
4. If not cached → edge server fetches from origin, caches it, and serves it to the user (cache miss)
5. Subsequent requests from nearby users get the cached version

```
User (Tokyo) → CDN Edge (Tokyo) → Cache Hit → Fast response (~20ms)
User (London) → CDN Edge (London) → Cache Miss → Origin Server → Cache → Response (~200ms)
User (London) → CDN Edge (London) → Cache Hit → Fast response (~20ms)
```

**What CDNs cache:**

- Static assets: images, CSS, JavaScript, fonts, videos
- API responses (with appropriate cache headers)
- Entire pages (for static sites or SSR with cache)
- Downloadable files (software, documents)

**Benefits of using a CDN:**

1. **Reduced latency** — Users get content from a nearby server instead of a distant origin
2. **Faster load times** — Lower Time to First Byte (TTFB) and faster resource delivery
3. **Reduced origin load** — CDN handles most requests, protecting origin from traffic spikes
4. **Better availability** — If origin goes down, CDN can serve cached content
5. **DDoS protection** — CDN absorbs malicious traffic before it reaches origin
6. **Global scalability** — Content is served worldwide without deploying to multiple regions
7. **Bandwidth savings** — Reduced origin bandwidth costs

**Popular CDN providers:**

- Cloudflare, AWS CloudFront, Google Cloud CDN, Akamai, Fastly, Vercel Edge Network, Netlify CDN

**CDN configuration example (Cloudflare):**

```javascript
// Set cache headers on your origin server
app.use('/static', (req, res, next) => {
  res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  next();
});

app.use('/', (req, res, next) => {
  res.setHeader('Cache-Control', 'public, max-age=3600');
  next();
});

// Purge CDN cache when deploying
async function purgeCache(files) {
  await fetch('https://api.cloudflare.com/client/v4/zones/ZONE_ID/purge_cache', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer API_TOKEN',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ files })
  });
}
```

**Edge computing:**

Modern CDNs offer edge computing — running server-side code at edge locations:

```javascript
// Cloudflare Worker (runs at edge)
export default {
  async fetch(request) {
    const url = new URL(request.url);

    // Personalize content at the edge
    const country = request.cf.country;
    const greeting = country === 'JP' ? 'こんにちは' : 'Hello';

    return new Response(`${greeting} from the edge!`);
  }
};
```

**CDN vs origin server:**

| Aspect | Origin Server | CDN |
|--------|--------------|-----|
| Location | Single (or few) | Global distribution |
| Latency | Depends on distance | Low (nearby edge) |
| Dynamic content | Full support | Limited (edge computing) |
| Cost | Fixed/usage | Pay per transfer |
| Cache control | Full control | Configurable |

**When to use a CDN:**

- Serving static assets (always)
- Serving media files (images, videos)
- Global user base
- High traffic websites
- Need for DDoS protection
- SSR applications with caching

A CDN is considered essential infrastructure for production web applications. Even small sites benefit from the performance and reliability improvements.
