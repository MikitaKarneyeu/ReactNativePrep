HTTP security headers are response headers that instruct the browser to enable specific security features, protecting against common attacks like XSS, clickjacking, MIME sniffing, and data leaks. They form a critical layer of defense for web applications.

**Essential security headers:**

**1. Content-Security-Policy (CSP):**
```
Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-abc123'; style-src 'self'; img-src 'self' data: https:; frame-ancestors 'self'
```
Controls which resources the browser is allowed to load. Prevents XSS, data injection, and clickjacking.

**2. Strict-Transport-Security (HSTS):**
```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```
Forces the browser to use HTTPS for all future requests to the domain, even if the user types `http://`. Prevents protocol downgrade attacks and cookie hijacking.

**3. X-Content-Type-Options:**
```
X-Content-Type-Options: nosniff
```
Prevents the browser from MIME-type sniffing (guessing the content type). Without this, a browser might execute a file disguised as an image as if it were JavaScript.

**4. X-Frame-Options:**
```
X-Frame-Options: DENY
```
Controls whether the page can be embedded in an iframe. Prevents clickjacking attacks where a malicious site overlays your page in a transparent iframe.
- `DENY` — Cannot be framed at all
- `SAMEORIGIN` — Can be framed by same origin only

**5. Referrer-Policy:**
```
Referrer-Policy: strict-origin-when-cross-origin
```
Controls how much referrer information is included with requests.
- `no-referrer` — Never send referrer
- `strict-origin-when-cross-origin` — Send full URL for same-origin, only origin for cross-origin, nothing for downgrade

**6. Permissions-Policy:**
```
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()
```
Controls which browser features and APIs the page can use. Restricting unused features reduces the attack surface.

**7. X-XSS-Protection (legacy, mostly deprecated):**
```
X-XSS-Protection: 0
```
Disables the browser's built-in XSS filter (which could actually introduce vulnerabilities in some cases). CSP is the modern replacement.

**Setting headers in Express.js:**

```javascript
const helmet = require('helmet');
app.use(helmet());

// Or manually
app.use((req, res, next) => {
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=()');
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  next();
});
```

**Headers in Nginx:**

```nginx
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "DENY" always;
add_header Content-Security-Policy "default-src 'self'" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
```

**Recommended starting configuration:**

| Header | Recommended Value |
|--------|-------------------|
| `Content-Security-Policy` | `default-src 'self'` (then customize) |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` |
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `DENY` or `SAMEORIGIN` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | Restrict unused features |

**Testing security headers:**

- [securityheaders.com](https://securityheaders.com) — Grades your site's headers
- [observatory.mozilla.org](https://observatory.mozilla.org) — Mozilla's security scanner
- Chrome DevTools → Network tab → check response headers

Security headers should be set at the server/reverse proxy level so they apply to all responses. They are a low-effort, high-impact security improvement.
