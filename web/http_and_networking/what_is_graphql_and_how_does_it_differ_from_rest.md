GraphQL is a query language and runtime for APIs developed by Facebook. Unlike REST where the server defines the response structure, GraphQL lets the client specify exactly what data it needs in a single request.

**GraphQL basics:**

```graphql
# Query — request specific fields
query {
  user(id: "123") {
    name
    email
    posts {
      title
      createdAt
    }
  }
}

# Response — matches the query shape exactly
{
  "data": {
    "user": {
      "name": "Alice",
      "email": "alice@example.com",
      "posts": [
        { "title": "GraphQL Intro", "createdAt": "2024-01-15" }
      ]
    }
  }
}
```

**Key GraphQL concepts:**

**Queries** — Read data:
```graphql
query GetUsers {
  users(limit: 10, role: ADMIN) {
    id
    name
    email
    avatar
  }
}
```

**Mutations** — Modify data:
```graphql
mutation CreateUser {
  createUser(input: { name: "Alice", email: "alice@example.com" }) {
    id
    name
    createdAt
  }
}
```

**Variables:**
```graphql
query GetUser($id: ID!) {
  user(id: $id) {
    name
    email
  }
}
```

**Fragments** — Reusable field sets:
```graphql
fragment UserFields on User {
  id
  name
  email
  avatar
}

query {
  me { ...UserFields }
  users { ...UserFields }
}
```

**Subscriptions** — Real-time data:
```graphql
subscription OnNewMessage {
  messageAdded(channelId: "general") {
    id
    content
    author { name }
    createdAt
  }
}
```

**GraphQL vs REST:**

| Aspect | REST | GraphQL |
|--------|------|---------|
| Endpoints | Multiple endpoints | Single endpoint |
| Data fetching | Fixed response structure | Client specifies fields |
| Over-fetching | Common (returns all fields) | Eliminated (only requested fields) |
| Under-fetching | Common (need multiple requests) | Eliminated (nested queries) |
| Versioning | URL versioning (`/v1/`, `/v2/`) | Schema evolution (deprecate fields) |
| Caching | HTTP caching (simple) | Complex (normalized cache) |
| File uploads | Native multipart support | Requires extensions |
| Error handling | HTTP status codes | Always 200, errors in response body |
| Learning curve | Low | Higher (schema, resolvers, query language) |

**The over-fetching / under-fetching problem:**

```javascript
// REST: Get user and their posts — 2 requests, extra data
const user = await fetch('/api/users/123');        // Returns all 20 user fields
const posts = await fetch('/api/users/123/posts'); // Separate request

// GraphQL: Single request, exact data
const data = await graphql(`
  query {
    user(id: "123") {
      name
      posts { title }
    }
  }
`);
```

**GraphQL client usage (Apollo Client):**

```javascript
import { useQuery, useMutation, gql } from '@apollo/client';

const GET_USERS = gql`
  query GetUsers($limit: Int) {
    users(limit: $limit) {
      id
      name
      email
    }
  }
`;

function UserList() {
  const { loading, error, data } = useQuery(GET_USERS, {
    variables: { limit: 10 }
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <ul>
      {data.users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

**When to use GraphQL:**

- Complex data requirements with nested relationships
- Multiple client types (web, mobile) with different data needs
- Rapid frontend iteration without backend changes
- APIs consumed by many teams

**When REST may be better:**

- Simple CRUD APIs
- File-heavy APIs (uploads/downloads)
- Strong HTTP caching requirements
- Smaller teams or simpler data models
- Public APIs (easier to document and consume)
