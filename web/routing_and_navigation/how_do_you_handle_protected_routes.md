Protected routes are routes that require authentication or specific authorization to access. In React applications, you implement protected routes by creating wrapper components that check the user's authentication status and either render the protected content or redirect to a login page.

**Basic protected route pattern:**

```jsx
import { Navigate, useLocation } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Spinner />;

  if (!user) {
    // Redirect to login, preserving the intended destination
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

// Usage in routes
<Routes>
  <Route path="/login" element={<Login />} />
  <Route
    path="/dashboard"
    element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    }
  />
</Routes>
```

**Role-based access control:**

```jsx
function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Spinner />;

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

// Usage
<Route
  path="/admin"
  element={
    <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
      <AdminPanel />
    </ProtectedRoute>
}
/>

<Route
  path="/settings"
  element={
    <ProtectedRoute allowedRoles={['admin']}>
      <Settings />
    </ProtectedRoute>
}
/>
```

**After login redirect:**

```jsx
function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (credentials) => {
    await login(credentials);
    navigate(from, { replace: true }); // Redirect to originally requested page
  };

  return <LoginForm onSubmit={handleSubmit} />;
}
```

**Layout-based protection (nested routes):**

```jsx
<Routes>
  {/* Public routes */}
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />

  {/* Protected layout — all children are protected */}
  <Route element={<ProtectedLayout />}>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/profile" element={<Profile />} />
    <Route path="/settings" element={<Settings />} />
  </Route>

  {/* Admin-only layout */}
  <Route element={<ProtectedLayout allowedRoles={['admin']} />}>
    <Route path="/admin" element={<AdminPanel />} />
    <Route path="/admin/users" element={<AdminUsers />} />
  </Route>
</Routes>

function ProtectedLayout({ allowedRoles }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Spinner />;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
```

**React Router v6.4+ data loading protection:**

```jsx
const router = createBrowserRouter([
  {
    path: '/dashboard',
    element: <Dashboard />,
    loader: async () => {
      const user = await getAuthUser();
      if (!user) throw redirect('/login');
      return user;
    }
  }
]);
```

**Handling token expiration:**

```javascript
// Axios interceptor for automatic token refresh
axios.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { token } = await refreshToken();
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return axios(originalRequest);
      } catch (refreshError) {
        // Redirect to login on refresh failure
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
```

**Best practices:**

1. **Always check authentication on the server too** — Client-side protection is for UX, not security
2. **Show loading states** — Don't flash the login page while checking auth
3. **Preserve intended destination** — Redirect back after login
4. **Handle token expiration** — Refresh tokens or redirect to login
5. **Use route-level protection** — Keep protection logic centralized in route definitions
6. **Separate authentication from authorization** — Check both (logged in + has permission)
