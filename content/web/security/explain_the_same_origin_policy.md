The Same-Origin Policy (SOP) is a fundamental browser security mechanism that restricts how a document or script from one origin can interact with resources from another origin. It is the foundation of web security, preventing malicious websites from reading sensitive data from other sites.

**What is an origin?**

An origin is defined by three components:
- **Protocol** (http/https)
- **Hostname** (example.com)
- **Port** (80, 443, 8080)

All three must match for two URLs to be considered "same origin":

```
https://example.com/path1    ✅ Same origin as https://example.com/path2
https://example.com          ❌ Different from http://example.com (different protocol)
https://example.com          ❌ Different from https://api.example.com (different hostname)
https://example.com:443      ❌ Different from https://example.com:8080 (different port)
```

**What the Same-Origin Policy restricts:**

1. **Reading cross-origin responses** — JavaScript cannot read the response of a cross-origin `fetch` or `XMLHttpRequest` unless the server explicitly allows it via CORS
2. **Accessing cross-origin DOM** — An iframe from one origin cannot access the DOM of a page from another origin
3. **Reading cross-origin cookies** — Scripts cannot read cookies set by another origin

**What is NOT restricted by SOP:**

1. **Loading cross-origin resources** — Images, scripts, stylesheets, iframes, fonts can be loaded from any origin (this is how CDNs work)
2. **Sending cross-origin requests** — Requests are sent, but responses cannot be read (CORS is needed to read)
3. **Form submissions** — Forms can submit to any origin
4. **Navigation** — Links can navigate to any origin
5. **Embedding** — iframes can embed any origin (controlled by `X-Frame-Options` or `frame-ancestors`)

```javascript
// These are allowed (loading resources)
<img src="https://cdn.example.com/image.jpg">
<script src="https://third-party.com/widget.js">
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto">

// This is blocked (reading cross-origin data)
const response = await fetch('https://other-site.com/api/data');
const data = await response.json(); // Blocked by SOP unless CORS allows it
```

**Relaxing the Same-Origin Policy:**

**CORS (Cross-Origin Resource Sharing):**
```javascript
// Server explicitly allows cross-origin access
Access-Control-Allow-Origin: https://mysite.com
Access-Control-Allow-Methods: GET, POST
Access-Control-Allow-Headers: Content-Type, Authorization
```

**`document.domain`** (deprecated):
```javascript
// Subdomains can set a common domain
// site.example.com and api.example.com
document.domain = 'example.com'; // Now they can communicate
```

**`postMessage`** (safe cross-origin communication):
```javascript
// Sender
const iframe = document.querySelector('iframe');
iframe.contentWindow.postMessage('Hello', 'https://other-site.com');

// Receiver
window.addEventListener('message', (event) => {
  if (event.origin !== 'https://my-site.com') return; // Always verify origin!
  console.log(event.data);
});
```

**Cross-Origin Embedder Policy (COEP) / Cross-Origin Opener Policy (COOP):**
```
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

These newer headers provide finer-grained control over cross-origin isolation, required for features like `SharedArrayBuffer`.

**Same-Origin Policy vs CORS:**

The SOP prevents reading responses, but sometimes you need to read cross-origin data. CORS is the mechanism that allows servers to opt-in to cross-origin access. Think of SOP as the default lockdown, and CORS as the controlled exception.

The Same-Origin Policy is critical because without it, any website could make requests to your bank's API using your stored session cookies and read the responses, effectively stealing your data.
