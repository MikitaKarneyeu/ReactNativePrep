Persisting navigation state allows your app to restore the user's navigation position when the app is reopened, providing a seamless experience even after the app is killed by the OS.

**Using React Navigation's built-in state persistence:**

React Navigation supports persistence out of the box by providing a `persistNavigationState` and `onStateChange` callback to `NavigationContainer`:

```tsx
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PERSISTENCE_KEY = 'NAVIGATION_STATE';

function App() {
  const [isReady, setIsReady] = useState(false);
  const [initialState, setInitialState] = useState();

  useEffect(() => {
    const restoreState = async () => {
      try {
        const savedState = await AsyncStorage.getItem(PERSISTENCE_KEY);
        if (savedState) {
          setInitialState(JSON.parse(savedState));
        }
      } finally {
        setIsReady(true);
      }
    };

    restoreState();
  }, []);

  if (!isReady) return null;

  return (
    <NavigationContainer
      initialState={initialState}
      onStateChange={(state) => {
        AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state));
      }}
    >
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

**Deep linking compatibility**: If you use deep linking, you should skip persistence restoration when the app is opened via a deep link:

```tsx
import { getInitialURL } from 'expo-linking';

useEffect(() => {
  const restoreState = async () => {
    const initialUrl = await Linking.getInitialURL();

    // Only restore state if not opened via deep link
    if (initialUrl == null) {
      const savedState = await AsyncStorage.getItem(PERSISTENCE_KEY);
      if (savedState) {
        setInitialState(JSON.parse(savedState));
      }
    }
    setIsReady(true);
  };

  restoreState();
}, []);
```

**What gets persisted:**
- The navigation tree structure
- Current route names and params
- Which screen is active in each navigator

**What does NOT get persisted:**
- Component local state (useState)
- Scroll positions
- Non-serializable route params (functions, class instances)
- State managed by external stores (Redux, Zustand)

**Important considerations:**

1. **Route params must be serializable**: Don't pass functions, Date objects, or class instances as params if you want persistence to work. React Navigation will warn if non-serializable values are detected.

2. **Security**: Be careful persisting navigation state that contains sensitive information (e.g., user IDs in URLs, private screen data). Clear persisted state on logout.

3. **Versioning**: If you change your navigation structure between app versions, the persisted state may become invalid. Handle this gracefully:

```tsx
const CURRENT_STATE_VERSION = 2;

const savedState = await AsyncStorage.getItem(PERSISTENCE_KEY);
const parsed = JSON.parse(savedState);
if (parsed?.version !== CURRENT_STATE_VERSION) {
  await AsyncStorage.removeItem(PERSISTENCE_KEY);
  setInitialState(null);
} else {
  setInitialState(parsed.state);
}
```

4. **Performance**: For simpler apps, persistence adds minimal overhead. For complex navigation trees, consider debouncing the state save to avoid excessive writes.
