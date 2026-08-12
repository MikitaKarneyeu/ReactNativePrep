React Native styling is inspired by CSS but is a different system with significant differences. Understanding these differences prevents confusion for developers coming from web.

**Key differences:**

**1. No CSS cascade**: Styles do not inherit from parent to child (except for `Text` components). Each component must have its own styles:

```tsx
// Web CSS: child inherits font-family from parent
<div style={{ fontFamily: 'Arial' }}>
  <p>Text inherits Arial</p>
</div>

// React Native: child does NOT inherit
<View style={{ fontFamily: 'Arial' }}>
  <Text>Does NOT inherit font family</Text>
</View>

// Text components DO inherit text styles from parent Text
<Text style={{ fontFamily: 'Arial' }}>
  <Text>This inherits font family</Text>
</Text>
```

**2. No CSS selectors**: No class names, IDs, pseudo-classes (`:hover`, `:focus`), pseudo-elements (`::before`), or combinators (`>`, `+`, `~`):

```tsx
// No equivalent to this in React Native
.card { padding: 10; }
.card:hover { background: blue; }
```

**3. Flexbox defaults differ**:
- `flexDirection` defaults to `column` (not `row`)
- No `display: grid` or `display: inline`—everything is `display: flex` implicitly
- No `float` or `clear`

**4. Units**: Values are unitless numbers (density-independent pixels). No `px`, `em`, `rem`, `%`, `vw`, `vh`:

```tsx
// React Native
{ fontSize: 16, padding: 10, width: 200 }

// CSS
{ font-size: 16px; padding: 10px; width: 200px; }
```

**5. Properties use camelCase**: CSS kebab-case becomes camelCase:

```tsx
// React Native
{ backgroundColor: 'red', borderBottomWidth: 1 }

// CSS
{ background-color: red; border-bottom-width: 1px; }
```

**6. No shorthand properties**: You must specify each property individually:

```tsx
// No shorthand for margin/padding
// CSS: margin: 10px 20px;
// React Native:
{ marginTop: 10, marginRight: 20, marginBottom: 10, marginLeft: 20 }

// No shorthand for border
// CSS: border: 1px solid red;
// React Native:
{ borderWidth: 1, borderStyle: 'solid', borderColor: 'red' }
```

**7. Limited text styling**: Text styling is only available on `Text` components, not arbitrary elements:

```tsx
<Text style={{ color: 'blue', textDecorationLine: 'underline' }}>
  Styled text
</Text>
```

**8. No media queries**: Responsive design uses `Dimensions` API, `useWindowDimensions` hook, or flex-based layouts.

**9. StyleSheet.create** provides optimization and validation:

```tsx
const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontSize: 18, fontWeight: 'bold' },
});
```

**10. Supported properties are limited**: Many CSS properties have no equivalent:
- No `float`, `grid`, `clip-path`, `filter`, `box-shadow` (use `elevation` on Android, `shadow*` props on iOS)
- No CSS variables (`--custom-property`)
- No animations via CSS (`@keyframes`)—use `Animated` or `Reanimated`

**Shadow/elevation differences:**

```tsx
// iOS shadow
{
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
}

// Android elevation
{ elevation: 5 }

// Use Platform.select for cross-platform
{
  ...Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    android: { elevation: 5 },
  }),
}
```

Despite these differences, React Native styling is sufficient for building complex mobile UIs and the constraints encourage simpler, more maintainable styles.
