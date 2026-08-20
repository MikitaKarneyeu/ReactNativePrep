`useCallback` and `useMemo` are React hooks for memoization — they cache values between renders to avoid recalculating or recreating them unnecessarily. They are primarily used as performance optimizations.

**`useMemo`** — Memoizes a computed value:

```javascript
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

The function runs during rendering (not in an effect). React caches the return value and only recalculates when dependencies change.

```javascript
function ProductList({ products, filter }) {
  // ❌ Expensive filter runs on every render
  const filtered = products.filter(p => p.category === filter && p.price < 100);

  // ✅ Only recalculates when products or filter change
  const filtered = useMemo(
    () => products.filter(p => p.category === filter && p.price < 100),
    [products, filter]
  );

  // ✅ Memoize expensive sort
  const sorted = useMemo(
    () => [...filtered].sort((a, b) => a.price - b.price),
    [filtered]
  );

  return sorted.map(p => <Product key={p.id} product={p} />);
}
```

**`useCallback`** — Memoizes a function reference:

```javascript
const memoizedFn = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
```

`useCallback(fn, deps)` is equivalent to `useMemo(() => fn, deps)`. It returns a cached function reference.

```javascript
function Parent() {
  const [count, setCount] = useState(0);

  // ❌ New function on every render
  const handleClick = (id) => {
    console.log('Clicked', id);
  };

  // ✅ Same function reference unless deps change
  const handleClick = useCallback((id) => {
    console.log('Clicked', id);
  }, []);

  return <MemoizedChild onClick={handleClick} />;
}

const MemoizedChild = React.memo(({ onClick }) => {
  console.log('Child rendered');
  return <button onClick={() => onClick(1)}>Click</button>;
});
```

**When to use `useMemo`:**

1. **Expensive computations** — Filtering, sorting, transforming large datasets
2. **Referential equality** — When you need a stable object/array reference for child components or effects
3. **Derived state** — Computing values from other state/props

```javascript
// Referential stability
const options = useMemo(() => ({ sortBy: 'name', order: 'asc' }), []);

// Without useMemo, options is a new object every render, causing the effect to re-run
useEffect(() => {
  fetchData(options);
}, [options]); // Would re-run every render without useMemo
```

**When to use `useCallback`:**

1. **Passing callbacks to memoized children** — Prevents React.memo from failing
2. **Dependencies for other hooks** — When a function is a dependency of useEffect or another hook
3. **Referencing in context** — When passing functions through context

```javascript
// Stabilizing callbacks for memoized children
const TodoList = React.memo(({ todos, onToggle, onDelete }) => {
  return todos.map(todo => (
    <TodoItem key={todo.id} todo={todo} onToggle={onToggle} onDelete={onDelete} />
  ));
});

function TodoApp() {
  const [todos, setTodos] = useState([]);

  const handleToggle = useCallback((id) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  }, []);

  const handleDelete = useCallback((id) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  }, []);

  return <TodoList todos={todos} onToggle={handleToggle} onDelete={handleDelete} />;
}
```

**When NOT to use them:**

```javascript
// ❌ Unnecessary — primitive values are compared by value, not reference
const fullName = useMemo(() => `${first} ${last}`, [first, last]);
// Just use: const fullName = `${first} ${last}`;

// ❌ Unnecessary — the function is simple and the child isn't memoized
const handleClick = useCallback(() => setCount(c => c + 1), []);
// Just use: const handleClick = () => setCount(c => c + 1);

// ❌ Unnecessary — the component isn't wrapped in React.memo
const Child = ({ onClick }) => <button onClick={onClick}>Click</button>;
// useCallback has no benefit here
```

**Key points:**

- `useMemo` and `useCallback` are optimizations, not requirements
- They have a cost: memory for storing cached values, comparison cost on each render
- Only use them when there's a measurable performance issue
- Profile with React DevTools before adding memoization
- They work best in combination with `React.memo` on child components
- Never use them to "fix" bugs — they should only affect performance
