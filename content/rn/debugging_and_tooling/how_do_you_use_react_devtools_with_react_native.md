React DevTools is a standalone debugging tool that lets you inspect the React component tree, view and edit props and state, and profile component renders. It works with React Native via a WebSocket connection.

**Installation and launch:**

```bash
# Standalone app (recommended for React Native)
npx react-devtools
```

This opens a standalone window that connects to your React Native app running in development mode.

**Connection methods:**

**1. Automatic connection**: When you run your app in development mode and open React DevTools, it often connects automatically if both are on the same network.

**2. Via dev menu**: Open the React Native dev menu (`Cmd + D` on iOS, `Cmd + M` on Android) and select "Show Element Inspector" or "Debug with Chrome".

**3. Manual connection**: If auto-connect doesn't work:

```tsx
// In your app code (development only)
if (__DEV__) {
  const { connectToDevTools } = require('react-devtools-core');
  connectToDevTools({
    host: 'localhost',
    port: 8097,
  });
}
```

**What you can do with React DevTools:**

**Component Inspector:**
- View the complete component tree hierarchy
- Click on any component to see its props, state, and hooks
- Edit props and state in real-time (see immediate UI changes)
- Search for components by name

**Profiler:**
- Record a profiling session while interacting with the app
- See which components rendered and why
- View the time each component took to render
- Identify wasted renders (components that rendered but produced no DOM changes)
- Flamegraph and ranked chart views

**Using the Profiler:**

1. Click the "Profiler" tab
2. Click the record button (circle icon)
3. Interact with your app (scroll, navigate, tap)
4. Stop recording
5. Analyze the results:
   - **Flamegraph view**: Shows component render times in a tree structure
   - **Ranked view**: Sorts components by render time (find the slowest)
   - **Why did this render?**: Shows what changed (props, state, hooks)

**Console logging integration:**

```tsx
// In your component
function MyComponent({ items }) {
  // Log render cause
  console.log('MyComponent rendered', { items });

  return <View>...</View>;
}
```

React DevTools shows these logs alongside the component tree.

**Highlighting updates:**

Enable "Highlight updates when components render" in React DevTools settings to visually see which components re-render. Components flash with a colored border when they render, helping identify unnecessary re-renders.

**Tips for React Native:**
- Use the standalone React DevTools (not the browser extension)
- Keep React DevTools open during development to monitor re-renders
- Use the Profiler before optimizing—measure first, optimize second
- The search feature is useful for finding deeply nested components
- Edit props/state to test edge cases without changing code
- Use "Highlight updates" to find components that re-render unnecessarily

**Common issues:**
- Connection problems: Ensure your device and computer are on the same network
- If using Hermes, ensure you're using the correct React DevTools version
- React DevTools doesn't show native views—use Flipper's Layout Inspector for that
- Some features may not work with older React Native versions
