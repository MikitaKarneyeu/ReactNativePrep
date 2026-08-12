TanStack Query (formerly React Query) is a powerful data-fetching and server-state management library for React. It handles caching, background refetching, stale-while-revalidate, pagination, infinite scrolling, and more, eliminating the need to manually manage `loading`, `error`, and `data` states.

**Basic usage:**

```jsx
import { useQuery, useMutation, QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserList />
    </QueryClientProvider>
  );
}

function UserList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: () => fetch('/api/users').then(res => res.json())
  });

  if (isLoading) return <Spinner />;
  if (error) return <Error message={error.message} />;

  return (
    <ul>
      {data.map(user => <li key={user.id}>{user.name}</li>)}
    </ul>
  );
}
```

**Key features:**

**Automatic caching and refetching:**
```javascript
const { data } = useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId),
  staleTime: 5 * 60 * 1000,    // Data is fresh for 5 minutes
  gcTime: 10 * 60 * 1000,      // Cache garbage collected after 10 minutes
  refetchOnWindowFocus: true,   // Refetch when user returns to tab
  retry: 3                      // Retry failed requests 3 times
});
```

**Dependent queries:**
```javascript
const { data: user } = useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId)
});

const { data: posts } = useQuery({
  queryKey: ['posts', userId],
  queryFn: () => fetchPosts(userId),
  enabled: !!user // Only fetch after user is loaded
});
```

**Mutations:**
```javascript
const mutation = useMutation({
  mutationFn: (newUser) => fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newUser)
  }),
  onSuccess: () => {
    // Invalidate and refetch
    queryClient.invalidateQueries({ queryKey: ['users'] });
  },
  onError: (error) => {
    toast.error(error.message);
  }
});

// Usage
mutation.mutate({ name: 'Alice', email: 'alice@example.com' });
```

**Pagination:**
```javascript
function UserList() {
  const [page, setPage] = useState(1);

  const { data, isPlaceholderData } = useQuery({
    queryKey: ['users', page],
    queryFn: () => fetchUsers(page),
    placeholderData: keepPreviousData // Show previous page while loading new one
  });

  return (
    <div>
      {data?.users.map(user => <User key={user.id} user={user} />)}
      <button onClick={() => setPage(p => p - 1)} disabled={page === 1}>Prev</button>
      <button onClick={() => setPage(p => p + 1)} disabled={isPlaceholderData}>Next</button>
    </div>
  );
}
```

**Why use TanStack Query instead of manual useEffect + fetch:**

| Manual approach | TanStack Query |
|----------------|---------------|
| Manual loading/error states | Automatic |
| No caching | Built-in cache with stale/revalidate |
| No background refetching | Automatic background updates |
| Manual deduplication | Automatic request deduplication |
| No retry logic | Configurable retries |
| No pagination/infinite scroll | Built-in pagination support |
| No window focus refetching | Automatic |
| Complex dependent queries | Simple `enabled` option |
| Race conditions | Handled automatically |

**Why it's preferred for server state:**

Server state is fundamentally different from client state:
- It's asynchronous
- It's shared across components
- It can become stale
- It needs to be synchronized with the server

TanStack Query treats server state as a cache and provides tools to keep it fresh. Client state (form inputs, UI toggles, modals) should stay in React state or other client-side solutions.

**DevTools:**
```jsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <App />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

TanStack Query is the de facto standard for data fetching in React applications. It dramatically simplifies data-fetching code and provides an excellent user experience through caching and background updates.
