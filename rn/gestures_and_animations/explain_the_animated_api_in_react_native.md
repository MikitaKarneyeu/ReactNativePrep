The Animated API is React Native's built-in animation system that provides a declarative way to create smooth animations. It can run animations on the native UI thread for transform and opacity properties, achieving 60 FPS performance.

**Core concepts:**

**Animated.Value** holds an animated number that can be driven by animations:

```tsx
import { Animated } from 'react-native';

const opacity = useRef(new Animated.Value(0)).current;
const translateX = useRef(new Animated.Value(-100)).current;
```

**Animation types:**

```tsx
// Timing - animate with easing
Animated.timing(opacity, {
  toValue: 1,
  duration: 300,
  easing: Easing.ease,
  useNativeDriver: true, // Runs on UI thread
}).start();

// Spring - physics-based
Animated.spring(scale, {
  toValue: 1,
  friction: 3,
  tension: 40,
  useNativeDriver: true,
}).start();

// Decay - decelerate to zero
Animated.decay(velocity, {
  velocity: 0.5,
  deceleration: 0.997,
  useNativeDriver: true,
}).start();
```

**Composite animations:**

```tsx
// Parallel - run simultaneously
Animated.parallel([
  Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
  Animated.timing(translateY, { toValue: 0, duration: 300, useNativeDriver: true }),
]).start();

// Sequence - run in order
Animated.sequence([
  Animated.timing(scale, { toValue: 1.2, duration: 150, useNativeDriver: true }),
  Animated.timing(scale, { toValue: 1, duration: 150, useNativeDriver: true }),
]).start();

// Stagger - start with delay between each
Animated.stagger(100, [
  Animated.timing(item1Opacity, { toValue: 1, useNativeDriver: true }),
  Animated.timing(item2Opacity, { toValue: 1, useNativeDriver: true }),
  Animated.timing(item3Opacity, { toValue: 1, useNativeDriver: true }),
]).start();

// Loop - repeat
Animated.loop(
  Animated.sequence([
    Animated.timing(rotation, { toValue: 1, duration: 1000, useNativeDriver: true }),
    Animated.timing(rotation, { toValue: 0, duration: 1000, useNativeDriver: true }),
  ])
).start();
```

**Using animated values in styles:**

```tsx
const opacity = useRef(new Animated.Value(0)).current;
const translateY = useRef(new Animated.Value(50)).current;

<Animated.View
  style={{
    opacity,
    transform: [{ translateY }],
  }}
>
  <Text>Animated content</Text>
</Animated.View>
```

**Animated components**: `Animated.View`, `Animated.Text`, `Animated.Image`, `Animated.ScrollView`

**Interpolation** maps animated values to other ranges:

```tsx
const scrollY = useRef(new Animated.Value(0)).current;

const headerOpacity = scrollY.interpolate({
  inputRange: [0, 100],
  outputRange: [0, 1],
  extrapolate: 'clamp', // Don't go below 0 or above 1
});

const headerScale = scrollY.interpolate({
  inputRange: [0, 100],
  outputRange: [1, 0.8],
  extrapolate: 'clamp',
});
```

**Event-driven animations** (scroll, pan):

```tsx
const scrollY = useRef(new Animated.Value(0)).current;

<Animated.ScrollView
  onScroll={Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: true }
  )}
  scrollEventThrottle={16}
>
  {/* Content */}
</Animated.ScrollView>
```

**Animation callbacks:**

```tsx
Animated.timing(opacity, {
  toValue: 1,
  duration: 300,
  useNativeDriver: true,
}).start(({ finished }) => {
  if (finished) {
    console.log('Animation completed');
  }
});
```

**useNativeDriver:**
The most important option. When `true`, the animation runs on the native UI thread:
- **Supported**: `transform`, `opacity`
- **NOT supported**: `width`, `height`, `margin`, `padding`, `backgroundColor`

If you try to animate an unsupported property with `useNativeDriver: true`, you'll get a warning.

**When to use Animated vs Reanimated:**
- **Animated**: Simple animations (fade, scale, slide), scroll-based animations, when you don't want extra dependencies
- **Reanimated**: Complex animations, gesture-driven animations, layout animations, anything requiring UI thread logic beyond simple interpolation

**Limitations:**
- Can only animate numeric values
- Limited to `transform` and `opacity` for native driver
- No ability to read animated values synchronously in JS
- No worklet support for custom animation logic
- Being gradually superseded by Reanimated for complex use cases
