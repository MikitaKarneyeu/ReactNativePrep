Caching API responses in React Native reduces network usage, improves performance, and enables offline functionality. Several strategies exist depending on your app's requirements.

**1. In-memory caching with TanStack Query:**

TanStack Query provides automatic in-memory caching with configurable stale times:

```tsx
import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,    // Data is fresh for 5 minutes
      cacheTime: 30 * 60 * 1000,   // Keep in cache for 30 minutes after last use
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  },
});

// Per-query configuration
useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId),
  staleTime: 10 * 60 * 1000, // Fresh for 10 minutes
});
```

**2. Persisting cache to storage:**

```tsx
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import AsyncStorage from '@react-native-async-storage/async-storage';

const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: 'REACT_QUERY_CACHE',
});

function App() {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister: asyncStoragePersister,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      }}
    >
      <MainApp />
    </PersistQueryClientProvider>
  );
}
```

**3. HTTP caching with cache headers:**

If your API sends proper cache headers (`Cache-Control`, `ETag`, `Last-Modified`), you can implement HTTP-level caching:

```tsx
async function cachedFetch(url, options = {}) {
  const cached = await AsyncStorage.getItem(`cache:${url}`);

  if (cached) {
    const { data, timestamp, etag } = JSON.parse(cached);

    // Check if still fresh
    if (Date.now() - timestamp < CACHE_DURATION) {
      return data;
    }

    // Conditional request with ETag
    const response = await fetch(url, {
      ...options,
      headers: { 'If-None-Match': etag },
    });

    if (response.status === 304) {
      return data; // Use cached data
    }

    // Update cache
    const newData = await response.json();
    await AsyncStorage.setItem(`cache:${url}`, JSON.stringify({
      data: newData,
      timestamp: Date.now(),
      etag: response.headers.get('ETag'),
    }));
    return newData;
  }

  // No cache - fetch fresh
  const response = await fetch(url);
  const data = await response.json();
  await AsyncStorage.setItem(`cache:${url}`, JSON.stringify({
    data,
    timestamp: Date.now(),
    etag: response.headers.get('ETag'),
  }));
  return data;
}
```

**4. Cache invalidation strategies:**

```tsx
// Time-based (staleTime in TanStack Query)
// Data becomes stale after a set duration

// Event-based invalidation
queryClient.invalidateQueries({ queryKey: ['users'] });

// Mutation-based invalidation
useMutation({
  mutationFn: updateUser,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['users'] });
    queryClient.invalidateQueries({ queryKey: ['user', userId] });
  },
});

// Optimistic updates
useMutation({
  mutationFn: updateTodo,
  onMutate: async (newTodo) => {
    await queryClient.cancelQueries({ queryKey: ['todos'] });
    const previous = queryClient.getQueryData(['todos']);
    queryClient.setQueryData(['todos'], (old) =>
      old.map((t) => (t.id === newTodo.id ? newTodo : t))
    );
    return { previous };
  },
  onError: (err, newTodo, context) => {
    queryClient.setQueryData(['todos'], context.previous);
  },
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ['todos'] });
  },
});
```

**5. LRU (Least Recently Used) cache for custom implementations:**

```tsx
class LRUCache {
  constructor(maxSize = 100) {
    this.maxSize = maxSize;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) return null;
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value); // Move to end (most recent)
    return value;
  }

  set(key, value) {
    if (this.cache.has(key)) this.cache.delete(key);
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, { value, timestamp: Date.now() });
  }
}
```

**6. Image caching:**

```tsx
import FastImage from 'react-native-fast-image';

<FastImage
  source={{
    uri: imageUrl,
    cache: FastImage.cacheControl.immutable, // Cache forever
    // or
    cache: FastImage.cacheControl.web, // Use HTTP cache headers
  }}
/>
```

**Best practices:**
- Use TanStack Query for most caching needs—it handles deduplication, background refetch, and cache management automatically
- Persist critical cache data to AsyncStorage for offline support
- Implement proper cache invalidation when data is modified
- Use ETags or Last-Modified headers for efficient conditional requests
- Set appropriate stale times based on how frequently data changes
- Consider the cache size to avoid excessive storage usage
- Always have a strategy for cache misses
