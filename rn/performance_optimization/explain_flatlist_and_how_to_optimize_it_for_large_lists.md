FlatList is React Native's built-in component for rendering performant, scrollable lists. It uses virtualization to render only the items currently visible on screen (plus a small buffer), making it memory-efficient for large datasets.

**Basic usage:**

```tsx
<FlatList
  data={items}
  renderItem={({ item }) => <ListItem item={item} />}
  keyExtractor={(item) => item.id}
/>
```

**How FlatList works internally**: FlatList renders a `VirtualizedList` under the hood. It maintains a window of rendered items around the current scroll position. Items outside this window are unmounted and their memory is freed. The `initialNumToRender`, `maxToRenderPerBatch`, and `windowSize` props control this behavior.

**Optimization techniques:**

**1. Memoize list items** to prevent re-rendering unchanged items:

```tsx
const ListItem = React.memo(({ item, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <Image source={{ uri: item.image }} style={styles.image} />
    <Text>{item.title}</Text>
  </TouchableOpacity>
));

<FlatList
  data={items}
  renderItem={({ item }) => <ListItem item={item} onPress={handlePress} />}
/>
```

**2. Provide stable keyExtractor:**

```tsx
// Bad - index-based keys cause issues with inserts/deletes
keyExtractor={(item, index) => index.toString()}

// Good - use unique, stable IDs
keyExtractor={(item) => item.id}
```

**3. Optimize FlatList props:**

```tsx
<FlatList
  data={items}
  renderItem={renderItem}
  keyExtractor={keyExtractor}
  initialNumToRender={10}          // Items to render initially
  maxToRenderPerBatch={10}         // Items per render batch
  windowSize={5}                   // Viewport multiplier for pre-rendering
  removeClippedSubviews={true}     // Unmount offscreen views (Android)
  getItemLayout={(data, index) => ({  // Skip dynamic measurement
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })}
  ListEmptyComponent={EmptyState}
  ListFooterComponent={Footer}
/>
```

**4. Use getItemLayout for fixed-height items**: This avoids measuring items and enables instant scroll-to-index:

```tsx
const ITEM_HEIGHT = 80;

getItemLayout={(data, index) => ({
  length: ITEM_HEIGHT,
  offset: ITEM_HEIGHT * index,
  index,
})}
```

**5. Optimize renderItem**: Avoid creating new objects or functions inside `renderItem`:

```tsx
// Bad - creates new style object every render
renderItem={({ item }) => (
  <View style={{ padding: 10 }}>  {/* New object every render */}
    <Text>{item.title}</Text>
  </View>
)}

// Good - use StyleSheet
const styles = StyleSheet.create({ container: { padding: 10 } });
renderItem={({ item }) => (
  <View style={styles.container}>
    <Text>{item.title}</Text>
  </View>
)}
```

**6. Use React.memo with custom comparison for complex items:**

```tsx
const ListItem = React.memo(
  ({ item }) => <ComplexItem item={item} />,
  (prevProps, nextProps) => prevProps.item.id === nextProps.item.id
);
```

**7. Debounce scroll events** if you're doing work on scroll:

```tsx
const onScroll = useMemo(
  () => debounce((event) => {
    // handle scroll position
  }, 16),
  []
);
```

**8. Avoid inline functions for large lists**: Use `useCallback` for handlers:

```tsx
const handlePress = useCallback((id) => {
  navigation.navigate('Details', { id });
}, [navigation]);

renderItem={({ item }) => (
  <ListItem item={item} onPress={handlePress} />
)}
```

**When FlatList isn't enough**: For extremely large lists with complex items, consider `FlashList` by Shopify, which uses cell recycling (like RecyclerView on Android) instead of mounting/unmounting, achieving better performance and lower memory usage.

**Common pitfalls:**
- Using `ScrollView` instead of `FlatList` for long lists
- Not providing stable keys
- Nesting `FlatList` inside `ScrollView` (use `ListHeaderComponent`/`ListFooterComponent` instead)
- Not memoizing items, causing the entire list to re-render on any parent state change
