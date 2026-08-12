MMKV is a high-performance key-value storage library originally developed by WeChat (Tencent). It's 10-100x faster than AsyncStorage because it's written in C++ and uses memory-mapped files with synchronous access.

**Installation and setup:**

```bash
npm install react-native-mmkv
cd ios && pod install
```

**Basic usage:**

```tsx
import { MMKV } from 'react-native-mmkv';

// Create a storage instance
const storage = new MMKV();

// Store values (synchronous!)
storage.set('user.name', 'John');
storage.set('user.age', 30);
storage.set('user.active', true);
storage.set('user.score', 95.5);

// Read values (synchronous!)
const name = storage.getString('user.name');   // 'John'
const age = storage.getNumber('user.age');      // 30
const active = storage.getBoolean('user.active'); // true
const score = storage.getNumber('user.score');   // 95.5

// Delete
storage.delete('user.name');

// Check existence
const exists = storage.contains('user.name');

// Get all keys
const keys = storage.getAllKeys();

// Clear all
storage.clearAll();
```

**Multiple storage instances:**

```tsx
// Separate storage for different purposes
const appStorage = new MMKV({ id: 'app-settings' });
const cacheStorage = new MMKV({ id: 'cache' });
const secureStorage = new MMKV({ id: 'secure', encryptionKey: 'my-key' });
```

**With encryption:**

```tsx
const storage = new MMKV({
  id: 'encrypted',
  encryptionKey: 'my-secure-encryption-key-32-chars!',
});

// All operations are the same—encryption is transparent
storage.set('secret', 'encrypted-at-rest');
const secret = storage.getString('secret'); // Automatically decrypted
```

**Using MMKV with Zustand:**

```tsx
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();

const mmkvStorage = createJSONStorage(() => ({
  getItem: (key) => storage.getString(key) ?? null,
  setItem: (key, value) => storage.set(key, value),
  removeItem: (key) => storage.delete(key),
}));

const useStore = create(
  persist(
    (set) => ({
      count: 0,
      increment: () => set((state) => ({ count: state.count + 1 })),
    }),
    {
      name: 'app-storage',
      storage: mmkvStorage,
    }
  )
);
```

**Using MMKV with Redux Toolkit:**

```tsx
import { persistStore, persistReducer } from 'redux-persist';
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();

const reduxStorage = {
  setItem: (key, value) => {
    storage.set(key, value);
    return Promise.resolve(true);
  },
  getItem: (key) => {
    const value = storage.getString(key);
    return Promise.resolve(value);
  },
  removeItem: (key) => {
    storage.delete(key);
    return Promise.resolve();
  },
};

const persistConfig = {
  key: 'root',
  storage: reduxStorage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
```

**Listening for changes:**

```tsx
const storage = new MMKV();

const listener = storage.addOnValueChangedListener((key) => {
  const newValue = storage.getString(key);
  console.log(`Key ${key} changed to ${newValue}`);
});

// Remove listener when done
listener.remove();
```

**Performance comparison:**

| Operation | AsyncStorage | MMKV |
|---|---|---|
| Write 1000 items | ~2000ms | ~15ms |
| Read 1000 items | ~1500ms | ~5ms |
| API | Async (Promise) | Sync |
| Implementation | JS + SQLite/Files | C++ (mmap) |

**When to use MMKV:**
- As a drop-in replacement for AsyncStorage (faster, same use case)
- Persisting Redux/Zustand state
- Feature flags and app configuration
- Frequently accessed settings
- Any key-value storage that doesn't require encryption (or use MMKV's built-in encryption)

**Limitations:**
- Synchronous API (can block JS thread for very large operations, though this is rarely an issue)
- No complex querying (use SQLite for that)
- Binary storage format (not human-readable)
- Limited to key-value pairs (no relational data)

MMKV has become the recommended replacement for AsyncStorage in most React Native projects due to its superior performance and synchronous API.
