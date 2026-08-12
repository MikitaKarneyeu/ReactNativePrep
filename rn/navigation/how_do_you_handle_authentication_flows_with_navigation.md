Authentication flows in React Native navigation involve conditionally rendering different navigator structures based on whether the user is authenticated. The standard pattern uses nested navigators and conditional rendering.

**The pattern**: Split your navigation into an Auth flow (login, signup, onboarding) and a Main flow (the app). Conditionally render one or the other based on auth state.

**Implementation with React Navigation:**

```tsx
function App() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}

function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
}

function MainNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
```

**Using a custom hook for auth state:**

```tsx
function useAuth() {
  const [state, setState] = useState({
    isAuthenticated: false,
    isLoading: true,
    user: null,
  });

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        const user = await validateToken(token);
        setState({ isAuthenticated: true, isLoading: false, user });
      } else {
        setState({ isAuthenticated: false, isLoading: false, user: null });
      }
    };
    checkAuth();
  }, []);

  return state;
}
```

**Handling logout** involves clearing auth state, which triggers the conditional navigator re-render:

```tsx
function useAuth() {
  // ... state setup

  const logout = async () => {
    await AsyncStorage.removeItem('authToken');
    setState({ isAuthenticated: false, isLoading: false, user: null });
  };

  return { ...state, logout };
}
```

**Navigating from auth screens** after successful login, simply update the auth state. The conditional rendering automatically switches from AuthNavigator to MainNavigator:

```tsx
function LoginScreen() {
  const { login } = useAuth();

  const handleLogin = async (email, password) => {
    const success = await login(email, password);
    // No navigation needed—App component re-renders
    // and shows MainNavigator
  };
}
```

**Protected routes within the main flow**: For screens that require specific roles or additional auth (like a verified email), use a wrapper component:

```tsx
function ProtectedScreen({ children, requiredRole }) {
  const { user } = useAuth();
  const navigation = useNavigation();

  if (user.role !== requiredRole) {
    navigation.replace('Unauthorized');
    return null;
  }

  return children;
}
```

**Important considerations:**
- Reset navigation state on logout to prevent users from navigating back to authenticated screens via the system back button
- Use `navigation.reset()` when logging out to clear the entire stack
- Store auth tokens securely (Keychain/Keystore, not AsyncStorage for sensitive tokens)
- Handle token refresh and expiration gracefully
