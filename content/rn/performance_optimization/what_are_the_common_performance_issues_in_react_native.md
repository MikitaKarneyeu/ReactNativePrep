React Native performance issues typically stem from excessive work on the JavaScript thread, unnecessary re-renders, or inefficient native-to-JS communication. Understanding these categories helps diagnose and fix performance problems.

**JS Thread bottlenecks:**

1. **Heavy computations on the JS thread**: Complex calculations, large data transformations, or JSON parsing block the JS thread, causing dropped frames. Move heavy work to native modules or use `InteractionManager` to defer until after animations complete.

2. **Excessive re-renders**: Components re-rendering too frequently, especially in lists, is the most common performance issue. This happens when:
   - Parent state changes cause all children to re-render
   - Inline functions create new references on every render
   - Context values change and re-render all consumers

```tsx
// Bad - new function reference every render
<ListItem onPress={() => handlePress(item.id)} />

// Good - stable reference
const handlePress = useCallback((id) => { /* ... */ }, []);
<ListItem onPress={handlePress} item={item} />
```

3. **Large lists without virtualization**: Using `ScrollView` for long lists renders all items at once. Use `FlatList` or `FlashList` which only render visible items.

**Bridge/JSI issues (old architecture):**

4. **Excessive native-to-JS communication**: Frequent bridge calls (especially in animation callbacks or gesture handlers) create serialization overhead. Use Reanimated or native driver animations that run on the UI thread.

5. **Non-serializable data over the bridge**: Large objects sent between JS and native incur serialization costs.

**Image issues:**

6. **Unoptimized images**: Large images without proper sizing, caching, or compression consume memory and slow rendering. Use `react-native-fast-image` and resize images to their display dimensions.

7. **No image caching**: Re-downloading images on every mount wastes bandwidth and causes visual glitches.

**Animation issues:**

8. **Animated API running on JS thread**: The default `Animated` API runs animations on the JS thread, which can stutter when JS is busy. Use `useNativeDriver: true` or switch to Reanimated for UI thread animations.

**Startup performance:**

9. **Large bundle size**: More JavaScript means longer parse and execution time at startup. Use Hermes, tree shaking, and code splitting.

10. **Synchronous module loading**: Loading many modules synchronously at startup delays time-to-interactive. Use lazy loading and TurboModules.

**Memory issues:**

11. **Memory leaks from event listeners and timers**: Not cleaning up subscriptions, intervals, or event listeners in `useEffect` return functions.

12. **Retaining closures over large objects**: Keeping references to large data prevents garbage collection.

**Diagnosis tools:**
- React Native Performance Monitor (FPS, JS thread, UI thread)
- Flipper with React DevTools and performance plugins
- `console.log` with timestamps for specific bottlenecks
- Native profiling tools (Xcode Instruments, Android Profiler)
- React DevTools Profiler for re-render analysis
