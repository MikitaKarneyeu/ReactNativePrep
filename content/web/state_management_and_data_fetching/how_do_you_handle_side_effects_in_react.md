Side effects in React are operations that interact with things outside the React rendering process — data fetching, subscriptions, DOM manipulation, timers, logging, and other external system interactions. The `useEffect` hook is the primary tool for handling side effects in function components.

**Common side effects and patterns:**

**1. Data fetching:**
```javascript
useEffect(() => {
  let cancelled = false;
  const controller = new AbortController();

  async function fetchData() {
    setLoading(true);
    try {
      const res = await fetch(`/api/users/${id}`, { signal: controller.signal });
      if (!cancelled) {
        const data = await res.json();
        setUser(data);
      }
    } catch (err) {
      if (!cancelled && err.name !== 'AbortError') {
        setError(err);
      }
    } finally {
      if (!cancelled) setLoading(false);
    }
  }

  fetchData();
  return () => {
    cancelled = true;
    controller.abort();
  };
}, [id]);
```

**2. Event listeners:**
```javascript
useEffect(() => {
  const handleClick = (e) => {
    if (!e.target.closest('.dropdown')) {
      setDropdownOpen(false);
    }
  };
  document.addEventListener('click', handleClick);
  return () => document.removeEventListener('click', handleClick);
}, []);
```

**3. Timers and intervals:**
```javascript
useEffect(() => {
  const timer = setInterval(() => {
    setCount(prev => prev + 1);
  }, 1000);

  return () => clearInterval(timer);
}, []);
```

**4. WebSocket subscriptions:**
```javascript
useEffect(() => {
  const ws = new WebSocket('wss://api.example.com/ws');
  
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    setMessages(prev => [...prev, data]);
  };

  ws.onerror = (error) => console.error('WebSocket error:', error);

  return () => ws.close();
}, []);
```

**5. Document title and meta:**
```javascript
useEffect(() => {
  document.title = `${unreadCount} new messages`;
}, [unreadCount]);
```

**6. External library integration:**
```javascript
useEffect(() => {
  const chart = new Chart(canvasRef.current, {
    type: 'bar',
    data: chartData,
    options: chartOptions
  });

  return () => chart.destroy();
}, [chartData]);
```

**Cleanup patterns:**

```javascript
// Pattern 1: Boolean flag for async operations
useEffect(() => {
  let cancelled = false;
  fetchData().then(data => {
    if (!cancelled) setData(data);
  });
  return () => { cancelled = true; };
}, []);

// Pattern 2: AbortController for fetch
useEffect(() => {
  const controller = new AbortController();
  fetch(url, { signal: controller.signal }).then(/* ... */);
  return () => controller.abort();
}, [url]);

// Pattern 3: Return the unsubscribe function directly
useEffect(() => {
  return someStore.subscribe(handleChange);
}, []);

// Pattern 4: Multiple cleanups
useEffect(() => {
  const handler = () => { };
  const timer = setInterval(() => { }, 1000);
  
  window.addEventListener('resize', handler);
  
  return () => {
    window.removeEventListener('resize', handler);
    clearInterval(timer);
  };
}, []);
```

**Handling side effects outside components:**

For complex applications, side effects can be managed outside components using:

```javascript
// Custom hooks encapsulate side effects
function useWebSocket(url) {
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState('connecting');

  useEffect(() => {
    const ws = new WebSocket(url);
    ws.onopen = () => setStatus('connected');
    ws.onmessage = (e) => setMessages(prev => [...prev, JSON.parse(e.data)]);
    ws.onclose = () => setStatus('disconnected');
    return () => ws.close();
  }, [url]);

  return { messages, status };
}

// Data fetching hook
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(url)
      .then(res => res.json())
      .then(data => { if (!cancelled) setData(data); })
      .catch(err => { if (!cancelled) setError(err); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [url]);

  return { data, loading, error };
}
```

**Best practices:**

1. Always include cleanup for subscriptions, timers, and event listeners
2. Use AbortController for cancellable fetch requests
3. Keep effects focused — one effect per concern
4. Avoid effects for derived state — compute during render instead
5. Use libraries like React Query, SWR, or RTK Query for data fetching
6. Use `useLayoutEffect` for DOM measurements that must happen before paint
