Worklets are JavaScript functions that are copied and executed on the UI thread in Reanimated. They are the core mechanism that allows Reanimated to run animation logic on the UI thread without blocking the JS thread.

**How worklets work:**

When Reanimated encounters a worklet (a function marked with `'worklet';` directive), it:
1. Serializes the function and its closure variables
2. Sends the serialized function to the UI thread
3. The UI thread's JavaScript engine (JSI/Hermes) executes the function directly
4. Results are shared back to the JS thread via shared values

```tsx
'worklet';

// This function runs on the UI thread
const animatedStyle = useAnimatedStyle(() => {
  'worklet';
  // This code executes on the UI thread at 60 FPS
  return {
    transform: [{ translateX: offset.value }],
  };
});
```

**Implicit worklets:**

Most Reanimated hooks create worklets automatically—functions passed to `useAnimatedStyle`, `useAnimatedScrollHandler`, `useDerivedValue`, and gesture callbacks are implicitly treated as worklets:

```tsx
// useAnimatedStyle callback is automatically a worklet
const style = useAnimatedStyle(() => {
  // No need for 'worklet' directive here
  return { opacity: opacity.value };
});

// Gesture callbacks are worklets
const pan = Gesture.Pan()
  .onUpdate((e) => {
    // This runs on the UI thread
    translateX.value = e.translationX;
  });
```

**Explicit worklets:**

For custom functions that need to run on the UI thread, use the `'worklet';` directive:

```tsx
function clamp(value, min, max) {
  'worklet';
  return Math.min(Math.max(value, min), max);
}

function interpolateColor(progress) {
  'worklet';
  const r = Math.round(255 * (1 - progress));
  const g = Math.round(255 * progress);
  return `rgb(${r}, ${g}, 0)`;
}

// Use in animated style
const style = useAnimatedStyle(() => {
  const clamped = clamp(offset.value, 0, 200);
  return {
    transform: [{ translateX: clamped }],
    backgroundColor: interpolateColor(clamped / 200),
  };
});
```

**Calling JS functions from worklets** (`runOnJS`):

Worklets run on the UI thread and cannot directly call JS functions. Use `runOnJS` to schedule a JS function call from the UI thread:

```tsx
const gesture = Gesture.Pan()
  .onEnd((e) => {
    if (e.translationX > 100) {
      // This runs on UI thread - can't call JS directly
      runOnJS(onSwipeRight)(); // Schedule on JS thread
    }
  });
```

**Calling UI thread functions from JS** (`runOnUI`):

```tsx
function expensiveCalculation(input) {
  'worklet';
  let result = 0;
  for (let i = 0; i < input; i++) {
    result += Math.sqrt(i);
  }
  return result;
}

function triggerCalculation() {
  runOnUI(expensiveCalculation)(1000);
}
```

**Shared values and worklets:**

Shared values (`useSharedValue`) are the bridge between JS and UI threads. They can be read and written from both sides:

```tsx
const progress = useSharedValue(0);

// Written from JS thread
function startAnimation() {
  progress.value = withTiming(1, { duration: 300 });
}

// Read from UI thread (in worklet)
const style = useAnimatedStyle(() => {
  // Reads latest value on UI thread
  return { opacity: progress.value };
});
```

**Limitations of worklets:**
- Cannot access React context or hooks
- Cannot call non-worklet functions directly (use `runOnJS`)
- Cannot access DOM or browser APIs
- Closure variables are serialized (captured by value, not reference)
- Cannot create new objects that persist across frames (use shared values instead)
- Debugging is harder (use `console.log` in worklets—logs appear in native console)

**Worklets enable:**
- Smooth 60 FPS animations regardless of JS thread load
- Gesture-driven animations that respond instantly
- Complex animation logic (physics, math) on the UI thread
- Layout animations that don't block rendering
