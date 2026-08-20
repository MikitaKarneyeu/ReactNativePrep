Route parameters and query parameters are two ways to pass data through URLs in a web application. They serve different purposes and are used in different scenarios.

**Route parameters** are dynamic segments of the URL path that identify a specific resource:

```jsx
// Route definition
<Route path="/users/:id" element={<UserProfile />} />
<Route path="/posts/:postId/comments/:commentId" element={<Comment />} />

// URLs
// /users/123
// /posts/456/comments/789

// Accessing route params
function UserProfile() {
  const { id } = useParams();
  return <div>User ID: {id}</div>;
}

function Comment() {
  const { postId, commentId } = useParams();
  return <div>Post {postId}, Comment {commentId}</div>;
}
```

**Query parameters** (search parameters) are key-value pairs appended to the URL after a `?`:

```jsx
// URL
// /users?role=admin&page=2&sort=name

// Accessing query params
function UsersList() {
  const [searchParams, setSearchParams] = useSearchParams();

  const role = searchParams.get('role');    // "admin"
  const page = searchParams.get('page');    // "2"
  const sort = searchParams.get('sort');    // "name"

  // Update query params
  setSearchParams({ role: 'admin', page: '3' });
  setSearchParams(prev => {
    prev.set('page', '3');
    return prev;
  });
}
```

**When to use each:**

| Route Parameters | Query Parameters |
|-----------------|------------------|
| Identify a specific resource | Filter, sort, or paginate |
| Required for the page to function | Optional configuration |
| Part of the resource identity | Changes without changing the resource |
| `/users/123` | `/users?role=admin` |
| `/products/laptop-pro` | `/products?category=electronics&minPrice=100` |
| `/posts/456` | `/posts/456?highlight=react` |

**Examples:**

```jsx
// Route params — resource identification
<Route path="/products/:slug" element={<Product />} />
// /products/macbook-pro-16

<Route path="/team/:memberId" element={<TeamMember />} />
// /team/jane-doe

// Query params — configuration/filters
// /products?category=laptops&sort=price&page=2
// /search?q=react+hooks&lang=en
// /dashboard?tab=analytics&dateRange=last30days
```

**Nested route parameters:**

```jsx
<Route path="/organizations/:orgId/projects/:projectId" element={<Project />} />

function Project() {
  const { orgId, projectId } = useParams();
  // orgId: "acme-corp", projectId: "website-redesign"
}
```

**Combining route and query params:**

```jsx
// Route: /products/:category
// URL: /products/laptops?sort=price&brand=apple

function ProductCategory() {
  const { category } = useParams();
  const [searchParams] = useSearchParams();
  const sort = searchParams.get('sort');
  const brand = searchParams.get('brand');

  return (
    <div>
      <h1>{category}</h1>
      <p>Sort by: {sort}, Brand: {brand}</p>
    </div>
  );
}
```

**Building URLs with params:**

```jsx
const navigate = useNavigate();

// With route params
navigate(`/users/${userId}`);

// With query params
navigate(`/users?role=admin&page=2`);

// Using Link
<Link to={`/users/${user.id}`}>{user.name}</Link>
<Link to={`/products?category=${category}`}>View Category</Link>

// Using URLSearchParams for complex query strings
const params = new URLSearchParams({
  role: 'admin',
  page: '2',
  sort: 'name'
});
navigate(`/users?${params.toString()}`);
```

**Validating route params:**

```jsx
function UserProfile() {
  const { id } = useParams();
  const numericId = parseInt(id, 10);

  if (isNaN(numericId) || numericId <= 0) {
    return <Navigate to="/404" replace />;
  }

  // Use numericId safely
}
```

Route parameters are for identifying resources (nouns), while query parameters are for describing how you want that resource presented (adjectives). This semantic distinction helps create clean, meaningful URLs.
