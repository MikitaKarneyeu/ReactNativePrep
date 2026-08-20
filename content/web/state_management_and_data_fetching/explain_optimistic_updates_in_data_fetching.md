Optimistic updates are a UI pattern where the interface is updated immediately to reflect the expected result of an action, before the server confirms the change. This makes the application feel instant and responsive, as the user sees the result of their action without waiting for a network round trip.

**How optimistic updates work:**

1. User performs an action (e.g., likes a post, adds a todo)
2. UI updates immediately (optimistic state)
3. Request is sent to the server in the background
4. On success → confirm the optimistic state (usually no-op)
5. On failure → roll back to the previous state and show an error

**With TanStack Query:**

```javascript
const queryClient = useQueryClient();

const mutation = useMutation({
  mutationFn: (newTodo) => fetch('/api/todos', {
    method: 'POST',
    body: JSON.stringify(newTodo)
  }),

  // Called before mutationFn — optimistically update the cache
  onMutate: async (newTodo) => {
    // Cancel outgoing refetches to prevent overwriting optimistic update
    await queryClient.cancelQueries({ queryKey: ['todos'] });

    // Snapshot the previous value for rollback
    const previousTodos = queryClient.getQueryData(['todos']);

    // Optimistically update the cache
    queryClient.setQueryData(['todos'], (old) => [
      ...old,
      { ...newTodo, id: 'temp-id', completed: false }
    ]);

    // Return context with snapshot for rollback
    return { previousTodos };
  },

  // On error — roll back to the snapshot
  onError: (err, newTodo, context) => {
    queryClient.setQueryData(['todos'], context.previousTodos);
    toast.error('Failed to add todo');
  },

  // Always refetch after error or success to sync with server
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ['todos'] });
  }
});
```

**Optimistic toggle example:**

```javascript
const mutation = useMutation({
  mutationFn: ({ id, completed }) => fetch(`/api/todos/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ completed })
  }),

  onMutate: async ({ id, completed }) => {
    await queryClient.cancelQueries({ queryKey: ['todos'] });
    const previousTodos = queryClient.getQueryData(['todos']);

    queryClient.setQueryData(['todos'], (old) =>
      old.map(todo =>
        todo.id === id ? { ...todo, completed } : todo
      )
    );

    return { previousTodos };
  },

  onError: (err, variables, context) => {
    queryClient.setQueryData(['todos'], context.previousTodos);
  },

  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ['todos'] });
  }
});

// Usage
<button onClick={() => mutation.mutate({ id: 1, completed: !todo.completed })}>
  {todo.completed ? '✓' : '○'} {todo.title}
</button>
```

**Optimistic delete:**

```javascript
const mutation = useMutation({
  mutationFn: (id) => fetch(`/api/todos/${id}`, { method: 'DELETE' }),

  onMutate: async (id) => {
    await queryClient.cancelQueries({ queryKey: ['todos'] });
    const previousTodos = queryClient.getQueryData(['todos']);

    queryClient.setQueryData(['todos'], (old) =>
      old.filter(todo => todo.id !== id)
    );

    return { previousTodos };
  },

  onError: (err, id, context) => {
    queryClient.setQueryData(['todos'], context.previousTodos);
    toast.error('Failed to delete');
  },

  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ['todos'] });
  }
});
```

**Handling the temporary ID problem:**

When adding items optimistically, you create an item with a temporary ID. When the server responds with the real ID, you need to reconcile:

```javascript
onMutate: async (newTodo) => {
  await queryClient.cancelQueries({ queryKey: ['todos'] });
  const previousTodos = queryClient.getQueryData(['todos']);

  queryClient.setQueryData(['todos'], (old) => [
    ...old,
    { ...newTodo, id: crypto.randomUUID(), isOptimistic: true }
  ]);

  return { previousTodos };
},

onSuccess: (serverTodo, variables, context) => {
  // Replace the optimistic item with the server response
  queryClient.setQueryData(['todos'], (old) =>
    old.map(todo =>
      todo.id === variables.tempId ? serverTodo : todo
    )
  );
}
```

**When to use optimistic updates:**

- Actions that are very likely to succeed (toggles, likes, comments)
- Actions where instant feedback significantly improves UX
- High-latency connections where waiting would feel slow

**When NOT to use optimistic updates:**

- Actions with complex side effects that are hard to predict
- Actions that trigger email notifications or payments
- Actions where an incorrect optimistic state could cause user confusion
- When rollback would be disruptive

**Visual indicator for optimistic state:**

```jsx
function TodoItem({ todo }) {
  return (
    <li className={todo.isOptimistic ? 'opacity-50' : ''}>
      {todo.title}
      {todo.isOptimistic && <Spinner size="sm" />}
    </li>
  );
}
```

Optimistic updates are a powerful UX pattern. Combined with TanStack Query's mutation API, they provide a robust way to implement instant feedback with proper error handling and rollback.
