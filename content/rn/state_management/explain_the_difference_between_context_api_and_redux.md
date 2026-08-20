Context API and Redux both solve the problem of sharing state across components without prop drilling, but they differ significantly in architecture, performance characteristics, and feature set.

**Context API** is a built-in React feature for passing data through the component tree:

```tsx
const ThemeContext = createContext('light');

function App() {
  const [theme, setTheme] = useState('light');
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <ChildComponent />
    </ThemeContext.Provider>
  );
}

function ChildComponent() {
  const { theme } = useContext(ThemeContext);
}
```

**Redux** is a standalone state management library with a centralized store:

```tsx
const store = configureStore({ reducer: rootReducer });

function App() {
  return (
    <Provider store={store}>
      <ChildComponent />
    </Provider>
  );
}

function ChildComponent() {
  const theme = useSelector((state) => state.theme);
  const dispatch = useDispatch();
}
```

**Key differences:**

| Aspect | Context API | Redux |
|---|---|---|
| State location | Distributed across providers | Single centralized store |
| Update mechanism | Re-renders all consumers on change | Selective re-renders via selectors |
| Boilerplate | Minimal | More code (actions, reducers, slices) |
| Devtools | No built-in devtools | Redux DevTools (time-travel, action logging) |
| Middleware | None built-in | Thunk, Saga, middleware ecosystem |
| Performance at scale | Can cause unnecessary re-renders | Optimized with selectors and memoization |
| Async state | Manual (useEffect + state) | Built-in via middleware or createAsyncThunk |

**The performance issue with Context**: When a Context value changes, ALL consumers re-render, even if they only use a portion of the value. This is fine for low-frequency updates like themes or locale, but problematic for frequently changing state like form inputs or real-time data.

```tsx
// This causes ALL consumers to re-render when count changes
const AppContext = createContext({ count: 0, theme: 'light', user: null });

function ThemeDisplay() {
  const { theme } = useContext(AppContext);
  // Re-renders when count changes, even though it only uses theme
}
```

**Redux avoids this** with selectors that only trigger re-renders when the selected slice changes:

```tsx
function ThemeDisplay() {
  const theme = useSelector((state) => state.theme);
  // Only re-renders when theme changes
}
```

**When to use Context:**
- Simple global values: theme, locale, auth status
- Low-frequency updates
- Small apps where the overhead of Redux isn't justified
- Feature-specific state that doesn't need to be truly global

**When to use Redux:**
- Complex state shared across many unrelated components
- Need for time-travel debugging and action logging
- Complex async flows (middleware)
- Large teams that benefit from the structured Redux pattern
- Need for state persistence, undo/redo, or optimistic updates

**Hybrid approach**: Many apps use both—Context for simple app-level concerns (theme, locale) and Redux (or Zustand) for complex feature state. TanStack Query handles server state separately.
