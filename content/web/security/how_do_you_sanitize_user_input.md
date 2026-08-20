Sanitizing user input is the process of cleaning, validating, and encoding data received from users to prevent security vulnerabilities like XSS, SQL injection, and command injection. It should be applied at every point where user input is processed — both on the server and client.

**Types of sanitization:**

**1. HTML sanitization** (preventing XSS):

```javascript
// Using DOMPurify (recommended)
import DOMPurify from 'dompurify';

// Sanitize HTML — removes dangerous elements and attributes
const clean = DOMPurify.sanitize(userHTML);
element.innerHTML = clean;

// Configure allowed tags and attributes
const clean = DOMPurify.sanitize(userHTML, {
  ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
  ALLOWED_ATTR: ['href', 'title'],
  ALLOW_DATA_ATTR: false
});

// Manual escaping (for plain text that should never contain HTML)
function escapeHTML(str) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  return str.replace(/[&<>"']/g, (char) => map[char]);
}
```

**2. Input validation** (rejecting invalid data):

```javascript
// Using Zod for schema validation
import { z } from 'zod';

const userSchema = z.object({
  name: z.string().min(1).max(100).trim(),
  email: z.string().email().toLowerCase(),
  age: z.number().int().min(0).max(150),
  role: z.enum(['user', 'admin']),
  bio: z.string().max(500).optional()
});

const result = userSchema.safeParse(req.body);
if (!result.success) {
  return res.status(400).json({ errors: result.error.issues });
}
const cleanData = result.data;
```

**3. SQL injection prevention** (use parameterized queries):

```javascript
// ❌ Vulnerable to SQL injection
const query = `SELECT * FROM users WHERE email = '${email}'`;
// email = "'; DROP TABLE users; --" destroys your database

// ✅ Parameterized queries
const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);

// ✅ Using an ORM
const user = await User.findOne({ where: { email } });
```

**4. URL sanitization:**

```javascript
function sanitizeURL(url) {
  try {
    const parsed = new URL(url);
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return null;
    }
    return parsed.href;
  } catch {
    return null; // Invalid URL
  }
}

// Prevent javascript: protocol attacks
const safeURL = sanitizeURL(userInput);
if (safeURL) {
  link.href = safeURL;
}
```

**5. File upload sanitization:**

```javascript
function validateFile(file) {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedTypes.includes(file.mimetype)) {
    throw new Error('Invalid file type');
  }
  if (file.size > maxSize) {
    throw new Error('File too large');
  }

  // Generate a random filename (don't use user-provided name)
  const ext = path.extname(file.originalname).toLowerCase();
  const filename = crypto.randomUUID() + ext;
  return filename;
}
```

**6. NoSQL injection prevention:**

```javascript
// ❌ Vulnerable
const user = await User.findOne({ email: req.body.email });
// email: { $gt: "" } matches all users

// ✅ Validate types before querying
const email = z.string().email().parse(req.body.email);
const user = await User.findOne({ email });
```

**Sanitization layers (defense in depth):**

1. **Client-side validation** — UX improvement, not security (can be bypassed)
2. **Server-side validation** — Reject invalid input before processing
3. **Sanitization** — Clean data before storing or rendering
4. **Output encoding** — Encode data when rendering (context-dependent)
5. **CSP** — Second layer of XSS defense

```javascript
// Complete flow
async function handleComment(req, res) {
  // 1. Validate
  const schema = z.object({
    content: z.string().min(1).max(5000)
  });
  const { content } = schema.parse(req.body);

  // 2. Sanitize
  const sanitized = DOMPurify.sanitize(content);

  // 3. Store
  await db.comments.create({ content: sanitized, userId: req.user.id });

  // 4. Output encoding happens in the template (React JSX auto-escapes)
  res.json({ content: sanitized });
}
```

**Best practices:**

- Never trust client-side validation alone — always validate on the server
- Validate type, length, format, and range
- Use allowlists (what IS allowed) rather than blocklists (what to reject)
- Use parameterized queries for ALL database operations
- Sanitize HTML with DOMPurify, never with regex
- Encode output based on context (HTML, URL, JavaScript, CSS)
- Apply the principle of least privilege — reject by default
