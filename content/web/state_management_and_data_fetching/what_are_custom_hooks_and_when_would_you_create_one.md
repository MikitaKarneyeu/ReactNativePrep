Custom hooks are JavaScript functions whose names start with `use` and that can call other hooks. They allow you to extract reusable stateful logic from components, making it shareable across multiple components without changing your component hierarchy.

**Creating a custom hook:**

```javascript
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored !== null ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

// Usage
function App() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  const [count, setCount] = useLocalStorage('count', 0);
}
```

**Common custom hook patterns:**

**Data fetching hook:**
```javascript
function useFetch(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    async function fetchData() {
      setLoading(true);
      try {
        const response = await fetch(url, {
          ...options,
          signal: controller.signal
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const result = await response.json();
        if (!cancelled) setData(result);
      } catch (err) {
        if (!cancelled && err.name !== 'AbortError') setError(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();
    return () => { cancelled = true; controller.abort(); };
  }, [url]);

  return { data, loading, error, refetch: () => {/* trigger refetch */} };
}
```

**Debounce hook:**
```javascript
function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// Usage
function SearchInput() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery) {
      searchAPI(debouncedQuery);
    }
  }, [debouncedQuery]);
}
```

**Media query hook:**
```javascript
function useMediaQuery(query) {
  const [matches, setMatches] = useState(
    () => window.matchMedia(query).matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const handler = (e) => setMatches(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

// Usage
function Sidebar() {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  return isDesktop ? <DesktopSidebar /> : <MobileSidebar />;
}
```

**When to create a custom hook:**

1. **Repeated logic** — The same useEffect/useState pattern appears in multiple components
2. **Complex state logic** — State management that involves multiple hooks and conditions
3. **External subscriptions** — WebSocket connections, event listeners, store subscriptions
4. **Browser APIs** — Wrapping browser APIs (geolocation, media queries, clipboard)
5. **Animation/timing** — Debouncing, throttling, intervals, animation frames

**When NOT to create a custom hook:**

1. The logic is used only once — premature abstraction adds complexity
2. The hook is just a wrapper with no added value
3. It doesn't use any hooks internally (just make it a regular function)
4. It would be clearer as a component

**Rules for custom hooks:**

1. Name must start with `use`
2. Can call other hooks (useState, useEffect, other custom hooks)
3. Should be pure functions (no side effects in the hook body — side effects go in useEffect)
4. Return values should be consistent (always the same type/shape)
5. Document the hook's API (parameters, return values, behavior)

```javascript
// Good: Clear API and documentation
/**
 * Tracks the online/offline status of the browser.
 * @returns {boolean} Whether the browser is currently online.
 */
function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}
```

Custom hooks are the primary mechanism for code reuse in modern React applications. They enable composition of behavior without the complexity of higher-order components or render props.
