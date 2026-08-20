Atomic state management is a pattern where state is split into small, independent units called atoms, rather than maintaining a single large state object. Components subscribe only to the specific atoms they need, enabling fine-grained re-render control.

**Core concepts:**

An **atom** is a unit of state that can be read and written to from any component. When an atom's value changes, only components that subscribe to that specific atom re-render.

```tsx
// Jotai - the most popular atomic state library for React Native
import { atom, useAtom } from 'jotai';

// Define atoms
const countAtom = atom(0);
const nameAtom = atom('John');

// Use in components
function Counter() {
  const [count, setCount] = useAtom(countAtom);
  return (
    <Button title={`Count: ${count}`} onPress={() => setCount((c) => c + 1)} />
  );
}

function NameDisplay() {
  const [name] = useAtom(nameAtom);
  return <Text>{name}</Text>;
  // This component NEVER re-renders when countAtom changes
}
```

**Derived atoms** compute values based on other atoms, creating a dependency graph:

```tsx
const priceAtom = atom(100);
const quantityAtom = atom(3);

// Derived atom - automatically updates when price or quantity changes
const totalAtom = atom((get) => {
  const price = get(priceAtom);
  const quantity = get(quantityAtom);
  return price * quantity;
});

function Total() {
  const [total] = useAtom(totalAtom);
  return <Text>Total: ${total}</Text>;
}
```

**Writable derived atoms** can also transform writes:

```tsx
const tempCelsiusAtom = atom(0);

const tempFahrenheitAtom = atom(
  (get) => get(tempCelsiusAtom) * 9/5 + 32, // read
  (get, set, newFahrenheit) => {
    const celsius = (newFahrenheit - 32) * 5/9;
    set(tempCelsiusAtom, celsius); // write
  }
);
```

**Async atoms** handle async operations:

```tsx
const userDataAtom = atom(async () => {
  const response = await fetch('/api/user');
  return response.json();
});

function UserProfile() {
  const [user] = useAtom(userDataAtom);
  // Uses Suspense for loading states
}
```

**Comparison with other approaches:**

| Aspect | Atomic (Jotai) | Redux/Zustand | Context |
|---|---|---|---|
| State structure | Independent atoms | Centralized store | Provider-based |
| Re-render granularity | Per-atom | Per-selector | Per-context value |
| Boilerplate | Very low | Low-moderate | Minimal |
| Devtools | Basic | Excellent | None |
| Derived state | Built-in (computed atoms) | Manual (selectors) | Manual |
| Async | Built-in (async atoms) | Middleware | Manual |

**Advantages of atomic state:**
- **Fine-grained updates**: Only components using a changed atom re-render
- **No provider needed**: Atoms exist outside the component tree (like Zustand)
- **Composable**: Atoms can depend on other atoms, forming a dependency graph
- **Code splitting**: Atoms are defined near where they're used
- **Simplicity**: No reducers, actions, or boilerplate

**Disadvantages:**
- **Atom proliferation**: Too many atoms can become hard to manage
- **No centralized view**: State is scattered across files
- **Devtools**: Less mature than Redux DevTools
- **Debugging**: Harder to trace state changes across many atoms

**When to use atomic state:**
- Apps with many independent pieces of state
- When fine-grained re-render control is critical
- When you want minimal boilerplate
- Apps where state doesn't need centralized management
- Prototypes and small to medium apps

Jotai is the recommended atomic state library for React Native—it's lightweight, has a small bundle size, and works well with React's concurrent features.
