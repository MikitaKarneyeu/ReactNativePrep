Selectors are functions that extract specific pieces of state from a store. They serve three primary purposes: performance optimization through selective subscriptions, code reuse through derived state computation, and abstraction over state shape.

**Performance optimization**: Selectors ensure components only re-render when the specific data they depend on changes. Without selectors, components would re-render on any state change.

```tsx
// Without selector - re-renders on ANY state change
function UserName() {
  const state = useStore(); // subscribes to entire store
  return <Text>{state.user.name}</Text>;
}

// With selector - only re-renders when user.name changes
function UserName() {
  const name = useStore((state) => state.user.name);
  return <Text>{name}</Text>;
}
```

**Derived/computed state**: Selectors can compute values from state, avoiding redundant calculations and keeping your components clean:

```tsx
// Simple derived state
const useStore = create((set) => ({
  items: [],
  addItem: (item) => set((state) => ({
    items: [...state.items, item],
  })),
}));

// Selector that computes derived state
function CartSummary() {
  const totalPrice = useStore((state) =>
    state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  );
  const itemCount = useStore((state) => state.items.length);
}
```

**In Redux with `createSelector` (Reselect)**: Memoized selectors prevent recomputation when inputs haven't changed:

```tsx
import { createSelector } from '@reduxjs/toolkit';

const selectCartItems = (state) => state.cart.items;

const selectCartTotal = createSelector(
  [selectCartItems],
  (items) => items.reduce((sum, item) => sum + item.price, 0)
);

const selectCartItemCount = createSelector(
  [selectCartItems],
  (items) => items.length
);

function CartScreen() {
  const total = useSelector(selectCartTotal);
  const count = useSelector(selectCartItemCount);
}
```

**Abstraction over state shape**: Selectors decouple components from the store's internal structure. If you refactor your state shape, you only update the selectors:

```tsx
// Before refactor: state.users.list
// After refactor: state.entities.users.all

// Selector abstracts this change
const selectUsers = (state) => state.entities.users.all;

// Components don't need to change
function UserList() {
  const users = useSelector(selectUsers);
}
```

**Selector patterns in Zustand:**

```tsx
// Zustand selectors are just functions
const useStore = create((set, get) => ({
  users: [],
  getUserById: (id) => get().users.find((u) => u.id === id),
}));

function UserProfile({ userId }) {
  // This re-renders only when the return value changes
  // because Zustand uses Object.is comparison by default
  const user = useStore((state) => state.users.find((u) => u.id === userId));
}
```

**Custom equality functions**: For complex selectors, you can provide custom comparison functions:

```tsx
import { shallow } from 'zustand/shallow';

function UserProfile() {
  const { name, email } = useStore(
    (state) => ({ name: state.user.name, email: state.user.email }),
    shallow // Object.is would always see a new object reference
  );
}
```

**Best practices:**
- Keep selectors pure (no side effects)
- Make selectors granular—one piece of state per selector
- Memoize expensive computations with `createSelector`
- Define selectors alongside the store for co-location
- Use selectors to hide state shape from components
