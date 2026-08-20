Handling offline mode gracefully is essential for mobile apps, as users frequently lose connectivity. A good offline experience includes detecting connectivity changes, caching data, queuing mutations, and providing appropriate UI feedback.

**1. Detecting network state:**

```tsx
import { useNetInfo } from '@react-native-community/netinfo';

function App() {
  const netInfo = useNetInfo();

  if (netInfo.isConnected === false) {
    return <OfflineBanner />;
  }

  return <MainContent />;
}
```

**2. Creating an offline-aware API layer:**

```tsx
import NetInfo from '@react-native-community/netinfo';

async function apiCall(url, options) {
  const state = await NetInfo.fetch();

  if (!state.isConnected) {
    // Return cached data or throw offline error
    const cached = await getCachedData(url);
    if (cached) return cached;
    throw new Error('OFFLINE');
  }

  const response = await fetch(url, options);
  const data = await response.json();

  // Cache the response
  await cacheData(url, data);

  return data;
}
```

**3. Using TanStack Query for offline support:**

```tsx
import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import AsyncStorage from '@react-native-async-storage/async-storage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      cacheTime: 24 * 60 * 60 * 1000,
      networkMode: 'offlineFirst', // Use cache first, fetch in background
    },
    mutations: {
      networkMode: 'offlineFirst',
    },
  },
});

const persister = createAsyncStoragePersister({
  storage: AsyncStorage,
});

function App() {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
    >
      <MainNavigator />
    </PersistQueryClientProvider>
  );
}
```

**4. Queue mutations for when connectivity returns:**

```tsx
import NetInfo from '@react-native-community/netinfo';

const offlineQueue = [];

function useOfflineMutation(mutationFn) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables) => {
      const state = await NetInfo.fetch();

      if (!state.isConnected) {
        offlineQueue.push({ mutationFn, variables });
        return { queued: true };
      }

      return mutationFn(variables);
    },
  });
}

// Process queue when back online
useEffect(() => {
  const unsubscribe = NetInfo.addEventListener(async (state) => {
    if (state.isConnected && offlineQueue.length > 0) {
      const queue = [...offlineQueue];
      offlineQueue.length = 0;

      for (const { mutationFn, variables } of queue) {
        await mutationFn(variables);
      }
    }
  });

  return unsubscribe;
}, []);
```

**5. Display offline UI indicators:**

```tsx
function OfflineBanner() {
  return (
    <View style={styles.banner}>
      <Text style={styles.bannerText}>You are offline</Text>
    </View>
  );
}

function DataScreen() {
  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ['data'],
    queryFn: fetchData,
    networkMode: 'offlineFirst',
  });

  return (
    <View style={{ flex: 1 }}>
      {isFetching && <ActivityIndicator />}
      {isError && !data && <Text>Failed to load. Check your connection.</Text>}
      {data && <DataList data={data} />}
    </View>
  );
}
```

**6. Optimistic updates with offline support:**

```tsx
const mutation = useMutation({
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
});
```

**Best practices:**
- Always detect connectivity changes and update UI accordingly
- Cache API responses for offline reading
- Queue write operations (mutations) and sync when back online
- Show clear offline indicators so users know the app is in offline mode
- Use optimistic updates for better perceived responsiveness
- Implement conflict resolution for data modified offline
- Consider WatermelonDB or Realm for complex offline-first data needs
