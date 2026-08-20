HTTP status codes are three-digit numbers returned by a server in response to a client's request. They indicate whether the request was successful, redirected, or encountered an error. Status codes are grouped into five categories by their first digit.

**1xx — Informational:**
- `100 Continue` — Server received headers, client should send body
- `101 Switching Protocols` — Server is switching protocols (e.g., to WebSocket)
- `103 Early Hints` — Preload resources while server prepares response

**2xx — Success:**
- `200 OK` — Standard success response
- `201 Created` — Resource created successfully (typically after POST)
- `202 Accepted` — Request accepted for processing but not yet completed
- `204 No Content` — Success with no response body (typically after DELETE)
- `206 Partial Content` — Server is delivering part of the resource (range requests)

**3xx — Redirection:**
- `301 Moved Permanently` — Resource has permanently moved to a new URL (browser caches redirect)
- `302 Found` — Temporary redirect (original method may change to GET)
- `303 See Other` — Redirect with GET (used after POST to prevent resubmission)
- `304 Not Modified` — Resource hasn't changed (use cached version)
- `307 Temporary Redirect` — Temporary redirect preserving the HTTP method
- `308 Permanent Redirect` — Permanent redirect preserving the HTTP method

**4xx — Client Errors:**
- `400 Bad Request` — Malformed request syntax, invalid data
- `401 Unauthorized` — Authentication required (not logged in)
- `403 Forbidden` — Authenticated but not authorized to access the resource
- `404 Not Found` — Resource doesn't exist
- `405 Method Not Allowed` — HTTP method not supported for this endpoint
- `408 Request Timeout` — Server timed out waiting for the request
- `409 Conflict` — Request conflicts with current state (e.g., duplicate entry)
- `413 Payload Too Large` — Request body exceeds server limits
- `415 Unsupported Media Type` — Content-Type not accepted
- `422 Unprocessable Entity` — Validation errors (semantic errors in request)
- `429 Too Many Requests` — Rate limit exceeded

**5xx — Server Errors:**
- `500 Internal Server Error` — Generic server-side error
- `501 Not Implemented` — Server doesn't support the HTTP method
- `502 Bad Gateway` — Invalid response from upstream server
- `503 Service Unavailable` — Server is temporarily overloaded or down
- `504 Gateway Timeout` — Upserver timed out

**Handling status codes in JavaScript:**

```javascript
const response = await fetch('/api/users');

if (response.ok) {
  // 2xx success
  const data = await response.json();
} else if (response.status === 401) {
  // Redirect to login
  window.location.href = '/login';
} else if (response.status === 404) {
  showError('Resource not found');
} else if (response.status === 422) {
  const errors = await response.json();
  showValidationErrors(errors);
} else if (response.status === 429) {
  // Rate limited — retry after delay
  const retryAfter = response.headers.get('Retry-After');
  setTimeout(() => retryRequest(), retryAfter * 1000);
} else {
  showError(`Error: ${response.status}`);
}
```

**REST API conventions:**

| Operation | Success Status | Error Example |
|-----------|---------------|---------------|
| GET /resources | 200 | 404 if not found |
| POST /resources | 201 Created | 400, 422 for validation |
| PUT /resources/:id | 200 | 404, 422 |
| PATCH /resources/:id | 200 | 404, 422 |
| DELETE /resources/:id | 204 No Content | 404 |

**Common interview question — 401 vs 403:**
- **401 Unauthorized** means "you are not authenticated" — the client hasn't provided valid credentials. Log in first.
- **403 Forbidden** means "you are authenticated but don't have permission" — you're logged in, but this resource isn't accessible to your role.
