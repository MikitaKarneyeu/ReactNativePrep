HTTP methods (also called verbs) indicate the desired action to be performed on a resource. Each method has specific semantics regarding safety (doesn't modify resources), idempotency (same result when called multiple times), and cacheability.

**GET** — Retrieve a resource
- Safe: Yes | Idempotent: Yes | Cacheable: Yes
- Used for reading data without side effects
- Parameters sent in URL query string
- Never used to modify data on the server

```javascript
fetch('/api/users')
fetch('/api/users/123')
fetch('/api/posts?page=2&limit=10')
```

**POST** — Create a new resource or submit data
- Safe: No | Idempotent: No | Cacheable: Rarely
- Used for creating new resources or performing actions
- Data sent in request body
- Each call may create a new resource

```javascript
fetch('/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Alice', email: 'alice@example.com' })
})
```

**PUT** — Replace a resource entirely
- Safe: No | Idempotent: Yes | Cacheable: No
- Replaces the entire resource with the request body
- If the resource doesn't exist, it may create it (depending on implementation)

```javascript
fetch('/api/users/123', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Alice', email: 'newemail@example.com' })
})
```

**PATCH** — Partially update a resource
- Safe: No | Idempotent: Varies | Cacheable: No
- Sends only the fields that need updating
- More efficient than PUT for partial changes

```javascript
fetch('/api/users/123', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'newemail@example.com' })
})
```

**DELETE** — Remove a resource
- Safe: No | Idempotent: Yes | Cacheable: No
- Deletes the specified resource
- Idempotent because deleting something already deleted has the same effect

```javascript
fetch('/api/users/123', { method: 'DELETE' })
```

**HEAD** — Same as GET but returns only headers (no body)
- Used for checking if a resource exists, getting metadata, or checking cache validity

**OPTIONS** — Describe communication options for a resource
- Used in CORS preflight requests to check allowed methods and headers

**TRACE** — Perform a loop-back test along the path to the target
- Used for debugging; generally disabled on production servers for security

**Summary table:**

| Method | CRUD | Safe | Idempotent | Cacheable | Body |
|--------|------|------|-----------|-----------|------|
| GET | Read | Yes | Yes | Yes | No |
| POST | Create | No | No | Rarely | Yes |
| PUT | Update/Replace | No | Yes | No | Yes |
| PATCH | Update/Modify | No | Varies | No | Yes |
| DELETE | Delete | No | Yes | No | Optional |

**Idempotency explained:** Calling an operation multiple times produces the same result as calling it once. GET, PUT, and DELETE are idempotent — calling `DELETE /users/123` ten times has the same effect as calling it once (the user is deleted). POST is not idempotent — calling `POST /orders` ten times may create ten orders.
