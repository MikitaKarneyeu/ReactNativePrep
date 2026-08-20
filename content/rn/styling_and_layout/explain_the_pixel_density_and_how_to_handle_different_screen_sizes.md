Pixel density (also called screen density or DPI) refers to the number of physical pixels per inch on a device's screen. React Native uses density-independent pixels (dp or DIPs) as its unit system, which abstracts away pixel density differences between devices.

**Understanding the concepts:**

- **Physical pixels**: The actual pixels on the screen. An iPhone 15 Pro has 2556×1179 physical pixels.
- **Points (iOS) / dp (Android)**: Density-independent units. The same device is 852×393 points. This is what React Native uses.
- **Pixel ratio**: The number of physical pixels per density-independent pixel. iPhone 15 Pro has a pixel ratio of 3.0.

```
Physical pixels = dp × pixel ratio
2556 = 852 × 3.0
```

**Accessing pixel density in React Native:**

```tsx
import { PixelRatio, Dimensions, useWindowDimensions } from 'react-native';

// Pixel ratio (2x, 3x, etc.)
const ratio = PixelRatio.get();

// Screen dimensions in dp
const { width, height } = Dimensions.get('window');

// Get physical pixels
const physicalWidth = PixelRatio.getPixelSizeForLayoutSize(width);

// Round to nearest pixel (for hairline borders)
const pixelPerfectBorder = PixelRatio.roundToNearestPixel(0.5);
```

**How React Native handles this automatically:**

When you specify dimensions in React Native, they're in dp:
```tsx
<View style={{ width: 100, height: 100 }} />
// This is 100dp on all devices
// On 2x device: 200 physical pixels
// On 3x device: 300 physical pixels
```

**Handling images for different densities:**

Use `@2x` and `@3x` suffixes in your image file names:

```
assets/
  logo.png        // 1x (baseline)
  logo@2x.png     // 2x (2x resolution)
  logo@3x.png     // 3x (3x resolution)
```

React Native automatically selects the appropriate image based on the device's pixel ratio:

```tsx
<Image source={require('./assets/logo.png')} />
// Automatically loads logo@3x.png on a 3x device
```

**Pixel-perfect borders:**

A 1px border on a 3x device is 3 physical pixels. To get a true 1-physical-pixel border:

```tsx
const styles = StyleSheet.create({
  border: {
    borderWidth: 1 / PixelRatio.get(),
  },
});
```

**Handling different screen sizes:**

```tsx
import { useWindowDimensions } from 'react-native';

function ResponsiveLayout() {
  const { width, height, scale, fontScale } = useWindowDimensions();

  return (
    <View style={{ flex: 1 }}>
      {/* Use flex for proportional sizing */}
      <View style={{ flex: 1, flexDirection: width > 768 ? 'row' : 'column' }}>
        <View style={{ flex: 1 }} />
        <View style={{ flex: 2 }} />
      </View>
    </View>
  );
}
```

**Font scaling:**

React Native respects the device's accessibility font size settings. `fontScale` tells you the current scale factor:

```tsx
const { fontScale } = useWindowDimensions();

// Fixed-size text that doesn't scale with accessibility settings
<Text style={{ fontSize: 16 / fontScale }}>Fixed size</Text>

// Or use allowFontScaling={false}
<Text style={{ fontSize: 16 }} allowFontScaling={false}>Fixed size</Text>
```

**Device-specific utilities:**

```tsx
import { Platform, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const isSmallDevice = width < 375;
const isTablet = width >= 768;
const isIOS = Platform.OS === 'ios';

// Aspect ratio for responsive sizing
const aspectRatio = height / width;
const isTallPhone = aspectRatio > 2;
```

**Best practices:**
- Never use physical pixels—always use dp (React Native's default)
- Provide @2x and @3x image assets
- Use `PixelRatio.roundToNearestPixel` for sub-pixel values
- Use `useWindowDimensions` (not `Dimensions.get`) for values that respond to rotation
- Use flex-based layouts for screen size adaptation
- Test on devices with different pixel ratios (2x and 3x) and sizes (phone and tablet)
- Consider using a responsive utility library for complex layouts
