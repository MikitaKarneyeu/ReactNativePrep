Pagination in React Native lists loads data in chunks as the user scrolls, improving performance and reducing memory usage compared to loading all data at once. There are two common approaches: offset-based and cursor-based pagination.

**1. Offset-based pagination with FlatList:**

```tsx
function PaginatedList() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchItems = useCallback(async (pageNum) => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const response = await fetch(
        `https://api.example.com/items?page=${pageNum}&limit=20`
      );
      const data = await response.json();

      setItems((prev) => [...prev, ...data.items]);
      setHasMore(data.items.length === 20);
      setPage(pageNum);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore]);

  useEffect(() => { fetchItems(1); }, []);

  const handleEndReached = useCallback(() => {
    fetchItems(page + 1);
  }, [fetchItems, page]);

  return (
    <FlatList
      data={items}
      renderItem={({ item }) => <ListItem item={item} />}
      keyExtractor={(item) => item.id}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.5} // Trigger when 50% from bottom
      ListFooterComponent={loading ? <ActivityIndicator /> : null}
      ListEmptyComponent={!loading ? <EmptyState /> : null}
    />
  );
}
```

**2. Cursor-based pagination:**

```tsx
function CursorPaginatedList() {
  const [items, setItems] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchItems = useCallback(async () => {
    if (!hasMore) return;

    const url = cursor
      ? `https://api.example.com/items?cursor=${cursor}&limit=20`
      : `https://api.example.com/items?limit=20`;

    const response = await fetch(url);
    const data = await response.json();

    setItems((prev) => [...prev, ...data.items]);
    setCursor(data.nextCursor);
    setHasMore(!!data.nextCursor);
  }, [cursor, hasMore]);

  useEffect(() => { fetchItems(); }, []);

  return (
    <FlatList
      data={items}
      renderItem={({ item }) => <ListItem item={item} />}
      keyExtractor={(item) => item.id}
      onEndReached={fetchItems}
      onEndReachedThreshold={0.5}
    />
  );
}
```

**3. Using TanStack Query's useInfiniteQuery:**

```tsx
import { useInfiniteQuery } from '@tanstack/react-query';

function InfiniteList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['items'],
    queryFn: ({ pageParam = 1 }) =>
      fetch(`/api/items?page=${pageParam}&limit=20`).then((res) => res.json()),
    getNextPageParam: (lastPage, pages) => {
      return lastPage.items.length === 20 ? pages.length + 1 : undefined;
    },
  });

  const items = data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <FlatList
      data={items}
      renderItem={({ item }) => <ListItem item={item} />}
      keyExtractor={(item) => item.id}
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) fetchNextPage();
      }}
      onEndReachedThreshold={0.5}
      ListFooterComponent={isFetchingNextPage ? <ActivityIndicator /> : null}
    />
  );
}
```

**4. Cursor-based with useInfiniteQuery:**

```tsx
const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
  queryKey: ['items'],
  queryFn: ({ pageParam }) =>
    fetch(`/api/items?cursor=${pageParam || ''}&limit=20`).then((r) => r.json()),
  getNextPageParam: (lastPage) => lastPage.nextCursor,
});
```

**Optimization tips:**

```tsx
<FlatList
  data={items}
  renderItem={renderItem}
  keyExtractor={(item) => item.id}
  onEndReached={handleEndReached}
  onEndReachedThreshold={0.5}
  // Performance optimizations
  getItemLayout={getItemLayout}
  initialNumToRender={10}
  maxToRenderPerBatch={10}
  windowSize={5}
  removeClippedSubviews={true}
  ListFooterComponent={
    isFetchingNextPage
      ? <ActivityIndicator style={{ padding: 16 }} />
      : null
  }
/>
```

**Best practices:**
- Use `onEndReachedThreshold` of 0.5 or higher to pre-fetch before the user reaches the end
- Show a loading indicator in `ListFooterComponent` while fetching the next page
- Debounce `onEndReached` calls to prevent duplicate fetches
- Use `keyExtractor` with unique IDs, not array indices
- Consider using `FlashList` for better performance with very long paginated lists
- Cache previous pages to enable instant back-scrolling
- Handle the empty state and initial loading state separately
