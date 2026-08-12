Flexbox is the primary layout system in React Native. It works similarly to CSS Flexbox on the web but with important differences in defaults and behavior.

**Default values differ from web CSS:**

| Property | React Native Default | Web CSS Default |
|---|---|---|
| `flexDirection` | `column` | `row` |
| `alignItems` | `stretch` | `stretch` |
| `flex` | Not set (auto) | Not set |
| `display` | Always flex | `block` |

The most significant difference is that `flexDirection` defaults to `column`, meaning children stack vertically by default. This aligns with mobile app layouts where content typically scrolls vertically.

**Basic flex layout:**

```tsx
// Vertical layout (default)
<View style={{ flex: 1 }}>
  <View style={{ height: 50, backgroundColor: 'red' }} />
  <View style={{ flex: 1, backgroundColor: 'blue' }} />
  <View style={{ height: 50, backgroundColor: 'green' }} />
</View>
// Red header (50px), blue fills remaining space, green footer (50px)

// Horizontal layout
<View style={{ flexDirection: 'row', flex: 1 }}>
  <View style={{ width: 50, backgroundColor: 'red' }} />
  <View style={{ flex: 1, backgroundColor: 'blue' }} />
  <View style={{ width: 50, backgroundColor: 'green' }} />
</View>
```

**Key flex properties:**

- **`flex`**: Defines how a child fills available space. `flex: 1` makes it fill all available space. Multiple children with flex share space proportionally.
- **`flexDirection`**: `column` (default), `row`, `column-reverse`, `row-reverse`
- **`justifyContent`**: Aligns children along the main axis (`flex-start`, `center`, `flex-end`, `space-between`, `space-around`, `space-evenly`)
- **`alignItems`**: Aligns children along the cross axis (`flex-start`, `center`, `flex-end`, `stretch`, `baseline`)
- **`alignSelf`**: Overrides `alignItems` for a single child
- **`flexWrap`**: `nowrap` (default), `wrap` - allows items to wrap to next line
- **`flexGrow`**: How much a child should grow relative to siblings
- **`flexShrink`**: How much a child should shrink relative to siblings
- **`flexBasis`**: Default size before growing/shrinking

**Common patterns:**

```tsx
// Centering content
<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
  <Text>Centered</Text>
</View>

// Space between header and footer
<View style={{ flex: 1, justifyContent: 'space-between' }}>
  <Header />
  <Content />
  <Footer />
</View>

// Equal columns
<View style={{ flexDirection: 'row' }}>
  <View style={{ flex: 1, backgroundColor: 'red' }} />
  <View style={{ flex: 1, backgroundColor: 'blue' }} />
  <View style={{ flex: 1, backgroundColor: 'green' }} />
</View>

// Proportional columns
<View style={{ flexDirection: 'row' }}>
  <View style={{ flex: 2, backgroundColor: 'red' }} />  {/* 2/3 */}
  <View style={{ flex: 1, backgroundColor: 'blue' }} /> {/* 1/3 */}
</View>
```

**Important React Native Flexbox behaviors:**

1. **No percentage values directly**: Use `Dimensions` API or flex ratios instead of `width: '50%'` (though percentage strings are now supported in newer versions).

2. **No `float`**: Flexbox handles all positioning—there's no float concept.

3. **No `grid`**: CSS Grid is not available in React Native.

4. **No `auto` margins for centering**: Use `justifyContent` and `alignItems` instead.

5. **`position: absolute`** works but removes the element from flex layout.

6. **AspectRatio** is available as a convenience property:
```tsx
<View style={{ aspectRatio: 16/9, width: '100%' }} />
```
