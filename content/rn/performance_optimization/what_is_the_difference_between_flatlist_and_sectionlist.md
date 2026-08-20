FlatList and SectionList are both virtualized list components in React Native, but they serve different data structures and use cases.

**FlatList** renders a single, flat array of items:

```tsx
const data = [
  { id: '1', title: 'Item 1' },
  { id: '2', title: 'Item 2' },
  { id: '3', title: 'Item 3' },
];

<FlatList
  data={data}
  renderItem={({ item }) => <Text>{item.title}</Text>}
  keyExtractor={(item) => item.id}
/>
```

**SectionList** renders grouped data with section headers (and optional footers):

```tsx
const sections = [
  {
    title: 'Fruits',
    data: [
      { id: '1', name: 'Apple' },
      { id: '2', name: 'Banana' },
    ],
  },
  {
    title: 'Vegetables',
    data: [
      { id: '3', name: 'Carrot' },
      { id: '4', name: 'Broccoli' },
    ],
  },
];

<SectionList
  sections={sections}
  renderItem={({ item }) => <Text>{item.name}</Text>}
  renderSectionHeader={({ section }) => <Text>{section.title}</Text>}
  keyExtractor={(item) => item.id}
/>
```

**Key differences:**

| Aspect | FlatList | SectionList |
|---|---|---|
| Data structure | Flat array | Array of section objects with `data` arrays |
| Section headers | Not built-in (can add via `ItemSeparatorComponent`) | Built-in `renderSectionHeader` |
| Section footers | Not supported | `renderSectionFooter` |
| Sticky headers | `stickyHeaderIndices` | `stickySectionHeadersEnabled` (sticky section headers by default on iOS) |
| Use case | Simple lists, search results | Grouped data (contacts by letter, settings by category) |
| Performance | Slightly better (less overhead) | Slightly more overhead due to section management |

**Common use cases for SectionList:**
- Contacts organized alphabetically
- Settings grouped by category
- Calendar events by date
- App store-style sections
- Any data that naturally groups

**SectionList with sticky headers:**

```tsx
<SectionList
  sections={sections}
  renderItem={({ item }) => <ContactItem contact={item} />}
  renderSectionHeader={({ section }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
    </View>
  )}
  stickySectionHeadersEnabled={true} // Default on iOS, set for Android
/>
```

**Performance optimizations apply to both:**
- Use `React.memo` on item components
- Provide `getItemLayout` for fixed-height items
- Use `keyExtractor` with stable IDs
- Set `initialNumToRender`, `maxToRenderPerBatch`, `windowSize`
- Use `removeClippedSubviews` on Android

**SectionList-specific optimizations:**

```tsx
<SectionList
  sections={sections}
  renderItem={renderItem}
  renderSectionHeader={renderSectionHeader}
  keyExtractor={(item) => item.id}
  getItemLayout={(data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })}
  // Section headers have a fixed height
  SectionSeparatorComponent={() => <View style={styles.separator} />}
  // Disable sticky headers if not needed for better performance
  stickySectionHeadersEnabled={false}
/>
```

**Choosing between them:**
- Use **FlatList** when your data is a simple array or you don't need visual grouping
- Use **SectionList** when your data naturally groups into sections with headers
- If you need a section header but your data is flat, transform it into sections format or use FlatList with a custom header component
- Both support the same virtualization and performance optimization props

Both are virtualized by default (backed by `VirtualizedList`), so they handle large datasets efficiently.
