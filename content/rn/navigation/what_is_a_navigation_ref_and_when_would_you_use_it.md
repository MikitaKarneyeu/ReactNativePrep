A navigation ref is a reference to the root navigator's `navigation` object that you can access outside of React components or outside the component tree where `useNavigation` isn't available. It enables imperative navigation from anywhere in your app.

**Creating a navigation ref:**

```tsx
import { createNavigationContainerRef, NavigationContainer } from '@react-navigation/native';

const navigationRef = createNavigationContainerRef();

function App() {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

**Using the ref to navigate outside of components:**

```tsx
// In a utility file
export function navigate(name, params) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}

// From anywhere—services, utils, middleware
import { navigate } from './navigationRef';

function handleDeepLink(url) {
  const route = parseDeepLink(url);
  navigate(route.screen, route.params);
}
```

**Common use cases:**

1. **Navigation from outside React components**: When you have utility functions, services, or middleware that need to trigger navigation (e.g., redirecting to login on 401 responses):

```tsx
// API interceptor
axios.interceptors.response.use(null, (error) => {
  if (error.response?.status === 401) {
    navigate('Login');
  }
  return Promise.reject(error);
});
```

2. **Deep linking handlers**: Processing deep links in app startup or from notification handlers where you don't have access to hooks:

```tsx
// Push notification handler
messaging().onNotificationOpenedApp((notification) => {
  const { screen, params } = notification.data;
  navigate(screen, params);
});
```

3. **State persistence**: Accessing navigation state for persistence:

```tsx
<NavigationContainer
  ref={navigationRef}
  onStateChange={(state) => {
    AsyncStorage.setItem('navState', JSON.stringify(state));
  }}
>
```

4. **Integration with state machines**: When using XState or similar libraries that need to trigger navigation as side effects.

**Checking readiness**: Always check `navigationRef.isReady()` before using it, as the navigator may not be mounted yet during app initialization:

```tsx
if (navigationRef.isReady()) {
  navigationRef.navigate('Profile', { id: '123' });
}
```

**TypeScript typing**:

```tsx
import { createNavigationContainerRef } from '@react-navigation/native';

type RootStackParamList = {
  Home: undefined;
  Profile: { userId: string };
};

const navigationRef = createNavigationContainerRef<RootStackParamList>();
```

**Caution**: Navigation refs create implicit dependencies and make code harder to test. Prefer `useNavigation` hook when inside a component. Use refs sparingly and only when hooks aren't available.
