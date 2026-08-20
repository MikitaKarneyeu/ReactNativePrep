Cross-Site Request Forgery (CSRF) is an attack where a malicious website tricks a user's browser into making an unwanted request to another site where the user is authenticated. Since browsers automatically include cookies with requests, the victim's session credentials are sent along with the forged request.

**How CSRF works:**

1. User logs into `bank.com` — browser stores a session cookie
2. User visits `evil.com` (without logging out of bank.com)
3. `evil.com` contains a hidden form or script that submits a request to `bank.com/transfer`
4. Browser automatically includes the bank.com cookie with the request
5. Bank.com sees a valid session and processes the transfer

```html
<!-- On evil.com — hidden form that auto-submits -->
<form action="https://bank.com/transfer" method="POST">
  <input type="hidden" name="to" value="attacker-account">
  <input type="hidden" name="amount" value="10000">
</form>
<script>document.forms[0].submit();</script>
```

**Protection techniques:**

**1. CSRF tokens (synchronizer token pattern):**

```javascript
// Server generates a unique token per session/request
const csrfToken = crypto.randomBytes(32).toString('hex');
req.session.csrfToken = csrfToken;

// Include token in forms
<form action="/transfer" method="POST">
  <input type="hidden" name="_csrf" value="<%= csrfToken %>">
  <input type="text" name="amount">
  <button>Transfer</button>
</form>

// Server validates token on submission
app.post('/transfer', (req, res) => {
  if (req.body._csrf !== req.session.csrfToken) {
    return res.status(403).json({ error: 'Invalid CSRF token' });
  }
  // Process transfer
});
```

**2. SameSite cookie attribute:**

```javascript
// Strict — cookie never sent on cross-site requests
res.cookie('session', id, { sameSite: 'strict' });

// Lax — cookie sent on top-level GET navigations, not on POST/form submissions
res.cookie('session', id, { sameSite: 'lax' });

// None — always sent (requires secure: true)
res.cookie('session', id, { sameSite: 'none', secure: true });
```

`SameSite: 'lax'` is the default in modern browsers and provides good CSRF protection for most cases.

**3. Double-submit cookie pattern:**

```javascript
// Server sets CSRF token as both a cookie and expects it in the request header
const token = crypto.randomUUID();
res.cookie('csrf', token, { httpOnly: false }); // Client reads this

// Client sends token in header
fetch('/api/transfer', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRF-Token': getCookie('csrf') // Read from cookie, send as header
  },
  body: JSON.stringify({ amount: 100 })
});

// Server verifies header matches cookie
app.use((req, res, next) => {
  if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
    const cookieToken = req.cookies.csrf;
    const headerToken = req.headers['x-csrf-token'];
    if (cookieToken !== headerToken) {
      return res.status(403).json({ error: 'CSRF validation failed' });
    }
  }
  next();
});
```

**4. Custom headers (for APIs):**

```javascript
// Browsers don't allow cross-origin requests with custom headers
// without CORS preflight, which evil.com can't pass
fetch('/api/transfer', {
  method: 'POST',
  headers: { 'X-Requested-With': 'XMLHttpRequest' },
  body: JSON.stringify(data)
});

// Server checks for the custom header
if (req.headers['x-requested-with'] !== 'XMLHttpRequest') {
  return res.status(403).json({ error: 'Missing custom header' });
}
```

**5. Verify Origin/Referer headers:**

```javascript
app.use((req, res, next) => {
  const origin = req.headers.origin || req.headers.referer;
  if (origin && !origin.startsWith('https://myapp.com')) {
    return res.status(403).json({ error: 'Invalid origin' });
  }
  next();
});
```

**CSRF protection for SPAs with JWT:**

If you're using JWT tokens stored in JavaScript (not cookies), CSRF is not a concern because the token isn't automatically sent with requests. However, if JWT is in an httpOnly cookie, you still need CSRF protection.

**Best practices:**
1. Use `SameSite: 'lax'` or `'strict'` on session cookies
2. Implement CSRF tokens for state-changing operations
3. Never rely solely on one protection method — use defense in depth
4. Use `POST` for state-changing operations (not GET)
5. Validate Origin and Referer headers as an additional check
