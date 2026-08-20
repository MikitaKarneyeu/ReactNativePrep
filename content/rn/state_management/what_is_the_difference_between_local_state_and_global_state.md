Local state and global state represent two scopes of state management in a React Native application, and choosing the right scope for each piece of state is a key architectural decision.

**Local state** is state that belongs to a single component or a small subtree of components. It's managed with `useState`, `useReducer`, or component-level Context:

```tsx
// Simple local state
function TextInput() {
  const [value, setValue] = useState('');
  return <RNTextInput value={value} onChangeText={setValue} />;
}

// Local state shared between a parent and its children
function FormScreen() {
  const [formData, setFormData] = useState({ name: '', email: '' });
  return (
    <View>
      <NameInput value={formData.name} onChange={(name) =>
        setFormData((prev) => ({ ...prev, name }))
      } />
      <EmailInput value={formData.email} onChange={(email) =>
        setFormData((prev) => ({ ...prev, email }))
      } />
    </View>
  );
}
```

**Global state** is state that multiple unrelated components throughout the app need to access. It's managed with Context, Redux, Zustand, Jotai, or similar solutions:

```tsx
// Global auth state
const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  login: async (credentials) => { /* ... */ },
  logout: () => set({ user: null, isAuthenticated: false }),
}));

// Used across the app
function Header() {
  const user = useAuthStore((state) => state.user);
}

function ProfileScreen() {
  const user = useAuthStore((state) => state.user);
}

function SettingsScreen() {
  const logout = useAuthStore((state) => state.logout);
}
```

**When to use local state:**
- Form input values and form validation state
- Toggle states (modal open/closed, dropdown expanded)
- Animation values
- UI-specific state (scroll position, selected tab index)
- Data that doesn't need to be shared outside the component
- State that is only relevant during a component's lifecycle

**When to use global state:**
- Authentication status and user data
- Theme/appearance preferences
- Shopping cart data
- Notification counts
- Feature flags
- Data needed by multiple unrelated screens
- State that must survive component unmounting

**The rule of thumb**: Start with local state. Lift state up only when you need to share it. Move to global state only when lifting state becomes impractical (prop drilling through many levels, or state needed by widely separated components).

**Common mistake**: Making everything global. This leads to:
- Unnecessary re-renders (global state changes trigger more component updates)
- Harder to reason about state flow
- Harder to clean up when components unmount
- Larger state objects with more potential for bugs

**A practical hierarchy:**

1. **Component state**: useState/useReducer for UI-specific state
2. **Shared local state**: Context for a feature subtree (e.g., form context)
3. **Feature state**: Zustand/Redux slice for data shared within a feature
4. **App-wide state**: Global store for auth, theme, notifications
5. **Server state**: TanStack Query for API data (separate from client state)

This layered approach keeps state close to where it's needed while sharing it only when necessary.
