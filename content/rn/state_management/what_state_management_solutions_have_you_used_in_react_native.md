React Native supports the same state management solutions as React web, since state management is handled at the JavaScript layer. I've worked with several approaches, each suited for different scales and complexity levels.

**React built-in state (useState, useReducer, Context API)**: For simple apps or isolated feature state. `useState` handles local component state, `useReducer` manages complex local state with actions, and Context API shares state across a subtree without prop drilling.

```tsx
const [count, setCount] = useState(0);
const [state, dispatch] = useReducer(reducer, initialState);
```

**Redux (with Redux Toolkit)**: The most established solution for large-scale apps. Redux Toolkit simplified the boilerplate significantly with `createSlice`, `createAsyncThunk`, and built-in Immer for immutable updates. Best for complex apps with many features sharing state, audit logging requirements, or teams familiar with the Redux pattern.

```tsx
const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: (state) => { state.value += 1; },
  },
});
```

**Zustand**: A lightweight alternative to Redux with minimal boilerplate. Uses a hook-based API with no providers required. Great for medium-complexity apps where Redux feels heavy but you need global state. Supports middleware for persistence, devtools, and immer integration.

```tsx
const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));
```

**Jotai**: Atomic state management inspired by Recoil. Each piece of state is an atom, and components subscribe to only the atoms they use. Excellent for fine-grained re-render control and derived state.

```tsx
const countAtom = atom(0);
const doubledAtom = atom((get) => get(countAtom) * 2);
```

**MobX**: Observable-based state management using decorators or `makeAutoObservable`. Very popular in React Native due to its simplicity and automatic tracking—components re-render when observed values change. Good for complex domain models.

**React Query / TanStack Query**: Not a general state manager but handles server state (API data) exceptionally well. Manages caching, background refetching, pagination, and optimistic updates for API data. I use it alongside a general state manager.

**Which I choose and when:**
- Small app / prototype: useState + Context
- Medium app with some shared state: Zustand
- Large app with complex state interactions: Redux Toolkit
- Server-heavy app: TanStack Query + Zustand or Redux
- Complex domain models: MobX

The trend in the React Native community has been moving away from Redux toward lighter solutions like Zustand and Jotai, while using TanStack Query for server state management.
