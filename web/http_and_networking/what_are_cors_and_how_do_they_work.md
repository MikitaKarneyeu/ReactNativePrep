CORS (Cross-Origin Resource Sharing) is a security mechanism implemented by browsers that restricts web pages from making requests to a different origin than the one that served the page. It is an extension of the Same-Origin Policy that provides controlled access to cross-origin resources.

**What is an origin?**

An origin is defined by the combination of protocol, hostname, and port:
- `https://example.com:443` is a different origin from:
  - `http://example.com` (different protocol)
  - `https://api.example.com` (different hostname)
  - `https://example.com:8080` (different port)

**How CORS works:**

When a web page makes a cross-origin request, the browser adds an `Origin` header and may perform a **preflight request** for non-simple requests.

**Simple requests** (no preflight needed):
- Methods: GET, HEAD, POST
- Headers: Only `Accept`, `Accept-Language`, `Content-Language`, `Content-Type` (limited to `application/x-www-form-urlencoded`, `multipart/form-data`, `text/plain`)

```javascript
// Simple request — sent directly
fetch('https://api.example.com/data', {
  method: 'GET',
  headers: { 'Accept': 'application/json' }
});
```

**Preflight requests** — For non-simple requests, the browser sends an OPTIONS request first:

```javascript
// Triggers preflight (custom header and PUT method)
fetch('https://api.example.com/users/123', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer token123'
  },
  body: JSON.stringify({ name: 'Alice' })
});
```

**Preflight flow:**
1. Browser sends `OPTIONS /users/123` with headers:
   - `Origin: https://frontend.com`
   - `Access-Control-Request-Method: PUT`
   - `Access-Control-Request-Headers: Content-Type, Authorization`
2. Server responds with:
   - `Access-Control-Allow-Origin: https://frontend.com`
   - `Access-Control-Allow-Methods: GET, POST, PUT, DELETE`
   - `Access-Control-Allow-Headers: Content-Type, Authorization`
   - `Access-Control-Max-Age: 86400` (cache preflight for 24 hours)
3. If the server approves, browser sends the actual PUT request

**Server-side CORS headers:**

```javascript
// Express.js CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://frontend.com');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Max-Age', '86400');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

// Or use the cors package
const cors = require('cors');
app.use(cors({
  origin: 'https://frontend.com',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
```

**Common CORS headers:**

| Header | Purpose |
|--------|---------|
| `Access-Control-Allow-Origin` | Which origins can access the resource (`*` or specific origin) |
| `Access-Control-Allow-Methods` | Allowed HTTP methods |
| `Access-Control-Allow-Headers` | Allowed request headers |
| `Access-Control-Allow-Credentials` | Whether cookies/auth headers are sent (`true`/`false`) |
| `Access-Control-Max-Age` | How long to cache preflight (seconds) |
| `Access-Control-Expose-Headers` | Which response headers the client can access |

**Common CORS issues and solutions:**

```javascript
// Issue: "No 'Access-Control-Allow-Origin' header is present"
// Fix: Server must include the header

// Issue: Wildcard (*) doesn't work with credentials
// ❌
res.header('Access-Control-Allow-Origin', '*');
res.header('Access-Control-Allow-Credentials', 'true');

// ✅ Must specify exact origin with credentials
res.header('Access-Control-Allow-Origin', 'https://frontend.com');
res.header('Access-Control-Allow-Credentials', 'true');

// Issue: Custom headers not allowed
// Fix: Add to Access-Control-Allow-Headers
res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Custom-Header');
```

**CORS is a browser-only restriction.** Server-to-server requests, curl, Postman, and native apps are not affected by CORS. The browser enforces it to protect users from malicious cross-origin requests initiated by scripts on other pages.
