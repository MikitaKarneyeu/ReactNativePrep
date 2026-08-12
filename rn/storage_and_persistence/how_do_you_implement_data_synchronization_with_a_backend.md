Data synchronization ensures that local data on the device stays consistent with the server. This is critical for offline-first apps where users can make changes without connectivity and sync when they're back online.

**Common sync strategies:**

**1. Timestamp-based sync (last-write-wins):**

Each record has an `updatedAt` timestamp. On sync, the client sends its last sync time, and the server returns all records modified since then.

```tsx
async function syncData() {
  const lastSync = await AsyncStorage.getItem('lastSyncTime') || '1970-01-01';

  // Fetch changes from server
  const response = await fetch(`/api/sync?since=${lastSync}`);
  const { created, updated, deleted } = await response.json();

  // Apply changes to local database
  await database.write(async () => {
    for (const record of created) {
      await database.get('todos').create((todo) => {
        todo._raw.id = record.id;
        todo.title = record.title;
        todo.completed = record.completed;
        todo.updatedAt = new Date(record.updatedAt);
      });
    }

    for (const record of updated) {
      const todo = await database.get('todos').find(record.id);
      await todo.update((t) => {
        t.title = record.title;
        t.completed = record.completed;
        t.updatedAt = new Date(record.updatedAt);
      });
    }

    for (const id of deleted) {
      const todo = await database.get('todos').find(id);
      await todo.destroyPermanently();
    }
  });

  // Push local changes to server
  const localChanges = await getLocalChangesSince(lastSync);
  await fetch('/api/sync', {
    method: 'POST',
    body: JSON.stringify(localChanges),
  });

  await AsyncStorage.setItem('lastSyncTime', new Date().toISOString());
}
```

**2. Optimistic locking with version numbers:**

Each record has a version number. Updates are rejected if the version doesn't match (prevents conflicts).

```tsx
async function updateTodo(todo, changes) {
  try {
    const response = await fetch(`/api/todos/${todo.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...changes, version: todo.version }),
    });

    if (response.status === 409) {
      // Conflict - server version is different
      const serverVersion = await response.json();
      return handleConflict(todo, changes, serverVersion);
    }

    const updated = await response.json();
    await updateLocal(todo, updated);
  } catch (error) {
    // Queue for later sync
    await queueOfflineChange(todo.id, changes);
  }
}
```

**3. Conflict resolution strategies:**

```tsx
function handleConflict(local, server, base) {
  // Strategy 1: Last-write-wins
  return local.updatedAt > server.updatedAt ? local : server;

  // Strategy 2: Server wins
  return server;

  // Strategy 3: Client wins
  return local;

  // Strategy 4: Merge (field-level)
  return {
    ...base,
    title: local.updatedAt > server.updatedAt ? local.title : server.title,
    completed: local.updatedAt > server.updatedAt ? local.completed : server.completed,
  };

  // Strategy 5: Manual resolution
  return { conflict: true, local, server, base };
}
```

**4. Queue-based sync for offline mutations:**

```tsx
const offlineQueue = [];

function useOfflineSync() {
  const processQueue = useCallback(async () => {
    const queue = [...offlineQueue];
    offlineQueue.length = 0;

    for (const mutation of queue) {
      try {
        await executeMutation(mutation);
      } catch (error) {
        offlineQueue.push(mutation); // Re-queue on failure
      }
    }
  }, []);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected) processQueue();
    });
    return unsubscribe;
  }, [processQueue]);

  const enqueueMutation = useCallback((mutation) => {
    offlineQueue.push(mutation);
    AsyncStorage.setItem('offlineQueue', JSON.stringify(offlineQueue));
  }, []);

  return { enqueueMutation };
}
```

**5. Using TanStack Query for sync:**

```tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      networkMode: 'offlineFirst',
      staleTime: 5 * 60 * 1000,
    },
    mutations: {
      networkMode: 'offlineFirst',
    },
  },
});

// Sync on app focus
useFocusEffect(() => {
  queryClient.invalidateQueries();
});
```

**6. Full sync with WatermelonDB:**

```tsx
async function syncWithServer(database) {
  const lastPulledAt = await getLastPulledAt();

  const response = await fetch('/api/sync', {
    method: 'POST',
    body: JSON.stringify({ lastPulledAt }),
  });

  const { changes, timestamp } = await response.json();

  await database.write(async () => {
    // Apply server changes
    for (const [table, records] of Object.entries(changes)) {
      const collection = database.get(table);

      for (const record of records.created) {
        await collection.create((r) => {
          r._raw.id = record.id;
          Object.assign(r, record);
        });
      }

      for (const record of records.updated) {
        const existing = await collection.find(record.id);
        await existing.update((r) => Object.assign(r, record));
      }

      for (const id of records.deleted) {
        const existing = await collection.find(id);
        await existing.destroyPermanently();
      }
    }
  });

  await setLastPulledAt(timestamp);
}
```

**Best practices:**
- Use timestamps or version numbers for conflict detection
- Implement exponential backoff for retry logic
- Show sync status to the user (syncing, synced, error)
- Handle conflicts explicitly—don't silently lose data
- Sync in background when connectivity returns
- Use incremental sync (only changed records) instead of full sync
- Test sync thoroughly with poor connectivity scenarios
- Consider using a sync service like Firebase, Realm Sync, or PowerSync for complex requirements
