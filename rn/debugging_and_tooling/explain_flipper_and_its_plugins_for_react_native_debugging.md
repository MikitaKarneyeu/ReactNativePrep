Flipper is Meta's desktop debugging platform for mobile apps. It provides a rich set of plugins for inspecting, debugging, and profiling React Native apps. While Meta deprecated Flipper as the default in React Native 0.74+, it remains available and many teams still use it.

**Installation:**

Download from [flipper-zhao.com](https://fbflipper.com/) or install via Homebrew:
```bash
brew install --cask flipper
```

**Core plugins for React Native:**

**1. Network Inspector:**
Intercepts and displays all HTTP/HTTPS requests made by the app:
- View request/response headers and bodies
- Filter by URL, method, or status code
- See timing information (DNS, TLS, response time)
- Mock responses for testing

```
Request: GET /api/users
Status: 200
Time: 245ms
Response: [{"id": 1, "name": "Alice"}, ...]
```

**2. Layout Inspector:**
Visualizes the native view hierarchy:
- See the complete view tree
- Inspect view properties (frame, bounds, opacity)
- Highlight views on the device
- Debug layout issues (overlapping views, wrong sizes)

**3. Databases:**
View and edit data in local databases:
- AsyncStorage entries
- SQLite databases (browse tables, run queries)
- MMKV storage
- Redux Persist store

**4. Images:**
View all images loaded in the app with their sizes and memory usage.

**5. Hermes Debugger:**
Step-through debugging for JavaScript running on Hermes:
- Set breakpoints
- Inspect variables
- Step through code line by line
- Evaluate expressions in console

**6. Shared Preferences (Android):**
View and edit SharedPreferences values.

**7. Crash Reporter:**
Displays native crashes with stack traces.

**Setting up Flipper in React Native:**

For React Native < 0.74 (included by default):
```bash
# iOS
cd ios && pod install

# Android - already configured in default template
```

For React Native >= 0.74 (opt-in):
```bash
npm install react-native-flipper
```

```tsx
// In your app entry point
if (__DEV__) {
  try {
    const { addPlugin } = require('react-native-flipper');
    // Add plugins as needed
  } catch (e) {
    // Flipper not available
  }
}
```

**Custom Flipper plugins:**

You can create custom plugins for app-specific debugging:

```tsx
// Custom plugin to inspect app state
if (__DEV__) {
  const Flipper = require('react-native-flipper');
  const plugin = {
    getId: () => 'my-app-state',
    onConnect: (connection) => {
      connection.receive('getState', (data, responder) => {
        responder.success({ state: store.getState() });
      });
    },
  };
  Flipper.addPlugin(plugin);
}
```

**Alternatives to Flipper:**

Since Flipper's deprecation as default, alternatives include:
- **React Native DevTools**: Built-in component inspector and profiler
- **Reactotron**: Standalone app for inspecting Redux, API calls, and errors
- **Chrome DevTools**: For Hermes debugging
- **VS Code React Native Tools**: Debugger extension for VS Code

**When to use Flipper:**
- Debugging network requests and responses
- Inspecting native view hierarchy
- Browsing local database contents
- Debugging native crashes
- Profiling memory and performance

**Limitations:**
- Can be slow with very large apps
- Some plugins are poorly maintained
- Debugging connection can be unstable
- Not available in production builds
