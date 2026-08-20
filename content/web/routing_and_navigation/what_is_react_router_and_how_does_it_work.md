React Router is the standard routing library for React. It enables navigation between different views (components) in a React application while maintaining the URL and browser history. It provides a declarative way to define routes, nested layouts, and navigation.

**Basic setup (React Router v6):**

```jsx
import { BrowserRouter, Routes, Route, Link, NavLink } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <nav>
        <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink>
        <NavLink to="/about">About</NavLink>
        <NavLink to="/users">Users</NavLink>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/users" element={<Users />} />
        <Route path="/users/:id" element={<UserProfile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
```

**Route parameters:**

```jsx
// Route definition
<Route path="/users/:id" element={<UserProfile />} />

// Accessing params
function UserProfile() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const sortBy = searchParams.get('sort');

  return <div>User {id}, sorted by {sortBy}</div>;
}
```

**Programmatic navigation:**

```jsx
import { useNavigate, Navigate } from 'react-router-dom';

function LoginForm() {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(credentials);
    navigate('/dashboard');         // Navigate to a route
    navigate(-1);                   // Go back
    navigate('/search', { replace: true }); // Replace current entry
  };
}

// Redirect component
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
```

**Nested routes:**

```jsx
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

function Layout() {
  return (
    <div>
      <Header />
      <Outlet /> {/* Child routes render here */}
      <Footer />
    </div>
  );
}

function UsersLayout() {
  return (
    <div>
      <h1>Users</h1>
      <Outlet />
    </div>
  );
}
```

**Data loading (React Router v6.4+):**

```jsx
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: 'users/:id',
        element: <UserProfile />,
        loader: async ({ params }) => {
          const user = await fetchUser(params.id);
          if (!user) throw new Response('Not Found', { status: 404 });
          return user;
        },
        errorElement: <ErrorBoundary />
      },
      {
        path: 'users',
        action: async ({ request }) => {
          const formData = await request.formData();
          return createUser(Object.fromEntries(formData));
        }
      }
    ]
  }
]);

function UserProfile() {
  const user = useLoaderData();
  return <div>{user.name}</div>;
}
```

**Key React Router hooks:**

```javascript
useParams();           // Route parameters ({ id: '123' })
useSearchParams();     // URL search parameters (?page=2&sort=name)
useNavigate();         // Programmatic navigation
useLocation();         // Current location object
useMatch();            // Check if a pattern matches the current URL
useOutlet();           // Render child routes
useOutletContext();    // Share data with child routes
useLoaderData();       // Data from the route's loader
useActionData();       // Data from the route's action
useNavigation();       // Navigation state (loading, idle, submitting)
```

**React Router features:**

1. **Declarative routing** — Routes defined as JSX
2. **Nested layouts** — Parent routes wrap child routes with `<Outlet />`
3. **Data loading** — Load data before rendering the route
4. **Actions** — Handle form submissions at the route level
5. **Lazy loading** — Code-split routes with `React.lazy`
6. **Error boundaries** — Handle errors at the route level
7. **Relative links** — Links relative to the current route
8. **Route guards** — Protect routes with authentication checks

React Router is the most widely used routing solution for React applications and is actively maintained by the Remix team.
