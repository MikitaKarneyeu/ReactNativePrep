The React Native Performance Monitor is a built-in overlay that displays real-time performance metrics, helping you identify performance bottlenecks during development.

**Enabling the Performance Monitor:**

**iOS Simulator**: Press `Cmd + D` to open the developer menu, then select "Show Perf Monitor"

**Android Emulator**: Press `Cmd + M` (macOS) or `Ctrl + M` (Windows/Linux) to open the developer menu, then select "Show Perf Monitor"

**Physical devices**: Shake the device or use the in-app developer menu

**What the metrics mean:**

The Performance Monitor displays two main numbers:

1. **UI Thread (Main Thread) FPS**: The frame rate of the native UI thread. This measures how fast native views are being rendered and laid out. On iOS, this is the main thread; on Android, it's the UI thread. Target: 60 FPS (or 120 FPS on ProMotion displays). Dropped frames here indicate native rendering bottlenecks.

2. **JS Thread FPS**: The frame rate of the JavaScript thread. This measures how fast your React component tree is being reconciled and JS logic is executing. Target: 60 FPS. Dropped frames here indicate JS-heavy operations blocking the thread.

**Interpreting the numbers:**

- **Both at 60**: App is performing well
- **JS thread low, UI thread normal**: Your JavaScript code is too heavy—look for expensive computations, excessive re-renders, or heavy work in render functions
- **UI thread low, JS thread normal**: Native rendering is bottlenecked—look for complex view hierarchies, heavy images, or excessive native layout calculations
- **Both low**: Both threads are overloaded—likely complex animations or very heavy screens

**Using it effectively:**

1. **Open the monitor before testing**: Always have it visible during performance testing
2. **Navigate through your app**: Watch the numbers as you navigate between screens
3. **Scroll lists**: Scrolling is the most common source of frame drops
4. **Trigger animations**: Check FPS during animations and transitions
5. **Use during profiling sessions**: Combine with other tools for deeper analysis

**Complementary tools for deeper analysis:**

The Performance Monitor is a quick health check, but for detailed analysis you need:

- **React DevTools Profiler**: Shows which components re-render and how long each render takes
- **Flipper Performance Plugin**: More detailed performance data with timeline view
- **Xcode Instruments**: Detailed native performance profiling on iOS
- **Android Studio Profiler**: CPU, memory, and network profiling on Android
- **Hermes Profiler**: JavaScript-level profiling for code running on Hermes

**Programmatic performance measurement:**

```tsx
import { InteractionManager } from 'react-native';

// Defer heavy work until after animations complete
InteractionManager.runAfterInteractions(() => {
  // Heavy computation here
  console.time('dataProcessing');
  processData(largeDataSet);
  console.timeEnd('dataProcessing');
});
```

**Common patterns that show up in the Performance Monitor:**

- **Flat scrolling FPS drops**: Unmemoized list items, missing `getItemLayout`
- **Navigation FPS drops**: Heavy screen mounting, large initial state calculations
- **Animation stutters**: JS-driven animations instead of native driver
- **Consistent low JS FPS**: Bundle too large, too many modules loaded at startup

The Performance Monitor should be your first check when users report lag or jank. It quickly tells you which thread to investigate and whether the issue is JS-bound or native-bound.
