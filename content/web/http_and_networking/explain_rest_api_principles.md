REST (Representational State Transfer) is an architectural style for designing networked applications. RESTful APIs use HTTP methods and URLs to provide a standardized, stateless interface for accessing and manipulating resources.

**The six REST constraints:**

**1. Client-Server separation** — The client and server are independent. The client handles UI, the server handles data and logic. They communicate only through requests and responses.

**2. Statelessness** — Each request contains all information needed to process it. The server doesn't store client context between requests.

```javascript
// Stateless: authentication token sent with every request
fetch('/api/orders', {
  headers: { 'Authorization': 'Bearer token123' }
});
```

**3. Cacheability** — Responses must indicate whether they can be cached. This improves performance and reduces server load.

```javascript
// Server sets cache headers
res.setHeader('Cache-Control', 'public, max-age=3600');
res.setHeader('ETag', '"abc123"');
```

**4. Uniform interface** — Resources are identified by URIs, manipulated through representations, and use standard HTTP methods.

```javascript
// Resources identified by URLs
GET    /api/users          // List users
GET    /api/users/123      // Get specific user
POST   /api/users          // Create user
PUT    /api/users/123      // Replace user
PATCH  /api/users/123      // Update user partially
DELETE /api/users/123      // Delete user
```

**5. Layered system** — The client doesn't know if it's connected directly to the server or through intermediaries (load balancers, proxies, CDNs).

**6. Code on demand (optional)** — Servers can send executable code (JavaScript) to extend client functionality.

**RESTful URL design principles:**

```javascript
// Use nouns, not verbs (HTTP methods are the verbs)
✅ GET /api/users
❌ GET /api/getUsers

// Use plural nouns for collections
✅ GET /api/users
❌ GET /api/user

// Use nested resources for relationships
GET /api/users/123/orders         // Orders for user 123
GET /api/users/123/orders/456     // Specific order

// Use query parameters for filtering, sorting, pagination
GET /api/users?role=admin&status=active
GET /api/posts?sort=-createdAt&page=2&limit=20
GET /api/products?category=electronics&minPrice=100

// Use hyphens for multi-word resources
✅ GET /api/user-profiles
❌ GET /api/userProfiles
```

**Standard HTTP methods and their CRUD mapping:**

| HTTP Method | CRUD Operation | Typical Status Codes |
|-------------|---------------|---------------------|
| GET | Read | 200, 404 |
| POST | Create | 201, 400, 422 |
| PUT | Update/Replace | 200, 404, 422 |
| PATCH | Partial Update | 200, 404, 422 |
| DELETE | Delete | 204, 404 |

**Response format conventions:**

```javascript
// Success: Single resource
{
  "id": 123,
  "name": "Alice",
  "email": "alice@example.com",
  "createdAt": "2024-01-15T10:30:00Z"
}

// Success: Collection with pagination
{
  "data": [...],
  "meta": {
    "total": 100,
    "page": 2,
    "perPage": 20,
    "totalPages": 5
  }
}

// Error
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      { "field": "email", "message": "Must be a valid email address" }
    ]
  }
}
```

**HATEOAS (Hypermedia as the Engine of Application State):**

```json
{
  "id": 123,
  "name": "Alice",
  "links": [
    { "rel": "self", "href": "/api/users/123" },
    { "rel": "orders", "href": "/api/users/123/orders" },
    { "rel": "update", "href": "/api/users/123", "method": "PATCH" }
  ]
}
```

HATEOAS is the most mature level of REST, where responses include links to related actions, making the API self-descriptive and navigable. In practice, most APIs skip HATEOAS for simplicity.

**REST vs other API styles:**
- **GraphQL** — Client specifies exact data needed; single endpoint
- **gRPC** — Binary protocol; high performance; uses Protocol Buffers
- **WebSocket** — Real-time bidirectional communication
