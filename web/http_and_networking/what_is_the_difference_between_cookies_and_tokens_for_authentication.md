Cookies and tokens (particularly JWTs) are the two primary mechanisms for maintaining authenticated sessions in web applications. They differ in how they store credentials, how they're sent with requests, and their security characteristics.

**Cookie-based authentication:**

```javascript
// Server sets a cookie in the response
// Express.js example
app.post('/login', (req, res) => {
  const sessionId = createSession(user);
  res.cookie('sessionId', sessionId, {
    httpOnly: true,     // Not accessible to JavaScript
    secure: true,       // Only sent over HTTPS
    sameSite: 'strict', // CSRF protection
    maxAge: 86400000    // 24 hours
  });
  res.json({ user });
});

// Browser automatically sends cookies with every request
fetch('/api/profile', {
  credentials: 'include' // Include cookies in cross-origin requests
});
```

**Token-based authentication (JWT):**

```javascript
// Server returns a token in the response body
app.post('/login', (req, res) => {
  const token = jwt.sign({ userId: user.id }, SECRET, { expiresIn: '24h' });
  res.json({ token, user });
});

// Client stores token and sends it explicitly
const token = localStorage.getItem('token');
fetch('/api/profile', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

**Key differences:**

| Aspect | Cookies | Tokens (JWT) |
|--------|---------|-------------|
| Storage | Browser cookie storage | localStorage, sessionStorage, or memory |
| Automatic sending | Yes (browser sends automatically) | No (must add header manually) |
| CORS | Sent automatically with same-origin | Must be included in request headers |
| CSRF vulnerability | Yes (automatic sending = CSRF risk) | No (not sent automatically) |
| XSS vulnerability | Low (if httpOnly) | High (accessible to JavaScript) |
| Server state | Stateful (session stored server-side) | Stateless (token contains all info) |
| Scalability | Requires session store / sticky sessions | No server-side storage needed |
| Revocation | Easy (delete session from store) | Hard (token valid until expiry) |
| Cross-domain | Limited by cookie domain rules | Works across any domain |
| Size | Small (~100 bytes) | Larger (JWT typically 300-1000 bytes) |

**Security considerations:**

**Cookie security:**
```javascript
// Secure cookie configuration
res.cookie('session', sessionId, {
  httpOnly: true,     // Prevents XSS access
  secure: true,       // HTTPS only
  sameSite: 'strict', // Prevents CSRF
  path: '/',
  domain: '.example.com'
});
```

- `httpOnly` prevents JavaScript access → protects against XSS
- `sameSite` prevents cross-origin sending → protects against CSRF
- Vulnerable to CSRF because browsers send cookies automatically

**Token security:**
```javascript
// Store in memory (most secure, but lost on refresh)
let token = null;

// Store in httpOnly cookie (combines benefits of both approaches)
res.cookie('token', jwt, { httpOnly: true, secure: true, sameSite: 'strict' });
```

- Accessible to JavaScript → vulnerable to XSS
- NOT vulnerable to CSRF (not sent automatically)
- Storing in `localStorage` makes it XSS-vulnerable
- Storing in `httpOnly` cookie gives cookie-like protection

**Hybrid approach (best practice):**

The most secure modern approach combines both:
- Store the JWT in an `httpOnly`, `secure`, `sameSite` cookie
- This gives you the stateless benefits of JWT with the XSS protection of httpOnly cookies

```javascript
app.post('/login', (req, res) => {
  const token = jwt.sign({ userId: user.id }, SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ userId: user.id }, REFRESH_SECRET, { expiresIn: '7d' });

  res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'strict' });
  res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'strict', path: '/refresh' });
  res.json({ user });
});
```

**When to use each:**

- **Cookies**: Traditional web apps, same-origin APIs, when you need automatic credential sending
- **Tokens**: SPAs, mobile apps, microservices, cross-origin APIs, stateless architectures
- **Hybrid (JWT in httpOnly cookie)**: Best security for modern web applications
