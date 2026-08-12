`React.memo`, `useMemo`, and `useCallback` are React's built-in memoization tools that prevent unnecessary re-renders and recalculations. They work identically in React Native as in React web.

**React.memo** wraps a component and skips re-rendering if its props haven't changed (shallow comparison):

```tsx
// Without memo - re-renders when parent re-renders, even if item hasn't changed
function ListItem({ item, onPress }) {
  console.log(`Rendering ${item.id}`);
  return (
    <TouchableOpacity onPress={() => onPress(item.id)}>
      <Text>{item.name}</Text>
    </TouchableOpacity>
  );
}

// With memo - only re-renders when item or onPress reference changes
const ListItem = React.memo(function ListItem({ item, onPress }) {
  console.log(`Rendering ${item.id}`);
  return (
    <TouchableOpacity onPress={() => onPress(item.id)}>
      <Text>{item.name}</Text>
    </TouchableOpacity>
  );
});
```

**useCallback** memoizes a function reference, preventing child components from re-rendering when the parent re-renders:

```tsx
function ListScreen() {
  const [items, setItems] = useState(data);

  // Without useCallback - new function on every render
  // Memoized ListItem will still re-render because onPress is a new reference
  const handlePressBad = (id) => {
    navigation.navigate('Details', { id });
  };

  // With useCallback - stable function reference
  const handlePress = useCallback((id) => {
    navigation.navigate('Details', { id });
  }, [navigation]);

  return (
    <FlatList
      data={items}
      renderItem={({ item }) => (
        <ListItem item={item} onPress={handlePress} />
      )}
    />
  );
}
```

**useMemo** memoizes a computed value, avoiding expensive recalculations:

```tsx
function ProductList({ products, filter }) {
  // Without useMemo - filters on every render
  // const filteredProducts = products.filter(p => p.category === filter);

  // With useMemo - only recalculates when products or filter change
  const filteredProducts = useMemo(
    () => products.filter((p) => p.category === filter),
    [products, filter]
  );

  // Memoize expensive computations
  const totalPrice = useMemo(
    () => filteredProducts.reduce((sum, p) => sum + p.price, 0),
    [filteredProducts]
  );

  return (
    <View>
      <Text>Total: ${totalPrice}</Text>
      <FlatList data={filteredProducts} renderItem={renderItem} />
    </View>
  );
}
```

**When to use each:**

| Tool | Use when | Don't use when |
|---|---|---|
| `React.memo` | Child component renders often with same props | Component is cheap to render or always gets new props |
| `useCallback` | Passing callbacks to memoized children or as deps | Function is only used locally, not passed as prop |
| `useMemo` | Expensive computation or creating objects/arrays for memoized children | Simple calculations or values used only locally |

**Common mistakes:**

```tsx
// Mistake: memoizing with wrong dependencies
const handlePress = useCallback(() => {
  doSomething(item.id); // item is a dependency!
}, []); // Missing dependency - stale closure!

// Mistake: memoizing objects that change every render anyway
const style = useMemo(() => ({ padding: 10 }), []);
// Just use StyleSheet.create instead

// Mistake: premature optimization
// Don't memoize everything - profile first, optimize bottlenecks
```

**Important for React Native specifically**: In lists with many items, `React.memo` on list item components is critical. Without it, scrolling the list causes every item to re-render when the list's parent state changes, leading to frame drops.

```tsx
const MemoizedItem = React.memo(({ item }) => (
  <View style={styles.item}>
    <Text>{item.title}</Text>
  </View>
));

<FlatList
  data={items}
  renderItem={({ item }) => <MemoizedItem item={item} />}
  keyExtractor={(item) => item.id}
/>
```

Always profile before optimizing—use React DevTools Profiler to identify which components are re-rendering unnecessarily.
