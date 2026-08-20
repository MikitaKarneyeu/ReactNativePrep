React Navigation provides several mechanisms for passing data between screens, each suited for different use cases.

**1. Route params** are the primary way to pass data when navigating to a screen:

```tsx
// Passing params when navigating
navigation.navigate('Profile', { userId: '123', userName: 'John' });

// Accessing params in the destination screen
function ProfileScreen({ route }) {
  const { userId, userName } = route.params;
  return <Text>{userName}</Text>;
}
```

Params are passed as an object and are accessible via `route.params`. They are serializable, so you should avoid passing functions, class instances, or large objects.

**2. Passing data back via route params** is done by navigating back with new params:

```tsx
// Screen A navigates to Screen B
navigation.navigate('SelectColor', { onSelect: undefined });

// Screen B navigates back with result
navigation.navigate('Settings', { selectedColor: '#ff0000' });
```

However, a cleaner pattern is to use the `navigate` function with params on the previous screen.

**3. Using a shared state/context** for data that multiple screens need:

```tsx
const UserContext = createContext();

function App() {
  const [user, setUser] = useState(null);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserContext.Provider>
  );
}

// Any screen can access and modify user data
function HomeScreen() {
  const { user } = useContext(UserContext);
}
```

**4. Using a global state manager** (Redux, Zustand, Jotai) for complex state shared across many screens:

```tsx
// Using Zustand
const useStore = create((set) => ({
  selectedItems: [],
  addItem: (item) => set((state) => ({
    selectedItems: [...state.selectedItems, item]
  })),
}));

// Any screen can read/write
function CartScreen() {
  const items = useStore((state) => state.selectedItems);
}
```

**5. Initial params** for default values when a screen is first rendered:

```tsx
<Stack.Screen
  name="Profile"
  component={ProfileScreen}
  initialParams={{ userId: 'default' }}
/>
```

**Best practices:**
- Use route params for data specific to a single screen visit (navigation context)
- Use context or state management for data shared across multiple screens
- Keep params minimal and serializable—avoid passing large datasets
- Use TypeScript to define param types for type safety

```tsx
type RootStackParamList = {
  Home: undefined;
  Profile: { userId: string };
  Settings: { theme: 'light' | 'dark' };
};

const Stack = createNativeStackNavigator<RootStackParamList>();
```
