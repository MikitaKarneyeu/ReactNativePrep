Layout Animation in React Native refers to two different systems: the built-in `LayoutAnimation` API and Reanimated's layout animations. Both handle animating views when they are added, removed, or change position/size due to layout changes.

**1. Built-in LayoutAnimation API:**

`LayoutAnimation` automatically animates layout changes caused by state updates. When you call `LayoutAnimation.configureNext()` before a state change, React Native animates the resulting layout change.

```tsx
import { LayoutAnimation, Platform, UIManager } from 'react-native';

// Enable on Android (already enabled on iOS)
if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

function ExpandableCard() {
  const [expanded, setExpanded] = useState(false);

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <Pressable onPress={toggle}>
      <View style={{ height: expanded ? 200 : 80 }}>
        <Text>{expanded ? 'Expanded' : 'Collapsed'}</Text>
      </View>
    </Pressable>
  );
}
```

**Preset animations:**

```tsx
LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
```

**Custom configuration:**

```tsx
LayoutAnimation.configureNext({
  duration: 300,
  create: {
    type: LayoutAnimation.Types.easeInEaseOut,
    property: LayoutAnimation.Properties.opacity,
  },
  update: {
    type: LayoutAnimation.Types.spring,
    springDamping: 0.7,
  },
  delete: {
    type: LayoutAnimation.Types.easeInEaseOut,
    property: LayoutAnimation.Properties.opacity,
  },
});
```

**Common use cases:**
- Expanding/collapsing sections
- Adding/removing items from lists
- Reordering list items
- Showing/hiding modals or bottom sheets

**2. Reanimated Layout Animations:**

Reanimated provides a more powerful and flexible approach to layout animations with dedicated props for entering, exiting, and layout transitions.

**Entering animations** (when a view is mounted):

```tsx
import Animated, { FadeIn, FadeInDown, FadeInUp, SlideInRight, ZoomIn } from 'react-native-reanimated';

<Animated.View entering={FadeIn.duration(300).delay(100)}>
  <Text>I fade in when mounted</Text>
</Animated.View>

// Available entering animations:
// FadeIn, FadeInDown, FadeInUp, FadeInLeft, FadeInRight
// SlideInDown, SlideInUp, SlideInLeft, SlideInRight
// ZoomIn, ZoomInRotate, ZoomInDown, ZoomInUp
// BounceIn, FlipInXAxis, FlipInYAxis
// LightSpeedInLeft, LightSpeedInRight
// RollInLeft, RollInRight
```

**Exiting animations** (when a view is unmounted):

```tsx
<Animated.View exiting={FadeOut.duration(300)}>
  <Text>I fade out when removed</Text>
</Animated.View>

// Available exiting animations:
// FadeOut, FadeOutDown, FadeOutUp, FadeOutLeft, FadeOutRight
// SlideOutDown, SlideOutUp, SlideOutLeft, SlideOutRight
// ZoomOut, ZoomOutRotate, ZoomOutDown, ZoomOutUp
// BounceOut, FlipOutXAxis, FlipOutYAxis
```

**Layout animations** (when a view changes position/size):

```tsx
<Animated.View layout={Layout.springify().damping(15)}>
  <Text>I animate when my layout changes</Text>
</Animated.View>

// With configuration
<Animated.View
  layout={Layout.duration(300).easing(Easing.ease)}
>
  <Text>Smooth layout transition</Text>
</Animated.View>
```

**Combining all three:**

```tsx
function AnimatedItem({ item, index }) {
  return (
    <Animated.View
      entering={FadeInDown.delay(index * 100).duration(300)}
      exiting={FadeOut.duration(200)}
      layout={Layout.springify()}
      style={styles.item}
    >
      <Text>{item.title}</Text>
    </Animated.View>
  );
}

// List with animated items
function AnimatedList({ items }) {
  return (
    <FlatList
      data={items}
      renderItem={({ item, index }) => (
        <AnimatedItem item={item} index={index} />
      )}
    />
  );
}
```

**Custom entering/exiting animations:**

```tsx
const customEntering = (targetValues) => {
  'worklet';
  return {
    initialValues: {
      transform: [{ scale: 0.5 }, { rotate: '45deg' }],
      opacity: 0,
    },
    animations: {
      transform: [{ scale: withSpring(1) }, { rotate: withSpring('0deg') }],
      opacity: withTiming(1),
    },
  };
};

<Animated.View entering={customEntering}>
  <Text>Custom animation</Text>
</Animated.View>
```

**When to use each:**

| Use case | Tool |
|---|---|
| Simple expand/collapse | `LayoutAnimation` |
| List item add/remove | Reanimated entering/exiting |
| Staggered list entrance | Reanimated with delay |
| Complex custom transitions | Reanimated custom animations |
| Modal/sheet transitions | Reanimated entering/exiting |
| Reordering animations | Reanimated layout |

Reanimated layout animations are the more powerful and reliable choice for production apps.
