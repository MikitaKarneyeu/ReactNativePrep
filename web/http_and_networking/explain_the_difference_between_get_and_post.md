GET and POST are the two most commonly used HTTP methods, and they differ in purpose, data handling, security characteristics, and caching behavior.

**GET — Retrieve data:**

```javascript
// Query parameters in the URL
fetch('/api/users?page=2&limit=10&sort=name')
fetch(`/api/users/${userId}`)
```

- Data is sent as **query parameters in the URL** (`?key=value&key2=value2`)
- URLs have a length limit (typically 2048 characters, varies by browser/server)
- **Bookmarkable** — URLs can be saved and shared
- **Cacheable** — Browsers and CDNs cache GET requests
- **Visible in browser history** — URL parameters appear in history and address bar
- **Idempotent** — Multiple identical requests should return the same result
- **No request body** — GET technically can have a body but most servers and proxies ignore it
- Used for **reading** data — should not modify server state

**POST — Send/create data:**

```javascript
// Data in request body
fetch('/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Alice', email: 'alice@example.com' })
})

// Form submission
fetch('/api/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: 'username=alice&password=secret'
})

// File upload
const formData = new FormData();
formData.append('file', fileInput.files[0]);
fetch('/api/upload', { method: 'POST', body: formData })
```

- Data is sent in the **request body** (not the URL)
- **No practical size limit** on data (servers may have their own limits)
- **Not bookmarkable** — data is not in the URL
- **Not cached** by default (cacheable with explicit headers)
- **Not idempotent** — multiple identical requests may create multiple resources
- Used for **creating** resources, submitting forms, uploading files, and any operation that changes server state

**Key differences:**

| Aspect | GET | POST |
|--------|-----|------|
| Purpose | Retrieve data | Send/modify data |
| Data location | URL query string | Request body |
| Data size | Limited by URL length | Practically unlimited |
| Bookmarking | Yes | No |
| Caching | Default | Not by default |
| Browser history | URL is stored | Body is not stored |
| Security | Data visible in URL | Data in body (not in URL) |
| Idempotent | Yes | No |
| Back/forward button | Re-executes safely | May trigger "resubmit" warning |
| HTML form method | Default method | Must specify `method="POST"` |

**Security considerations:**

Neither GET nor POST is inherently more secure than the other over HTTP — both transmit data in plain text. Over HTTPS, both are encrypted. However:

- GET parameters appear in URLs, which get logged in server access logs, browser history, and proxy logs
- POST body is not visible in URLs, providing slightly better privacy for sensitive data
- **Never send passwords or tokens in GET parameters** — use POST with HTTPS
- CSRF protection is important for both, but POST requests with `Content-Type: application/json` are somewhat protected by CORS

**When to use which:**

- **GET** for all read operations: fetching lists, getting details, searching
- **POST** for creating resources, submitting forms, file uploads, and actions that change state
- **PUT/PATCH** for updating existing resources (prefer over POST for updates)
- **DELETE** for removing resources
