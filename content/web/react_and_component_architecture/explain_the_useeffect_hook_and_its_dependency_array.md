`useEffect` is a React Hook that lets you synchronize a component with an external system or perform side effects. It runs after the component renders (and the browser paints), making it the primary way to handle data fetching, subscriptions, DOM manipulation, and other effects in function components.

**Basic syntax:**

```javascript
useEffect(() => {
  // Effect logic (runs after render)
  
  return () => {
    // Cleanup logic (runs before next effect and on unmount)
  };
}, [dependencies]);
```

**The dependency array controls when the effect runs:**

```javascript
// 1. No dependency array — runs after EVERY render
useEffect(() => {
  console.log('Runs after every render');
});

// 2. Empty array — runs only on MOUNT (and unmount for cleanup)
useEffect(() => {
  console.log('Runs once on mount');
  return () => console.log('Cleanup on unmount');
}, []);

// 3. With dependencies — runs when dependencies CHANGE
useEffect(() => {
  console.log('Runs when count or name changes');
}, [count, name]);
```

**How React compares dependencies:**

React uses `Object.is()` to compare each dependency to its previous value. This is similar to `===` but with special handling for `NaN`.

```javascript
// These trigger re-runs:
useEffect(() => {}, [1, 'hello', true]);        // Primitive values change
useEffect(() => {}, [newReference]);              // New object/array reference

// These do NOT trigger re-runs:
useEffect(() => {}, [42]);                        // Same primitive
useEffect(() => {}, [sameObjectRef]);             // Same reference
```

**Common patterns:**

**Data fetching:**
```javascript
useEffect(() => {
  let cancelled = false;
  
  async function fetchData() {
    setLoading(true);
    try {
      const response = await fetch(`/api/users/${userId}`);
      const data = await response.json();
      if (!cancelled) {
        setUser(data);
      }
    } catch (error) {
      if (!cancelled) setError(error);
    } finally {
      if (!cancelled) setLoading(false);
    }
  }
  
  fetchData();
  return () => { cancelled = true; };
}, [userId]); // Refetch when userId changes
```

**Event listeners:**
```javascript
useEffect(() => {
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') closeModal();
  };
  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, [closeModal]);
```

**Subscriptions:**
```javascript
useEffect(() => {
  const subscription = observable.subscribe(handleData);
  return () => subscription.unsubscribe();
}, [observable]);
```

**Document title:**
```javascript
useEffect(() => {
  document.title = `${count} items`;
}, [count]);
```

**Common pitfalls:**

**1. Missing dependencies:**
```javascript
// ❌ Missing userId — stale closure
useEffect(() => {
  fetchUser(userId); // userId might be stale
}, []); // ESLint warns: missing dependency 'userId'

// ✅ Include all dependencies
useEffect(() => {
  fetchUser(userId);
}, [userId]);
```

**2. Object/array dependencies causing infinite loops:**
```javascript
// ❌ New array reference on every render → infinite loop
useEffect(() => {
  doSomething(options);
}, [options]); // options is a new [] each render

// ✅ Stabilize reference with useMemo
const options = useMemo(() => ({ page, limit }), [page, limit]);
useEffect(() => {
  doSomething(options);
}, [options]);

// ✅ Or use individual dependencies
useEffect(() => {
  doSomething({ page, limit });
}, [page, limit]);
```

**3. useEffect vs useLayoutEffect:**
```javascript
// useEffect — runs AFTER paint (non-blocking)
useEffect(() => { /* after paint */ });

// useLayoutEffect — runs BEFORE paint (blocking, synchronous)
useLayoutEffect(() => { /* measure DOM, prevent flicker */ });
```

**`useEffect` cleanup timing:**

1. Cleanup from the **previous** effect runs before the **new** effect runs
2. Cleanup runs on **unmount**
3. Cleanup is optional — only needed if your effect creates something that needs teardown

```javascript
useEffect(() => {
  const subscription = api.subscribe(id);
  
  return () => {
    // This runs when:
    // 1. id changes (before the new effect)
    // 2. Component unmounts
    subscription.unsubscribe();
  };
}, [id]);
```

The `exhaustive-deps` ESLint rule ensures you include all dependencies, preventing stale closure bugs. If you need to intentionally exclude a dependency, use a ref or restructure your code.
