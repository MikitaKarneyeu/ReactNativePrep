Swipe gestures in React Native are implemented using React Native Gesture Handler combined with Reanimated for smooth animations. The most common swipe patterns are swipe-to-dismiss, swipe-to-reveal actions, and horizontal carousels.

**Basic swipe-to-dismiss:**

```tsx
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';

function SwipeToDelete({ onDelete, children }) {
  const translateX = useSharedValue(0);
  const itemHeight = useSharedValue(70);
  const opacity = useSharedValue(1);

  const pan = Gesture.Pan()
    .activeOffsetX([-20, 20]) // Activate after 20px horizontal movement
    .onUpdate((e) => {
      translateX.value = e.translationX;
    })
    .onEnd((e) => {
      if (Math.abs(e.translationX) > 150) {
        translateX.value = withTiming(500 * Math.sign(e.translationX));
        opacity.value = withTiming(0, {}, () => {
          itemHeight.value = withTiming(0);
        });
        runOnJS(onDelete)();
      } else {
        translateX.value = withTiming(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: opacity.value,
    height: itemHeight.value,
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={animatedStyle}>
        {children}
      </Animated.View>
    </GestureDetector>
  );
}
```

**Swipe-to-reveal actions (like iOS Mail):**

```tsx
function SwipeableRow({ onDelete, onArchive, children }) {
  const translateX = useSharedValue(0);

  const pan = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onUpdate((e) => {
      // Limit swipe to left only, max -200
      translateX.value = Math.min(0, Math.max(-200, e.translationX));
    })
    .onEnd((e) => {
      if (e.translationX < -100) {
        translateX.value = withTiming(-200); // Reveal actions
      } else {
        translateX.value = withTiming(0); // Close
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const actionsStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, -200], [0, 1]),
  }));

  return (
    <View>
      <Animated.View style={[styles.actions, actionsStyle]}>
        <Pressable onPress={onArchive} style={styles.actionButton}>
          <Text>Archive</Text>
        </Pressable>
        <Pressable onPress={onDelete} style={[styles.actionButton, styles.delete]}>
          <Text>Delete</Text>
        </Pressable>
      </Animated.View>
      <GestureDetector gesture={pan}>
        <Animated.View style={[styles.content, animatedStyle]}>
          {children}
        </Animated.View>
      </GestureDetector>
    </View>
  );
}
```

**Horizontal carousel/swipe:**

```tsx
function SwipeCarousel({ items }) {
  const translateX = useSharedValue(0);
  const currentIndex = useSharedValue(0);

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = -currentIndex.value * SCREEN_WIDTH + e.translationX;
    })
    .onEnd((e) => {
      const threshold = SCREEN_WIDTH / 3;

      if (e.translationX < -threshold && currentIndex.value < items.length - 1) {
        currentIndex.value += 1;
      } else if (e.translationX > threshold && currentIndex.value > 0) {
        currentIndex.value -= 1;
      }

      translateX.value = withSpring(-currentIndex.value * SCREEN_WIDTH, {
        damping: 20,
      });
    });

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={{ flexDirection: 'row' }}>
        {items.map((item, index) => (
          <Animated.View key={index} style={{ width: SCREEN_WIDTH }}>
            <CarouselItem item={item} />
          </Animated.View>
        ))}
      </Animated.View>
    </GestureDetector>
  );
}
```

**Swipe-up to reveal more content:**

```tsx
function SwipeUpSheet({ children }) {
  const translateY = useSharedValue(300);

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      translateY.value = Math.max(0, 300 + e.translationY);
    })
    .onEnd((e) => {
      if (e.translationY < -50) {
        translateY.value = withSpring(0); // Open
      } else {
        translateY.value = withSpring(300); // Close
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[styles.sheet, animatedStyle]}>
      <View style={styles.handle} />
      {children}
    </Animated.View>
  );
}
```

**Best practices:**
- Use `activeOffsetX`/`activeOffsetY` to avoid conflicts with scroll gestures
- Set thresholds for gesture recognition (don't trigger on small movements)
- Use `withSpring` for snap-back animations (feels more natural)
- Provide visual feedback during the swipe (background actions, handle indicators)
- Test gesture conflicts with FlatList/ScrollView (may need `simultaneousHandlers`)
- Use `cancelTranslation` to prevent gesture conflicts between horizontal and vertical gestures
