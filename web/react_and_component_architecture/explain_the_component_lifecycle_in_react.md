React components go through a lifecycle of mounting (being created and inserted into the DOM), updating (re-rendering due to props or state changes), and unmounting (being removed from the DOM). Understanding this lifecycle is essential for managing side effects, subscriptions, and cleanup.

**Class component lifecycle (for understanding legacy code):**

```javascript
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }

  // Mounting
  componentDidMount() {
    // Called after first render — DOM is ready
    // API calls, subscriptions, DOM manipulation
    this.fetchData();
  }

  // Updating
  componentDidUpdate(prevProps, prevState) {
    // Called after every re-render (not initial)
    // Compare prev props/state to current
    if (prevProps.id !== this.props.id) {
      this.fetchData(this.props.id);
    }
  }

  // Unmounting
  componentWillUnmount() {
    // Called before removal — cleanup
    // Cancel subscriptions, timers, abort requests
    this.subscription.unsubscribe();
  }

  render() {
    return <div>{this.state.count}</div>;
  }
}
```

**Function component lifecycle with hooks:**

```javascript
import { useState, useEffect, useLayoutEffect } from 'react';

function MyComponent({ id }) {
  const [data, setData] = useState(null);

  // Replaces componentDidMount, componentDidUpdate, and componentWillUnmount
  useEffect(() => {
    // Runs after render (mount + every update)
    const controller = new AbortController();
    
    async function fetchData() {
      const response = await fetch(`/api/data/${id}`, { signal: controller.signal });
      const result = await response.json();
      setData(result);
    }
    
    fetchData();

    // Cleanup function (replaces componentWillUnmount)
    return () => {
      controller.abort();
    };
  }, [id]); // Dependency array — only re-run when id changes

  // Runs synchronously after DOM mutations but before paint
  useLayoutEffect(() => {
    // Measure DOM, apply synchronous mutations
    const rect = element.getBoundingClientRect();
  }, []);

  return <div>{data?.name}</div>;
}
```

**The `useEffect` dependency array:**

```javascript
// Runs after EVERY render (no dependency array)
useEffect(() => { });

// Runs only on mount (empty dependency array)
useEffect(() => { }, []);

// Runs when dependencies change
useEffect(() => { }, [dep1, dep2]);

// Cleanup runs before next effect and on unmount
useEffect(() => {
  const handler = () => { };
  window.addEventListener('resize', handler);
  return () => window.removeEventListener('resize', handler);
}, []);
```

**Lifecycle phases in React 18:**

1. **Render phase** — React calls your component function. This should be pure (no side effects). May be called multiple times in concurrent mode.

2. **Commit phase** — React applies changes to the DOM. Three sub-phases:
   - `beforeMutation` — Before DOM updates
   - `Mutation` — DOM is updated
   - `Layout` — After DOM updates (useLayoutEffect runs here)

3. **Passive effects phase** — `useEffect` callbacks run after the browser paints. This is where most side effects should go.

**Common lifecycle patterns:**

```javascript
// Fetch data on mount or when props change
useEffect(() => {
  let cancelled = false;
  fetch(url).then(res => res.json()).then(data => {
    if (!cancelled) setData(data);
  });
  return () => { cancelled = true; };
}, [url]);

// Subscribe to external store
useEffect(() => {
  const unsubscribe = store.subscribe(handleChange);
  return unsubscribe;
}, []);

// Event listeners
useEffect(() => {
  const handler = (e) => { };
  window.addEventListener('keydown', handler);
  return () => window.removeEventListener('keydown', handler);
}, []);

// DOM measurement after render
useLayoutEffect(() => {
  const { height } = ref.current.getBoundingClientRect();
  setHeight(height);
}, [content]);
```

**`useEffect` vs `useLayoutEffect`:**

| Aspect | `useEffect` | `useLayoutEffect` |
|--------|-------------|-------------------|
| Timing | After paint (asynchronous) | After DOM mutation, before paint (synchronous) |
| Blocks painting | No | Yes |
| Use case | Most side effects | DOM measurements, preventing flicker |
| Performance impact | Lower | Higher (blocks visual update) |

Prefer `useEffect` unless you need to read layout or prevent a visual flicker.
