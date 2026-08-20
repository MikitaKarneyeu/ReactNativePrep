Zustand is a small, fast state management library that I would choose over Redux in several specific scenarios where Redux's ceremony and complexity aren't justified.

**Choose Zustand when:**

**1. You want minimal boilerplate**: Zustand requires far less code than Redux. There are no action types, action creators, reducers, or middleware setup. You define state and actions in one place:

```tsx
// Zustand - entire store in ~10 lines
const useStore = create((set, get) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  fetchData: async () => {
    const data = await api.getData();
    set({ data });
  },
}));

// Usage
function Counter() {
  const count = useStore((state) => state.count);
  const increment = useStore((state) => state.increment);
}
```

Compare with Redux Toolkit (which is already much simpler than classic Redux), and Zustand is still significantly less code.

**2. You need global state without providers**: Zustand stores exist outside the React tree, so you don't need a Provider wrapper. This simplifies your component tree and avoids the nesting problem:

```tsx
// No Provider needed
function App() {
  return <MainNavigator />;
}

// Access from anywhere
function SomeComponent() {
  const count = useStore((state) => state.count);
}
```

**3. You need to access state outside React**: Since Zustand stores are plain JavaScript, you can read and write state from utility functions, services, or native module callbacks without a React context:

```tsx
// In a service file
import { useStore } from './store';

function handleNotification(payload) {
  const { addNotification } = useStore.getState();
  addNotification(payload);
}
```

**4. Performance is critical**: Zustand uses a subscription model where each component subscribes to specific state slices. Components only re-render when their selected slice changes, with no unnecessary re-renders.

**5. You're building a small to medium app**: For apps where Redux's structure and middleware aren't needed, Zustand provides just enough structure without over-engineering.

**Choose Redux when:**

- You need Redux DevTools for time-travel debugging and action logging
- You have complex async flows that benefit from middleware (Redux-Saga)
- Your team already knows Redux and the structured pattern helps maintainability
- You need a large ecosystem of middleware and tools
- You're building a large enterprise app where the structured Redux pattern prevents chaos

**Zustand with middleware:**

```tsx
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useStore = create(
  persist(
    (set) => ({
      count: 0,
      increment: () => set((state) => ({ count: state.count + 1 })),
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
```

**Migration path**: If you start with Zustand and your app grows in complexity, you can migrate to Redux incrementally. The concepts translate well—both use immutable updates and selector patterns.

For most new React Native projects in 2024+, I start with Zustand and only move to Redux if the complexity demands it.
