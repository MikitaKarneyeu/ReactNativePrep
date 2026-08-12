Reanimated (`react-native-reanimated`) is a powerful animation library that runs animations entirely on the UI thread using JavaScript worklets. It overcomes the limitations of the built-in Animated API and is the recommended solution for complex animations in React Native.

**Key differences from Animated API:**

| Feature | Animated API | Reanimated |
|---|---|---|
| JS thread execution | Yes (unless nativeDriver) | No (UI thread only) |
| Worklets (custom JS on UI thread) | No | Yes |
| Shared values | No | Yes (`useSharedValue`) |
| Reading animated values in JS | Async only | Sync via shared values |
| Gesture integration | Limited | Native (with gesture-handler) |
| Layout animations | Basic (`LayoutAnimation`) | Full support |
| Declarative styles | `Animated.View` | `useAnimatedStyle` |
| Performance under JS load | Degrades | Unaffected |

**Core concepts:**

**Shared values** (`useSharedValue`): Mutable values accessible from both JS and UI threads:

```tsx
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

function Box() {
  const offset = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value }],
  }));

  return (
    <Pressable onPress={() => { offset.value = withSpring(100); }}>
      <Animated.View style={[styles.box, animatedStyle]} />
    </Pressable>
  );
}
```

**Animated styles** (`useAnimatedStyle`): Derives animated styles from shared values, automatically updating on the UI thread:

```tsx
const scale = useSharedValue(1);

const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ scale: scale.value }],
  opacity: interpolate(scale.value, [1, 1.5], [1, 0.5]),
}));
```

**Animation functions:**

```tsx
// Spring animation
offset.value = withSpring(100, {
  damping: 10,
  stiffness: 100,
  mass: 1,
});

// Timing animation
opacity.value = withTiming(0, { duration: 300 });

// Decay animation
velocity.value = withDecay({
  velocity: 500,
  clamp: [0, 200],
});

// Sequence
offset.value = withSequence(
  withTiming(100, { duration: 200 }),
  withTiming(0, { duration: 200 })
);

// Delay
offset.value = withDelay(500, withSpring(100));
```

**Running JS on the UI thread** (`runOnJS`):

```tsx
const animatedStyle = useAnimatedStyle(() => {
  if (offset.value > 100) {
    runOnJS(onThresholdReached)(); // Call JS function from UI thread
  }
  return { transform: [{ translateX: offset.value }] };
});
```

**Layout animations:**

```tsx
import Animated, { FadeIn, FadeOut, SlideInRight, Layout } from 'react-native-reanimated';

function Item({ item }) {
  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(300)}
      layout={Layout.springify()}
      style={styles.item}
    >
      <Text>{item.title}</Text>
    </Animated.View>
  );
}
```

**Scroll-based animations:**

```tsx
import Animated, { useAnimatedScrollHandler, useAnimatedStyle, interpolate } from 'react-native-reanimated';

function ParallaxHeader() {
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const headerStyle = useAnimatedStyle(() => ({
    transform: [{
      translateY: interpolate(
        scrollY.value,
        [0, 200],
        [0, -100],
        Extrapolate.CLAMP
      ),
    }],
    opacity: interpolate(
      scrollY.value,
      [0, 200],
      [1, 0],
      Extrapolate.CLAMP
    ),
  }));

  return (
    <View>
      <Animated.View style={[styles.header, headerStyle]}>
        <Text>Header</Text>
      </Animated.View>
      <Animated.ScrollView onScroll={scrollHandler} scrollEventThrottle={16}>
        {/* Content */}
      </Animated.ScrollView>
    </View>
  );
}
```

**When to use Reanimated:**
- Any animation that should run on the UI thread
- Gesture-driven animations (with react-native-gesture-handler)
- Complex animation sequences and compositions
- Layout animations (entering, exiting, layout transitions)
- Scroll-based animations
- Any animation that needs to remain smooth when JS thread is busy

Reanimated is a core dependency in most production React Native apps and is required by many UI component libraries.
