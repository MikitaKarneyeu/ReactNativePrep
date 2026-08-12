Unnecessary re-renders are a common performance issue in React applications. A component re-renders when its parent re-renders, its state changes, or its context value changes — even if the rendered output would be the same. Here are strategies to prevent them.

**1. React.memo — Skip re-renders when props haven't changed:**

```javascript
const ExpensiveComponent = React.memo(function ExpensiveComponent({ data, onClick }) {
  console.log('ExpensiveComponent rendered');
  return <div onClick={onClick}>{data.name}</div>;
});

// With custom comparison
const ListItem = React.memo(function ListItem({ item, onSelect }) {
  return <li onClick={() => onSelect(item.id)}>{item.name}</li>;
}, (prevProps, nextProps) => {
  return prevProps.item.id === nextProps.item.id &&
         prevProps.item.name === nextProps.item.name;
});
```

**2. useCallback — Stabilize function references:**

```javascript
function Parent() {
  const [count, setCount] = useState(0);

  // ❌ New function on every render — breaks React.memo
  const handleClick = () => { console.log('clicked'); };

  // ✅ Same function reference unless deps change
  const handleClick = useCallback(() => {
    console.log('clicked');
  }, []);

  // ✅ With dependencies
  const handleItemClick = useCallback((id) => {
    console.log('Clicked item', id);
  }, []);

  return <MemoizedChild onClick={handleClick} onItemClick={handleItemClick} />;
}
```

**3. useMemo — Stabilize object and array references:**

```javascript
function Parent() {
  const [count, setCount] = useState(0);

  // ❌ New object on every render
  const config = { theme: 'dark', size: 'large' };

  // ✅ Same reference unless deps change
  const config = useMemo(() => ({ theme: 'dark', size: 'large' }), []);

  // ✅ Memoize derived data
  const filteredItems = useMemo(
    () => items.filter(item => item.active),
    [items]
  );

  return <MemoizedChild config={config} items={filteredItems} />;
}
```

**4. Context optimization — Split contexts:**

```javascript
// ❌ Single context — all consumers re-render on any change
const AppContext = createContext({ user, theme, notifications });

// ✅ Split by update frequency
const UserContext = createContext(null);      // Changes rarely
const ThemeContext = createContext('light');   // Changes rarely
const NotificationsContext = createContext([]); // Changes frequently
```

**5. State colocation — Move state closer to where it's used:**

```javascript
// ❌ State in parent causes all children to re-render
function Page() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div>
      <Header />                    {/* Re-renders unnecessarily */}
      <Content />                   {/* Re-renders unnecessarily */}
      <button onClick={() => setIsModalOpen(true)}>Open</button>
      {isModalOpen && <Modal />}
    </div>
  );
}

// ✅ State moved to the component that needs it
function Page() {
  return (
    <div>
      <Header />
      <Content />
      <ModalTrigger />
    </div>
  );
}

function ModalTrigger() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      <button onClick={() => setIsModalOpen(true)}>Open</button>
      {isModalOpen && <Modal />}
    </>
  );
}
```

**6. Children as props (composition):**

```javascript
// ❌ Children re-render when parent state changes
function Parent() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <ExpensiveTree /> {/* Re-renders */}
      <button onClick={() => setCount(c => c + 1)}>{count}</button>
    </div>
  );
}

// ✅ Children passed as props — parent re-renders but children don't
function Parent({ children }) {
  const [count, setCount] = useState(0);
  return (
    <div>
      {children}
      <button onClick={() => setCount(c => c + 1)}>{count}</button>
    </div>
  );
}

// Usage — ExpensiveTree is a prop, not affected by count changes
<Parent>
  <ExpensiveTree />
</Parent>
```

**7. Use `key` to force remount vs preserve state:**

```javascript
// Preserve state (same key)
<Child key="stable" />

// Force remount (different key) — useful for resetting state
<Child key={userId} />
```

**8. Avoid inline objects and functions in JSX:**

```javascript
// ❌ New references on every render
<Child style={{ color: 'red' }} onClick={() => {}} />

// ✅ Stable references
const style = useMemo(() => ({ color: 'red' }), []);
const onClick = useCallback(() => [], []);
<Child style={style} onClick={onClick} />
```

**Measuring re-renders:**

```javascript
// React DevTools — highlight re-renders
// Settings → Highlight updates when components render

// Custom hook to count renders
function useRenderCount() {
  const count = useRef(0);
  count.current++;
  useEffect(() => { console.log('Render count:', count.current); });
  return count.current;
}
```

**When to optimize:**

Don't optimize prematurely. Measure first with React DevTools Profiler. Focus on:
1. Components that render frequently (on every keystroke, mouse move)
2. Expensive components (complex trees, heavy computations)
3. Components near the top of the tree (affecting many descendants)
