Global state in React is state that needs to be shared across many components at different levels of the component tree. There are several approaches, each with different trade-offs in complexity, performance, and developer experience.

**1. React Context + useReducer:**

```jsx
// StateContext.jsx
const StateContext = createContext();
const DispatchContext = createContext();

function stateReducer(state, action) {
  switch (action.type) {
    case 'SET_USER': return { ...state, user: action.payload };
    case 'SET_THEME': return { ...state, theme: action.payload };
    case 'LOGOUT': return { ...state, user: null };
    default: return state;
  }
}

function StateProvider({ children }) {
  const [state, dispatch] = useReducer(stateReducer, {
    user: null,
    theme: 'light'
  });

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>
        {children}
      </StateContext.Provider>
    </DispatchContext.Provider>
  );
}

// Split hooks to minimize re-renders
function useState() {
  const context = useContext(StateContext);
  if (!context) throw new Error('useState must be within StateProvider');
  return context;
}

function useDispatch() {
  const context = useContext(DispatchContext);
  if (!context) throw new Error('useDispatch must be within StateProvider');
  return context;
}
```

**Best for:** Small to medium apps, simple global state (auth, theme).

**2. Zustand (minimal external library):**

```javascript
import { create } from 'zustand';

const useStore = create((set, get) => ({
  count: 0,
  user: null,
  increment: () => set(state => ({ count: state.count + 1 })),
  setUser: (user) => set({ user }),
  fetchUser: async (id) => {
    const response = await fetch(`/api/users/${id}`);
    const user = await response.json();
    set({ user });
  }
}));

// Usage — only re-renders when selected state changes
function Counter() {
  const count = useStore(state => state.count);
  const increment = useStore(state => state.increment);
  return <button onClick={increment}>{count}</button>;
}
```

**Best for:** Medium apps, minimal boilerplate, excellent performance.

**3. Redux Toolkit (for complex applications):**

```javascript
import { createSlice, configureStore } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: { data: null, loading: false },
  reducers: {
    setUser: (state, action) => { state.data = action.payload; },
    setLoading: (state, action) => { state.loading = action.payload; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => { state.loading = true; })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      });
  }
});

const store = configureStore({
  reducer: { user: userSlice.reducer }
});
```

**Best for:** Large applications, complex state logic, teams that need DevTools and middleware.

**4. Jotai (atomic state):**

```javascript
import { atom, useAtom } from 'jotai';

const countAtom = atom(0);
const userAtom = atom(null);
const derivedAtom = atom((get) => get(countAtom) * 2);

function Counter() {
  const [count, setCount] = useAtom(countAtom);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

**Best for:** Fine-grained reactivity, many independent pieces of state.

**Choosing the right approach:**

| Approach | Complexity | Boilerplate | Performance | DevTools |
|----------|-----------|-------------|-------------|----------|
| Context + useReducer | Low | Minimal | OK (re-renders all consumers) | Limited |
| Zustand | Low | Minimal | Excellent (selectors) | Basic |
| Redux Toolkit | Medium | Moderate | Excellent | Excellent |
| Jotai | Low | Minimal | Excellent | Basic |
| TanStack Query (server state) | Low | Minimal | Excellent | Excellent |

**Key principles:**

1. **Separate server state from client state** — Use TanStack Query for server state (API data), and client state solutions for UI state
2. **Keep state as local as possible** — Not everything needs to be global
3. **Use selectors** to prevent unnecessary re-renders (Zustand, Redux)
4. **Split contexts** if different parts of the state update at different frequencies
5. **Consider URL state** — Some state belongs in the URL (filters, pagination, search queries)

```jsx
// URL state with React Router
const [searchParams, setSearchParams] = useSearchParams();
const page = parseInt(searchParams.get('page') || '1');
const filter = searchParams.get('filter') || 'all';
```

For most modern React applications, the combination of **TanStack Query** (server state) + **Zustand or Context** (client state) + **URL state** (routing parameters) provides excellent coverage without the overhead of Redux.
