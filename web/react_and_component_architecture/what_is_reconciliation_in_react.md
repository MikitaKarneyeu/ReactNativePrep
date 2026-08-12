Reconciliation is React's algorithm for determining which parts of the UI need to be updated when state or props change. It is the process of comparing the new virtual DOM tree with the previous one (diffing) and applying the minimal necessary changes to the real DOM.

**How reconciliation works:**

When a component's state or props change, React:
1. Re-renders the component to produce a new virtual DOM tree
2. Compares the new tree with the previous tree (diffing)
3. Determines the minimal set of DOM operations needed
4. Applies those operations to the real DOM

**The diffing algorithm (two heuristics):**

**Rule 1: Different element types produce different trees:**

```jsx
// If the element type changes, React destroys the old tree and builds a new one
// Old: <div><Counter /></div>
// New: <span><Counter /></span>

// Counter is completely unmounted and remounted — all state is lost
```

**Rule 2: Keys identify which children changed:**

```jsx
// Without keys — React matches by position
<ul>
  <li>First</li>    // Position 0
  <li>Second</li>   // Position 1
</ul>

// After adding "Zero" at the beginning:
<ul>
  <li>Zero</li>     // Position 0 — React updates existing <li> from "First" to "Zero"
  <li>First</li>    // Position 1 — React updates from "Second" to "First"
  <li>Second</li>   // Position 2 — React creates new <li>
</ul>
// Result: 2 DOM updates + 1 creation instead of 1 insertion

// With keys — React matches by identity
<ul>
  <li key="a">First</li>
  <li key="b">Second</li>
</ul>

// After adding "Zero":
<ul>
  <li key="c">Zero</li>      // New key — React creates new <li>
  <li key="a">First</li>     // Same key — no change
  <li key="b">Second</li>    // Same key — no change
</ul>
// Result: 1 creation, 0 updates — more efficient
```

**Choosing good keys:**

```jsx
// ❌ Bad — using index as key
{items.map((item, index) => (
  <TodoItem key={index} item={item} />
))}

// ✅ Good — using stable, unique IDs
{items.map(item => (
  <TodoItem key={item.id} item={item} />
))}
```

When you use array indices as keys:
- Inserting, removing, or reordering items causes incorrect state in child components
- Components may be reused incorrectly, leading to stale data or bugs
- Only acceptable when the list is static and will never change

**Reconciliation in action:**

```jsx
function App() {
  const [showHeader, setShowHeader] = useState(true);

  return (
    <div>
      {showHeader && <Header />} {/* Mount/unmount based on condition */}
      <Content />
    </div>
  );
}

// Toggling showHeader mounts/unmounts Header, destroying its state
```

**Fragments and reconciliation:**

```jsx
// Fragments don't create DOM nodes but still participate in reconciliation
function List({ items }) {
  return (
    <>
      {items.map(item => (
        <Fragment key={item.id}>
          <dt>{item.term}</dt>
          <dd>{item.definition}</dd>
        </Fragment>
      ))}
    </>
  );
}
```

**React Fiber (React 16+):**

React Fiber reimagined reconciliation as an incremental process:

1. **Interruptible rendering** — React can pause rendering to handle user interactions
2. **Priority-based updates** — Urgent updates (user input) are prioritized over non-urgent ones (data loading)
3. **Concurrent features** — `useTransition`, `useDeferredValue`, and Suspense rely on Fiber's ability to prepare multiple versions of the UI

```javascript
const [isPending, startTransition] = useTransition();

function handleChange(e) {
  setInputValue(e.target.value);        // Urgent update
  startTransition(() => {
    setSearchResults(filterResults(e.target.value)); // Non-urgent update
  });
}
```

**Key takeaways:**

1. Use `key` props on list items with stable, unique identifiers
2. Avoid using array indices as keys when the list can change
3. Changing an element's type (`div` → `section`) destroys the subtree
4. Reconciliation is why React is performant — it minimizes expensive DOM operations
5. Understanding reconciliation helps explain why state "resets" in certain situations
