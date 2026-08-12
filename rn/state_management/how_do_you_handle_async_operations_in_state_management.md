Async operations like API calls, database queries, and file I/O need to be integrated with your state management to update the UI with loading states, results, and errors. The approach depends on your state management library.

**With Redux Toolkit using createAsyncThunk:**

```tsx
const fetchUsers = createAsyncThunk('users/fetch', async () => {
  const response = await fetch('https://api.example.com/users');
  return response.json();
});

const usersSlice = createSlice({
  name: 'users',
  initialState: { data: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// Usage
function UsersScreen() {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.users);

  useEffect(() => { dispatch(fetchUsers()); }, []);

  if (loading) return <ActivityIndicator />;
  if (error) return <ErrorView message={error} />;
  return <UserList users={data} />;
}
```

**With Zustand:**

```tsx
const useUserStore = create((set) => ({
  users: [],
  loading: false,
  error: null,
  fetchUsers: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('https://api.example.com/users');
      const data = await response.json();
      set({ users: data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
}));

// Usage
function UsersScreen() {
  const { users, loading, error, fetchUsers } = useUserStore();

  useEffect(() => { fetchUsers(); }, []);
}
```

**With TanStack Query (recommended for server state):**

```tsx
function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => fetch('/api/users').then((res) => res.json()),
    staleTime: 5 * 60 * 1000,
    retry: 3,
  });
}

function UsersScreen() {
  const { data, isLoading, error, refetch } = useUsers();

  if (isLoading) return <ActivityIndicator />;
  if (error) return <ErrorView message={error.message} />;
  return <UserList users={data} onRefresh={refetch} />;
}
```

**Optimistic updates:**

```tsx
// TanStack Query
const mutation = useMutation({
  mutationFn: (newTodo) => axios.post('/todos', newTodo),
  onMutate: async (newTodo) => {
    await queryClient.cancelQueries({ queryKey: ['todos'] });
    const previous = queryClient.getQueryData(['todos']);
    queryClient.setQueryData(['todos'], (old) => [...old, newTodo]);
    return { previous };
  },
  onError: (err, newTodo, context) => {
    queryClient.setQueryData(['todos'], context.previous);
  },
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ['todos'] });
  },
});
```

**Best practices:**
- Separate server state (API data) from client state (UI state, preferences)
- Use TanStack Query for server state—it handles caching, deduplication, and background refetching automatically
- Use your state manager (Redux/Zustand) only for client-side state
- Always handle loading, error, and empty states
- Cancel in-flight requests when components unmount
- Implement retry logic for transient failures
