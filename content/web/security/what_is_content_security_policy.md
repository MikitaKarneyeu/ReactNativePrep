Content Security Policy (CSP) is a browser security mechanism that helps prevent Cross-Site Scripting (XSS), clickjacking, and other code injection attacks by restricting which resources a page is allowed to load and execute. It works by declaring a whitelist of allowed content sources.

**How CSP works:**

The server sends a `Content-Security-Policy` HTTP header (or a `<meta>` tag) that tells the browser which sources of content are trusted. The browser blocks anything not on the whitelist.

**Setting CSP:**

```
Content-Security-Policy: default-src 'self'; script-src 'self' https://cdn.example.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com
```

**Common CSP directives:**

| Directive | Controls |
|-----------|----------|
| `default-src` | Fallback for all resource types |
| `script-src` | JavaScript sources |
| `style-src` | CSS sources |
| `img-src` | Image sources |
| `font-src` | Font sources |
| `connect-src` | Fetch, XHR, WebSocket, EventSource |
| `media-src` | Audio and video sources |
| `frame-src` | iframe sources |
| `object-src` | Plugin sources (Flash, Java) |
| `base-uri` | Allowed URLs for `<base>` tag |
| `form-action` | Allowed form submission targets |
| `frame-ancestors` | Who can embed this page (clickjacking protection) |
| `upgrade-insecure-requests` | Auto-upgrade HTTP to HTTPS |

**Common CSP source values:**

```
'self'              — Same origin
'none'              — Block everything
'unsafe-inline'     — Allow inline scripts/styles (weaker protection)
'unsafe-eval'       — Allow eval() (weaker protection)
'nonce-abc123'      — Allow specific inline scripts with matching nonce
'sha256-hash...'    — Allow specific inline scripts by hash
https://cdn.com     — Allow specific domain
*.example.com       — Allow all subdomains
```

**Recommended CSP for an application:**

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'nonce-abc123' https://cdn.example.com;
  style-src 'self' 'nonce-abc123';
  img-src 'self' data: https://images.example.com;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self' https://api.example.com wss://api.example.com;
  frame-ancestors 'self';
  base-uri 'self';
  form-action 'self';
  upgrade-insecure-requests
```

**Using nonces (preferred over `unsafe-inline`):**

```javascript
// Server generates a unique nonce per request
const nonce = crypto.randomBytes(16).toString('base64');

// CSP header includes the nonce
res.setHeader('Content-Security-Policy',
  `script-src 'self' 'nonce-${nonce}'`
);

// HTML includes the nonce on allowed scripts
// <script nonce="abc123">console.log('Allowed');</script>
// <script>console.log('Blocked');</script>
```

**Report-only mode:**

```
Content-Security-Policy-Report-Only: default-src 'self'; report-uri /csp-violations
```

Report-only mode doesn't block anything but sends violation reports to your endpoint. This is essential for testing before enforcing.

**CSP in Express.js:**

```javascript
const helmet = require('helmet');

app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'nonce-abc123'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", "data:", "https:"],
    connectSrc: ["'self'", "https://api.example.com"]
  }
}));
```

**Common challenges:**

1. **Inline scripts** — CSP blocks inline `<script>` by default. Use nonces or hashes instead of `'unsafe-inline'`
2. **Inline styles** — Use nonces for critical CSS, or move to external stylesheets
3. **Third-party scripts** — Analytics, ads, widgets require whitelisting their domains
4. **eval()** — Some libraries (older template engines, some framework features) use `eval()`. Avoid `'unsafe-eval'` if possible
5. **Dynamic imports** — May require `script-src` to include blob: or specific domains

CSP is one of the most effective defenses against XSS. Start with `Content-Security-Policy-Report-Only` to identify issues, then switch to enforcing mode.
