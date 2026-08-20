React Context provides a way to pass data through the component tree without having to pass props manually at every level (prop drilling). It is designed for data that is considered "global" for a subtree of components — themes, user authentication, locale, or any shared state.

**Creating a context:**

```javascript
import { createContext, useContext, useState } from 'react';

// Create context with a default value
const ThemeContext = createContext('light');
const AuthContext = createContext(null);
```

**Providing context:**

```jsx
function App() {
  const [theme, setTheme] = useState('light');
  const [user, setUser] = useState(null);

  return (
    <ThemeContext.Provider value={theme}>
      <AuthContext.Provider value={{ user, setUser }}>
        <Layout />
      </AuthContext.Provider>
    </ThemeContext.Provider>
  );
}
```

**Consuming context:**

```jsx
// Method 1: useContext hook (recommended for function components)
function ThemedButton() {
  const theme = useContext(ThemeContext);
  return <button className={`btn-${theme}`}>Click me</button>;
}

// Method 2: Context.Consumer (for class components or when you need the value in JSX)
function ThemedButton() {
  return (
    <ThemeContext.Consumer>
      {theme => <button className={`btn-${theme}`}>Click me</button>}
    </ThemeContext.Consumer>
  );
}
```

**Context with state management pattern:**

```jsx
// auth-context.jsx
const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (credentials) => {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    const data = await response.json();
    setUser(data.user);
  };

  const logout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    setUser(null);
  };

  const value = { user, loading, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

export { AuthProvider, useAuth };
```

**When to use Context:**

1. **Theme switching** — Light/dark mode, custom color schemes
2. **Authentication** — Current user, login/logout functions
3. **Locale/i18n** — Language, date format, translations
4. **Routing** — Current route, navigation functions (React Router uses context)
5. **Any data needed by many components** at different nesting levels

**When NOT to use Context:**

1. **Frequently changing values** — Context re-renders all consumers when the value changes. For high-frequency updates (mouse position, animation state), use `useSyncExternalStore` or state management libraries instead.
2. **Complex state logic** — If state updates have many branches or depend on previous state in complex ways, use `useReducer` or a state management library.
3. **Deeply nested frequent updates** — Context triggers re-renders in all consumers. If only a few consumers need the update, this causes unnecessary re-renders.

**Performance optimization:**

```jsx
// Split context to reduce unnecessary re-renders
const UserContext = createContext(null);
const UserDispatchContext = createContext(null);

function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  return (
    <UserContext.Provider value={user}>
      <UserDispatchContext.Provider value={setUser}>
        {children}
      </UserDispatchContext.Provider>
    </UserContext.Provider>
  );
}

// Components that only dispatch won't re-render when user changes
function LogoutButton() {
  const setUser = useContext(UserDispatchContext); // Only re-renders if setUser changes (never)
  return <button onClick={() => setUser(null)}>Logout</button>;
}
```

**Context vs state management library:**

| Aspect | Context | Redux/Zustand/Jotai |
|--------|---------|---------------------|
| Setup | None (built-in) | Requires library |
| Boilerplate | Minimal | Varies |
| Re-render optimization | Manual splitting | Built-in selectors |
| DevTools | Limited | Excellent |
| Middleware | None | Built-in (thunks, sagas) |
| Best for | Simple global state | Complex application state |
