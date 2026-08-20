Nested routes in React Router allow you to create hierarchical layouts where parent routes render a shared layout component and child routes render inside that layout using the `<Outlet />` component. This enables complex page structures with shared navigation, sidebars, and headers.

**Basic nested routes (React Router v6):**

```jsx
import { Routes, Route, Outlet, Link, NavLink } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="users" element={<UsersLayout />}>
          <Route index element={<UsersList />} />
          <Route path=":id" element={<UserProfile />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

// Root layout — wraps all routes
function Layout() {
  return (
    <div className="app">
      <header>
        <nav>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/users">Users</NavLink>
        </nav>
      </header>
      <main>
        <Outlet /> {/* Child routes render here */}
      </main>
      <footer>Footer</footer>
    </div>
  );
}

// Users layout — wraps all /users/* routes
function UsersLayout() {
  return (
    <div className="users-page">
      <aside>
        <h2>Users</h2>
        <Link to="/users">All Users</Link>
      </aside>
      <div className="users-content">
        <Outlet /> {/* UsersList or UserProfile renders here */}
      </div>
    </div>
  );
}
```

**URL mapping:**

```
/            → Layout → Home
/about       → Layout → About
/users       → Layout → UsersLayout → UsersList
/users/123   → Layout → UsersLayout → UserProfile
/unknown     → Layout → NotFound
```

**Index routes:**

Index routes render when the parent's path matches exactly (no child path segment):

```jsx
<Route path="/dashboard" element={<DashboardLayout />}>
  <Route index element={<DashboardHome />} /> {/* /dashboard */}
  <Route path="analytics" element={<Analytics />} /> {/* /dashboard/analytics */}
  <Route path="settings" element={<Settings />} /> {/* /dashboard/settings */}
</Route>
```

**Sharing data with child routes via context:**

```jsx
function UsersLayout() {
  const { data: users, loading } = useFetch('/api/users');

  return (
    <div>
      <h1>Users ({users.length})</h1>
      <Outlet context={{ users, loading }} />
    </div>
  );
}

function UsersList() {
  const { users, loading } = useOutletContext();
  if (loading) return <Spinner />;
  return users.map(u => <UserCard key={u.id} user={u} />);
}
```

**Multiple outlets with named outlets:**

```jsx
<Routes>
  <Route path="/dashboard" element={<DashboardLayout />}>
    <Route index element={<DashboardMain />} />
    <Route path="settings" element={<Settings />} />
    <Route
      path="notifications"
      element={<Notifications />}
    />
  </Route>
</Routes>
```

**Protected nested routes:**

```jsx
function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Protected layout — all children require auth */}
      <Route element={<ProtectedLayout />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Route>

      {/* Admin-only layout */}
      <Route element={<ProtectedLayout allowedRoles={['admin']} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminHome />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>
      </Route>
    </Routes>
  );
}
```

**React Router v6.4+ data loading with nested routes:**

```jsx
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    loader: async () => {
      const user = await fetchUser();
      return { user };
    },
    children: [
      {
        path: 'users',
        element: <UsersLayout />,
        loader: async () => {
          const users = await fetchUsers();
          return { users };
        },
        children: [
          {
            index,
            element: <UsersList />
          },
          {
            path: ':id',
            element: <UserProfile />,
            loader: async ({ params }) => {
              const user = await fetchUser(params.id);
              return { user };
            }
          }
        ]
      }
    ]
  }
]);

function UsersLayout() {
  const { users } = useLoaderData();
  return (
    <div>
      <h1>Users</h1>
      <Outlet />
    </div>
  );
}
```

**Key concepts:**

1. **`<Outlet />`** — Renders the matched child route inside the parent layout
2. **Index routes** — Default child when the parent path matches exactly
3. **Layout routes** — Routes with an element but no path (just wrap children)
4. **Relative paths** — Child routes use relative paths (`users` instead of `/users`)
5. **Shared layouts** — Parent routes provide consistent UI across child routes
6. **Data sharing** — Use `useOutletContext()` to pass data from parent to child
