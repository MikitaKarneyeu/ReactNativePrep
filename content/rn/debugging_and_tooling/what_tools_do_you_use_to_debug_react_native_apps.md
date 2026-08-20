Debugging React Native apps requires a combination of tools, as the app runs across JavaScript, native, and bridge layers. Here are the tools I use and when.

**1. React Native Dev Menu:**
The starting point for debugging. Shake the device or use keyboard shortcuts:
- iOS Simulator: `Cmd + D`
- Android Emulator: `Cmd + M` / `Ctrl + M`

Provides access to: reload, performance monitor, element inspector, debugger, and more.

**2. React DevTools:**
A standalone app for inspecting the React component tree, props, state, and hooks:

```bash
npx react-devtools
```

- Inspect component hierarchy
- View and edit props and state
- Profile re-renders to identify performance bottlenecks
- Search for components by name

**3. Flipper:**
Meta's desktop debugging platform with a rich plugin ecosystem:
- Network inspector (view all HTTP requests/responses)
- Layout inspector (view native view hierarchy)
- Databases viewer (AsyncStorage, SQLite, MMKV)
- Hermes debugger (step through JS code)
- Crash reporter
- Image viewer
- Performance monitoring

**4. Chrome DevTools (Hermes):**
For step-through debugging of JavaScript code:
- Set breakpoints in your code
- Inspect variables and call stacks
- Evaluate expressions in the console
- Profile JavaScript execution

```tsx
// Enable remote debugging
// In dev menu, select "Debug with Chrome"
```

**5. Console logging:**
The simplest but often most effective debugging tool:

```tsx
console.log('Component rendered with props:', props);
console.warn('This should not happen');
console.error('API call failed:', error);
console.table([{ name: 'Alice', age: 30 }, { name: 'Bob', age: 25 }]);
console.time('operation');
// ... expensive operation
console.timeEnd('operation');
```

**6. Native debugging tools:**
- **Xcode Instruments**: Memory profiling, CPU profiling, network profiling on iOS
- **Android Studio Profiler**: CPU, memory, network, and battery profiling on Android
- **Xcode Debugger**: Breakpoints in native iOS code
- **Android Debugger**: Breakpoints in native Android code

**7. Performance Monitor:**
Built-in overlay showing JS and UI thread FPS:
- Enable from the dev menu
- Monitor frame rates during scrolling, animations, and navigation
- Quick indicator of performance issues

**8. Error boundaries:**
Catch and display React errors gracefully:

```tsx
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return <ErrorScreen error={this.state.error} />;
    }
    return this.props.children;
  }
}
```

**My debugging workflow:**
1. **Quick check**: Console.log for simple state/prop verification
2. **Component issues**: React DevTools to inspect component tree and re-renders
3. **Network issues**: Flipper Network plugin or console logs
4. **Native issues**: Xcode/Android Studio debugger
5. **Performance issues**: Performance Monitor + React DevTools Profiler
6. **Complex bugs**: Chrome DevTools with breakpoints
7. **Crashes**: Flipper Crash Reporter or Sentry

**Best practices:**
- Always develop with the dev menu accessible
- Use React DevTools Profiler before optimizing—profile first, optimize second
- Keep Flipper open during development for network and database inspection
- Use `__DEV__` to conditionally enable debug tools in development only
- Set up crash reporting (Sentry/Bugsnag) early for production debugging
- Remove all `console.log` statements before production builds
