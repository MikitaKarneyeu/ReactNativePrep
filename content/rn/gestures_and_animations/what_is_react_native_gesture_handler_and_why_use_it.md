React Native Gesture Handler is a library that provides a native-driven gesture recognition system. It replaces React Native's built-in gesture responder system with gestures that run on the native UI thread, resulting in smooth, 60 FPS gesture handling.

**Why use it instead of React Native's built-in gestures:**

React Native's built-in `PanResponder` and touch events run on the JavaScript bridge. When the JS thread is busy (during re-renders, API calls, or heavy computation), gestures become laggy and unresponsive. Gesture Handler processes gestures on the native UI thread, ensuring smooth interactions regardless of JS thread load.

**Core components:**

```tsx
import { GestureHandlerRootView } from 'react-native-gesture-handler';

function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <MainNavigator />
    </GestureHandlerRootView>
  );
}
```

**Basic gesture types:**

```tsx
import {
  TapGestureHandler,
  LongPressGestureHandler,
  PanGestureHandler,
  PinchGestureHandler,
  RotationGestureHandler,
  FlingGestureHandler,
  State,
} from 'react-native-gesture-handler';

// Tap gesture
<TapGestureHandler
  onHandlerStateChange={({ nativeEvent }) => {
    if (nativeEvent.state === State.END) {
      console.log('Tapped!');
    }
  }}
>
  <View style={styles.box} />
</TapGestureHandler>

// Pan (drag) gesture
<PanGestureHandler
  onGestureEvent={onGestureEvent}
  onHandlerStateChange={onHandlerStateChange}
>
  <Animated.View style={styles.box} />
</PanGestureHandler>
```

**Modern API (recommended):**

The new declarative API (v2+) with Reanimated integration is the recommended approach:

```tsx
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';

function DraggableBox() {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);

  const pan = Gesture.Pan()
    .onStart(() => {
      offsetX.value = translateX.value;
      offsetY.value = translateY.value;
    })
    .onUpdate((event) => {
      translateX.value = offsetX.value + event.translationX;
      translateY.value = offsetY.value + event.translationY;
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

**Composing gestures:**

```tsx
const pinch = Gesture.Pinch().onUpdate((e) => {
  scale.value = e.scale;
});

const rotation = Gesture.Rotation().onUpdate((e) => {
  rotationAngle.value = e.rotation;
});

// Simultaneous gestures
const pinchAndRotate = Gesture.Simultaneous(pinch, rotation);

// Race (first gesture wins)
const tapOrLongPress = Gesture.Race(tap, longPress);

// Exclusive (higher priority wins)
const panOrTap = Gesture.Exclusive(pan, tap);
```

**Common patterns:**

```tsx
// Swipe to delete
const swipeToDelete = Gesture.Pan()
  .onUpdate((e) => {
    translateX.value = e.translationX;
  })
  .onEnd((e) => {
    if (Math.abs(e.translationX) > 150) {
      translateX.value = withTiming(500 * Math.sign(e.translationX));
      runOnJS(onDelete)();
    } else {
      translateX.value = withSpring(0);
    }
  });

// Double tap to like
const doubleTap = Gesture.Tap()
  .numberOfTaps(2)
  .onEnd(() => {
    runOnJS(onLike)();
  });

// Long press
const longPress = Gesture.LongPress()
  .minDuration(500)
  .onStart(() => {
    runOnJS(onLongPress)();
  });
```

**Why it matters for React Native:**
- Gestures run on the UI thread at 60 FPS
- Smooth, native-feeling interactions
- Integrates seamlessly with Reanimated for animations
- Supports complex gesture composition (simultaneous, race, exclusive)
- Replaces the problematic PanResponder with a reliable native implementation
- Used by most React Native apps as a core dependency

Install it early in your project—it's required by many other libraries including Reanimated's gesture integration.
