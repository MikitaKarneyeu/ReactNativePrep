React Hooks are functions that let you use state and other React features in function components. Introduced in React 16.8, hooks eliminated the need for class components and provided a more composable way to reuse stateful logic.

**Built-in hooks:**

```javascript
// State hooks
const [state, setState] = useState(initialValue);
const [state, dispatch] = useReducer(reducer, initialValue);
const ref = useRef(initialValue);
const [value, setValue] = useState(() => expensiveComputation());

// Context
const value = useContext(MyContext);

// Effect hooks
useEffect(() => { /* side effect */ }, [deps]);
useLayoutEffect(() => { /* sync side effect */ }, [deps]);

// Performance
const memoized = useMemo(() => computeValue(a, b), [a, b]);
const memoizedFn = useCallback(() => doSomething(a), [a]);

// Ref
const ref = useRef(initialValue);
useImperativeHandle(ref, () => ({ /* custom methods */ }));

// Other
useId();                        // Generate unique IDs
useTransition();                // Mark state updates as low priority
useDeferredValue(value);        // Defer re-rendering for non-urgent updates
useSyncExternalStore(subscribe, getSnapshot); // Subscribe to external stores
```

**Rules of Hooks:**

**1. Only call hooks at the top level:**

```javascript
// ❌ WRONG — inside a conditional
if (isLoggedIn) {
  const [user, setUser] = useState(null);
}

// ❌ WRONG — inside a loop
for (let i = 0; i < items.length; i++) {
  const [selected, setSelected] = useState(false);
}

// ❌ WRONG — after a return statement
function Component() {
  if (loading) return <Spinner />;
  const [data, setData] = useState([]); // Won't be called on loading render
}

// ✅ CORRECT — always at the top level
function Component() {
  const [user, setUser] = useState(null);
  const [data, setData] = useState([]);

  if (loading) return <Spinner />;
  // Use user, data below
}
```

**2. Only call hooks from React functions:**

```javascript
// ✅ Call from function components
function MyComponent() {
  const [count, setCount] = useState(0);
}

// ✅ Call from custom hooks
function useCounter() {
  const [count, setCount] = useState(0);
  return { count, increment: () => setCount(c => c + 1) };
}

// ❌ WRONG — from regular functions
function helper() {
  const value = useContext(MyContext); // Not a component or hook
}
```

**Why these rules exist:**

React relies on the **call order** of hooks to associate state with the correct hook. Each render, React matches hooks in the order they were called. If the order changes (due to conditional hooks), React can't match state to the right hook, causing bugs.

```
Render 1: useState → index 0 (name), useState → index 1 (email), useEffect → index 2
Render 2: useState → index 0 (name), useEffect → index 1 (WRONG - email's slot!)
```

**Custom hooks:**

Custom hooks are functions that start with `use` and can call other hooks. They allow you to extract reusable stateful logic:

```javascript
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

// Usage
function App() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');
}
```

**ESLint plugin:** The `eslint-plugin-react-hooks` package enforces hook rules. It should be included in every React project:

```json
{
  "plugins": ["react-hooks"],
  "rules": {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

Hooks fundamentally changed how React code is written, enabling better code reuse through custom hooks, simpler component logic, and eliminating the complexity of class component lifecycle methods.
