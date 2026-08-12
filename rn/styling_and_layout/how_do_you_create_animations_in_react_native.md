React Native provides several animation APIs, from simple built-in tools to powerful third-party libraries. The choice depends on the complexity and performance requirements of your animation.

**1. Animated API (built-in):**

The `Animated` API is React Native's built-in animation system. It provides declarative animations that can run on the native UI thread for performance:

```tsx
import { Animated } from 'react-native';

function FadeInView({ children }) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true, // Runs on UI thread
    }).start();
  }, []);

  return (
    <Animated.View style={{ opacity }}>
      {children}
    </Animated.View>
  );
}
```

**Animated API types:**
- `Animated.timing`: Animate to a target value with easing
- `Animated.spring`: Physics-based spring animation
- `Animated.decay`: Gradually decelerate to zero
- `Animated.parallel`: Run multiple animations simultaneously
- `Animated.sequence`: Run animations in order
- `Animated.stagger`: Start animations with a delay between each
- `Animated.loop`: Repeat an animation

```tsx
// Spring animation
Animated.spring(scale, {
  toValue: 1,
  friction: 3,
  tension: 40,
  useNativeDriver: true,
}).start();

// Parallel animations
Animated.parallel([
  Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
  Animated.timing(translateY, { toValue: 0, duration: 300, useNativeDriver: true }),
]).start();

// Sequence with stagger
Animated.stagger(100, [
  Animated.timing(item1, { toValue: 1, useNativeDriver: true }),
  Animated.timing(item2, { toValue: 1, useNativeDriver: true }),
  Animated.timing(item3, { toValue: 1, useNativeDriver: true }),
]).start();
```

**2. LayoutAnimation (built-in):**

Simplifies layout transitions when views are added, removed, or change size:

```tsx
import { LayoutAnimation, Platform, UIManager } from 'react-native';

// Enable on Android
if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

function ExpandableCard({ expanded, onToggle }) {
  return (
    <Pressable
      onPress={() => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        onToggle(!expanded);
      }}
    >
      <View style={{ height: expanded ? 200 : 80 }}>
        <Text>{expanded ? 'Expanded' : 'Collapsed'}</Text>
      </View>
    </Pressable>
  );
}
```

**3. Reanimated (third-party):**

`react-native-reanimated` provides the most powerful animation capabilities, running animations entirely on the UI thread using worklets:

```tsx
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

function AnimatedCard() {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPressIn={() => { scale.value = withSpring(0.95); }}
      onPressOut={() => { scale.value = withSpring(1); }}
    >
      <Animated.View style={[styles.card, animatedStyle]}>
        <Text>Press me</Text>
      </Animated.View>
    </Pressable>
  );
}
```

**4. react-native-gesture-handler integration:**

Combine with Reanimated for gesture-driven animations:

```tsx
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

function DraggableBox() {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = e.translationX;
      translateY.value = e.translationY;
    })
    .onEnd(() => {
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[styles.box, animatedStyle]} />
    </GestureDetector>
  );
}
```

**When to use each:**

| API | Use case |
|---|---|
| `Animated` | Simple animations (fade, slide, scale), interaction-driven animations |
| `LayoutAnimation` | Layout transitions (expand/collapse, list reorder) |
| `Reanimated` | Complex animations, gesture-driven animations, shared element transitions, anything needing UI thread performance |
| `entering/exiting` props | Mount/unmount animations with Reanimated |

**Best practices:**
- Always use `useNativeDriver: true` with `Animated` when animating transform or opacity
- Use Reanimated for anything complex or gesture-driven
- Avoid animating layout properties (`width`, `height`, `margin`) on the JS thread—use `LayoutAnimation` or Reanimated's layout animations
- Use `useSharedValue` and `useAnimatedStyle` from Reanimated for reactive animations
- Test animations on lower-end devices to ensure 60 FPS
