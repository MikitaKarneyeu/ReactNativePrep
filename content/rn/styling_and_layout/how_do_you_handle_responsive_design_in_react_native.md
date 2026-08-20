Responsive design in React Native ensures your app looks good on devices with different screen sizes, pixel densities, and orientations. Since React Native uses density-independent pixels (dp), basic layouts already scale reasonably, but true responsiveness requires additional techniques.

**1. Flex-based layouts**: Use flexbox to create layouts that adapt to available space:

```tsx
function ResponsiveLayout() {
  return (
    <View style={{ flex: 1 }}>
      <View style={{ height: 60, backgroundColor: 'blue' }} /> {/* Fixed header */}
      <View style={{ flex: 1 }}> {/* Content fills remaining space */}
        <View style={{ flexDirection: 'row', flex: 1 }}>
          <View style={{ flex: 1, backgroundColor: 'red' }} />
          <View style={{ flex: 2, backgroundColor: 'green' }} />
        </View>
      </View>
    </View>
  );
}
```

**2. useWindowDimensions hook**: React to screen size changes dynamically:

```tsx
import { useWindowDimensions, View, Text } from 'react-native';

function ResponsiveComponent() {
  const { width, height } = useWindowDimensions();

  const isTablet = width >= 768;
  const isLandscape = width > height;

  return (
    <View style={{ flex: 1, flexDirection: isLandscape ? 'row' : 'column' }}>
      <View style={{ flex: 1, padding: isTablet ? 24 : 16 }}>
        <Text style={{ fontSize: isTablet ? 24 : 16 }}>
          Responsive content
        </Text>
      </View>
    </View>
  );
}
```

**3. Platform-specific values**: Adjust values based on platform:

```tsx
import { Platform } from 'react-native';

const styles = StyleSheet.create({
  header: {
    paddingTop: Platform.OS === 'ios' ? 44 : 20,
    ...Platform.select({
      ios: { fontFamily: 'San Francisco' },
      android: { fontFamily: 'Roboto' },
    }),
  },
});
```

**4. Percentage-based dimensions**: Use percentage strings for widths:

```tsx
<View style={{ width: '80%', height: '50%' }}>
  <Text>Sized with percentages</Text>
</View>
```

Note: Percentage `height` requires the parent to have a defined height.

**5. Breakpoint-like patterns**: Create responsive utilities:

```tsx
import { useWindowDimensions } from 'react-native';

function useBreakpoints() {
  const { width } = useWindowDimensions();
  return {
    isSmall: width < 375,
    isMedium: width >= 375 && width < 768,
    isLarge: width >= 768,
    isTablet: width >= 768,
  };
}

function MyComponent() {
  const { isSmall, isTablet } = useBreakpoints();

  return (
    <View style={{ padding: isTablet ? 24 : 12 }}>
      <Text style={{ fontSize: isSmall ? 14 : 18 }}>
        Responsive text
      </Text>
    </View>
  );
}
```

**6. Responsive font scaling**: Use `fontScale` from `useWindowDimensions`:

```tsx
function ResponsiveText({ children, size = 16 }) {
  const { fontScale } = useWindowDimensions();
  return (
    <Text style={{ fontSize: size / fontScale }}>
      {children}
    </Text>
  );
}
```

Or use the built-in scaling behavior and override with `allowFontScaling={false}` for critical layouts.

**7. Orientation handling**:

```tsx
import { useWindowDimensions } from 'react-native';

function OrientationAware() {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  return (
    <View style={{
      flex: 1,
      flexDirection: isLandscape ? 'row' : 'column',
    }}>
      <Sidebar style={{ width: isLandscape ? '30%' : '100%' }} />
      <Content style={{ flex: 1 }} />
    </View>
  );
}
```

**8. MediaQuery-like utility functions**:

```tsx
const spacing = {
  xs: (width) => width < 375 ? 4 : 8,
  sm: (width) => width < 375 ? 8 : 12,
  md: (width) => width < 375 ? 12 : 16,
  lg: (width) => width < 375 ? 16 : 24,
};
```

**Best practices:**
- Use flex for overall layout structure
- Use `useWindowDimensions` instead of `Dimensions.get()` (it updates on rotation/resize)
- Design for the smallest screen first, then enhance for larger screens
- Test on both phone and tablet sizes
- Account for different pixel densities (React Native handles this with dp, but images need @2x/@3x variants)
- Consider safe area insets with `react-native-safe-area-context`
