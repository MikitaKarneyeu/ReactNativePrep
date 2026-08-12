`useAnimatedStyle` is a Reanimated hook that creates animated styles driven by shared values. It returns a style object that automatically updates on the UI thread when the shared values it depends on change—without triggering re-renders on the JS thread.

**Basic usage:**

```tsx
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

function Box() {
  const offset = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: offset.value }],
    };
  });

  return (
    <Pressable onPress={() => { offset.value = withSpring(100); }}>
      <Animated.View style={[styles.box, animatedStyle]} />
    </Pressable>
  );
}
```

**How it works internally:**

1. Reanimated analyzes the worklet function to determine which shared values it reads
2. It sets up subscriptions to those shared values
3. When a shared value changes, the worklet re-executes on the UI thread
4. The returned style object is applied directly to the native view
5. The JS thread is never involved in the animation update

**Multiple shared values:**

```tsx
const translateX = useSharedValue(0);
const translateY = useSharedValue(0);
const scale = useSharedValue(1);
const rotation = useSharedValue(0);

const animatedStyle = useAnimatedStyle(() => {
  return {
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
    ],
    opacity: interpolate(scale.value, [0.5, 1], [0.5, 1]),
  };
});
```

**With interpolation:**

```tsx
import { interpolate, Extrapolate } from 'react-native-reanimated';

const scrollY = useSharedValue(0);

const headerStyle = useAnimatedStyle(() => {
  return {
    opacity: interpolate(
      scrollY.value,
      [0, 100],
      [1, 0],
      Extrapolate.CLAMP
    ),
    transform: [{
      translateY: interpolate(
        scrollY.value,
        [0, 100],
        [0, -50],
        Extrapolate.CLAMP
      ),
    }],
  };
});
```

**Conditional logic in worklets:**

```tsx
const isOpen = useSharedValue(false);

const animatedStyle = useAnimatedStyle(() => {
  if (isOpen.value) {
    return {
      height: withSpring(200),
      opacity: withTiming(1),
    };
  } else {
    return {
      height: withSpring(0),
      opacity: withTiming(0),
    };
  }
});
```

**Using custom worklet functions:**

```tsx
function clampValue(value, min, max) {
  'worklet';
  return Math.min(Math.max(value, min), max);
}

const animatedStyle = useAnimatedStyle(() => {
  const clamped = clampValue(translateX.value, -100, 100);
  return {
    transform: [{ translateX: clamped }],
    backgroundColor: clamped > 0 ? 'green' : 'red',
  };
});
```

**With gesture handler:**

```tsx
const translateX = useSharedValue(0);

const pan = Gesture.Pan()
  .onUpdate((e) => {
    translateX.value = e.translationX;
  })
  .onEnd(() => {
    translateX.value = withSpring(0);
  });

const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ translateX: translateX.value }],
}));

return (
  <GestureDetector gesture={pan}>
    <Animated.View style={[styles.box, animatedStyle]} />
  </GestureDetector>
);
```

**Derived animated styles with `useDerivedValue`:**

```tsx
const offset = useSharedValue(0);

const derivedScale = useDerivedValue(() => {
  return 1 + Math.abs(offset.value) / 200;
});

const animatedStyle = useAnimatedStyle(() => ({
  transform: [
    { translateX: offset.value },
    { scale: derivedScale.value },
  ],
}));
```

**Best practices:**
- Return only style properties from `useAnimatedStyle`—don't perform side effects
- Use `Extrapolate.CLAMP` to prevent values from going outside expected ranges
- Combine with `useDerivedValue` for complex computed values
- Don't read non-shared values (regular React state) inside the worklet—they won't trigger updates
- Each `useAnimatedStyle` creates a separate worklet—combine related styles into one hook when possible
- Use `withSpring` and `withTiming` inside worklets for animated transitions
