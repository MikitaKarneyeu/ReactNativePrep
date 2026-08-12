The `StyleSheet` API is React Native's built-in system for creating optimized style objects. It provides validation, performance optimization, and a clean pattern for organizing styles.

**Basic usage:**

```tsx
import { StyleSheet, View, Text } from 'react-native';

function MyComponent() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
});
```

**Why use StyleSheet over inline styles:**

**1. Performance**: `StyleSheet.create` sends styles over the bridge to native side once, and subsequent references use a numeric ID instead of re-sending the style object. Inline styles create a new JavaScript object on every render that must be sent over the bridge each time:

```tsx
// Inline - new object every render, sent over bridge every time
<View style={{ flex: 1, padding: 10 }} />

// StyleSheet - ID reference, sent to native once
const styles = StyleSheet.create({ container: { flex: 1, padding: 10 } });
<View style={styles.container} />
```

**2. Validation**: `StyleSheet.create` validates style properties at registration time, catching typos and invalid values early:

```tsx
StyleSheet.create({
  bad: {
    flexk: 1, // Warning: invalid property
    colr: 'red', // Warning: invalid property
  },
});
```

**3. Code organization**: StyleSheet separates style definitions from component JSX, making both easier to read and maintain:

```tsx
// Hard to read with inline styles
<View style={{ flex: 1, padding: 16, backgroundColor: '#fff', borderRadius: 8 }}>
  <Text style={{ fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 8 }}>Title</Text>
</View>

// Clean with StyleSheet
<View style={styles.card}>
  <Text style={styles.cardTitle}>Title</Text>
</View>
```

**4. Composition**: Styles can be composed by passing arrays:

```tsx
const styles = StyleSheet.create({
  base: { fontSize: 16, color: '#333' },
  bold: { fontWeight: 'bold' },
  primary: { color: '#007AFF' },
});

// Compose multiple styles
<Text style={[styles.base, styles.bold]}>Bold text</Text>
<Text style={[styles.base, styles.primary]}>Primary text</Text>
<Text style={[styles.base, styles.bold, styles.primary]}>Bold primary</Text>

// With conditional styles
<Text style={[styles.base, isActive && styles.primary]}>Conditional</Text>
```

**5. Flattening**: When you pass an array, React Native flattens it into a single style object, so arrays don't add overhead.

**Style composition patterns:**

```tsx
// Base + variant pattern
function Button({ variant = 'default', style }) {
  return (
    <Pressable style={[styles.button, styles[variant], style]}>
      <Text style={styles.buttonText}>Press me</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { padding: 12, borderRadius: 8, alignItems: 'center' },
  default: { backgroundColor: '#f0f0f0' },
  primary: { backgroundColor: '#007AFF' },
  danger: { backgroundColor: '#FF3B30' },
  buttonText: { fontSize: 16, fontWeight: '600' },
});
```

**StyleSheet.flatten**: Merges an array of styles into a single object:

```tsx
const flatStyle = StyleSheet.flatten([styles.base, styles.bold]);
// { fontSize: 16, color: '#333', fontWeight: 'bold' }
```

**StyleSheet.compose** (deprecated in favor of arrays): Was used to combine two styles:

```tsx
// Old
StyleSheet.compose(styles.a, styles.b)

// Modern
[styles.a, styles.b]
```

**Best practices:**
- Always use `StyleSheet.create` for static styles
- Place styles at the bottom of the file, after the component
- Use descriptive names that describe the element, not its appearance
- Avoid deeply nested style objects
- Use arrays for style composition instead of `Object.assign` or spread
- Accept a `style` prop on custom components to allow external overrides
