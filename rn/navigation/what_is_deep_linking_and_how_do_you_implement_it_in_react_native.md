Deep linking allows your React Native app to be opened via a URL, navigating the user directly to a specific screen or content. For example, tapping a link like `myapp://profile/123` would open your app directly to the profile screen for user 123.

**Types of deep links:**

1. **URI schemes**: Custom URL schemes like `myapp://profile/123`. Simple to set up but any app can register the same scheme.
2. **Universal Links (iOS) / App Links (Android)**: Standard HTTPS URLs (e.g., `https://myapp.com/profile/123`) that open your app when installed, falling back to the web URL otherwise. These are more secure and recommended.

**Implementation with React Navigation:**

Step 1: Configure the linking configuration:

```tsx
const linking = {
  prefixes: ['myapp://', 'https://myapp.com'],
  config: {
    screens: {
      Home: {
        screens: {
          Feed: 'feed',
          Trending: 'trending',
        },
      },
      Profile: 'user/:id',
      Settings: 'settings',
      NotFound: '*',
    },
  },
};
```

Step 2: Pass the linking config to NavigationContainer:

```tsx
function App() {
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

Step 3: Access deep link params in your screen:

```tsx
function ProfileScreen({ route }) {
  const { id } = route.params;
  // Fetch user data with the id
}
```

Step 4: Configure native projects:

**iOS** - Add URL scheme to `Info.plist`:
```xml
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLSchemes</key>
    <array><string>myapp</string></array>
  </dict>
</array>
```

For Universal Links, add an Associated Domains entitlement and host an `apple-app-site-association` file on your domain.

**Android** - Add intent filters to `AndroidManifest.xml`:
```xml
<intent-filter android:autoVerify="true">
  <action android:name="android.intent.action.VIEW" />
  <category android:name="android.intent.category.DEFAULT" />
  <category android:name="android.intent.category.BROWSABLE" />
  <data android:scheme="https" android:host="myapp.com" />
</intent-filter>
```

**Handling initial URLs and deferred deep links**: Use `Linking.getInitialURL()` to handle the URL that launched the app, and `Linking.addEventListener('url', callback)` for URLs received while the app is running. React Navigation handles this automatically when you provide the linking config.

**Deferred deep links** (links that navigate to specific content after app install) require a third-party service like Firebase Dynamic Links, Branch, or AppsFlyer.
