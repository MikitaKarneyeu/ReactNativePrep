Platform-specific styles allow you to apply different visual styles on iOS and Android to account for platform design differences, native UI conventions, and platform-specific capabilities like shadows.

**Using Platform.select:**

```tsx
import { Platform, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  text: {
    ...Platform.select({
      ios: { fontFamily: 'System' },
      android: { fontFamily: 'Roboto' },
    }),
  },
});
```

**Platform.OS check:**

```tsx
import { Platform } from 'react-native';

const paddingTop = Platform.OS === 'ios' ? 44 : 20;
const statusBarHeight = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight;
```

**Platform-specific files:**

React Native resolves platform-specific files automatically. Create two files with the same name but different extensions:

```
components/
  Header.ios.tsx    // Used on iOS
  Header.android.tsx // Used on Android
```

Import without the extension:
```tsx
import Header from './components/Header';
// Automatically resolves to Header.ios.tsx or Header.android.tsx
```

**Common platform-specific style differences:**

```tsx
const platformStyles = StyleSheet.create({
  // Shadows vs elevation
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },

  // Touch feedback
  touchable: {
    ...Platform.select({
      ios: {},
      android: {
        android_ripple: { color: 'rgba(0,0,0,0.1)' },
      },
    }),
  },

  // Font families
  font: {
    ...Platform.select({
      ios: { fontFamily: 'System' },
      android: { fontFamily: 'Roboto' },
    }),
  },

  // Input styling
  input: {
    ...Platform.select({
      ios: {
        paddingVertical: 12,
        paddingHorizontal: 8,
      },
      android: {
        paddingVertical: 8,
        paddingHorizontal: 4,
      },
    }),
  },
});
```

**Using Pressable for platform-specific touch feedback:**

```tsx
import { Pressable, Platform } from 'react-native';

function PlatformTouchable({ children, onPress, style }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        style,
        pressed && Platform.select({
          ios: { opacity: 0.7 },
          android: { opacity: 0.9 },
        }),
      ]}
      android_ripple={Platform.OS === 'android' ? { color: 'rgba(0,0,0,0.1)' } : undefined}
    >
      {children}
    </Pressable>
  );
}
```

**Platform-specific component usage:**

```tsx
import { Platform, StatusBar } from 'react-native';

function SafeHeader() {
  return (
    <View style={{
      paddingTop: Platform.OS === 'ios' ? 44 : StatusBar.currentHeight,
      backgroundColor: '#fff',
    }}>
      <Text>Header</Text>
    </View>
  );
}
```

**Creating a platform utility:**

```tsx
// utils/platform.ts
import { Platform, StyleSheet } from 'react-native';

export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';

export function platformStyle(iosStyle, androidStyle) {
  return Platform.OS === 'ios' ? iosStyle : androidStyle;
}

export function platformValue(iosValue, androidValue) {
  return Platform.OS === 'ios' ? iosValue : androidValue;
}

// Usage
const headerPadding = platformValue(44, 20);
```

**Best practices:**
- Use `Platform.select` for inline platform branching—it's the cleanest pattern
- Use platform-specific files (`.ios.tsx` / `.android.tsx`) when the component logic differs significantly between platforms
- Keep platform differences minimal—aim for consistent UX unless platform conventions demand differences
- Always handle both platforms—never code for only one
- Test on both platforms regularly to catch platform-specific visual issues
