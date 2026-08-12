FlashList is a high-performance list component developed by Shopify as a drop-in replacement for FlatList. It achieves better performance through cell recycling, a technique used by native list components like RecyclerView (Android) and UICollectionView (iOS).

**How FlatList works**: FlatList uses a virtualized approach where items are mounted when they enter the viewport window and unmounted when they leave. This mounting/unmounting cycle is expensive—each mount triggers React reconciliation, native view creation, and layout computation.

**How FlashList works**: FlashList recycles cells. When an item scrolls off screen, its cell is reused to display a new item entering the viewport. Instead of mounting new React components, it updates the recycled cell's data. This eliminates the mount/unmount overhead entirely.

**Key differences:**

| Aspect | FlatList | FlashList |
|---|---|---|
| Cell recycling | No (mount/unmount) | Yes (recycles cells) |
| Memory usage | Higher (all mounted items) | Lower (recycled pool) |
| Mount performance | Slower with complex items | Faster (fewer mounts) |
| API | Built-in React Native | Third-party (`@shopify/flash-list`) |
| Requires estimated item size | Optional (`getItemLayout`) | Required (`estimatedItemSize`) |
| Blank areas during scroll | Possible with fast scrolling | Minimal due to recycling |
| Section support | `SectionList` built-in | `FlashList` supports sections |

**Basic usage:**

```tsx
import { FlashList } from '@shopify/flash-list';

<FlashList
  data={items}
  renderItem={({ item }) => <ListItem item={item} />}
  estimatedItemSize={80}  // Required - estimated average item height
/>
```

**Why estimatedItemSize is required**: FlashList needs to estimate the total scrollable content size to render the scroll indicator and determine how many items to keep in the recycling pool. Without it, the scroll bar would be inaccurate.

**Optimization with FlashList:**

```tsx
<FlashList
  data={items}
  renderItem={({ item }) => <ListItem item={item} />}
  estimatedItemSize={80}
  keyExtractor={(item) => item.id}
  // Optional optimizations
  overrideItemLayout={(layout, item) => {
    layout.size = item.expanded ? 200 : 80; // Dynamic item sizes
  }}
  drawDistance={200}  // Distance ahead to pre-render
/>
```

**When to use FlashList over FlatList:**

- Large lists (100+ items) with complex item components
- Lists where scrolling performance is critical
- Lists with many images or heavy components
- When you're seeing frame drops during scrolling with FlatList

**When FlatList might be sufficient:**

- Small lists (< 50 items) with simple item components
- When you need the simplicity of a built-in component
- When you need `SectionList` and FlashList's section support doesn't meet your needs

**FlashList with RecyclerListView**: FlashList is built on top of `recyclerlistview` by Flipkart, which provides the cell recycling engine. FlashList adds a React-friendly API on top.

**Migration from FlatList:**

FlashList is designed as a drop-in replacement. The migration is straightforward:

```tsx
// Before
import { FlatList } from 'react-native';
<FlatList data={data} renderItem={renderItem} />

// After
import { FlashList } from '@shopify/flash-list';
<FlashList data={data} renderItem={renderItem} estimatedItemSize={80} />
```

The main difference is you must provide `estimatedItemSize`. FlashList will also warn you if your items don't have consistent key extraction.

**Performance comparison**: In Shopify's benchmarks, FlashList shows significant improvements in:
- Frames per second during scrolling (maintains 60 FPS where FlatList drops)
- Time to render large lists on mount
- Memory usage in lists with many items
- Elimination of "blank areas" during fast scrolling

FlashList should be your default choice for any list where performance matters.
