Persisting state across app restarts ensures users don't lose their data, preferences, or authentication status when the app is killed and reopened. The approach depends on your state management library and the type of data you're persisting.

**With Zustand using the persist middleware:**

```tsx
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useStore = create(
  persist(
    (set) => ({
      theme: 'light',
      favorites: [],
      setTheme: (theme) => set({ theme }),
      addFavorite: (item) => set((state) => ({
        favorites: [...state.favorites, item],
      })),
    }),
    {
      name: 'app-storage', // key in AsyncStorage
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        theme: state.theme,
        favorites: state.favorites,
        // Exclude non-serializable or temporary state
      }),
    }
  )
);
```

**With Redux using redux-persist:**

```tsx
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'preferences', 'cart'], // only persist these reducers
  blacklist: ['ui', 'temporary'], // never persist these
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = configureStore({ reducer: persistedReducer });
const persistor = persistStore(store);

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<SplashScreen />} persistor={persistor}>
        <MainNavigator />
      </PersistGate>
    </Provider>
  );
}
```

**What to persist vs. what not to persist:**

| Persist | Don't persist |
|---|---|
| Auth tokens | Loading states |
| User preferences (theme, language) | Error states |
| Cart/favorites data | Temporary form data |
| Onboarding completion status | API cache (use TanStack Query cache) |
| Draft content | Sensitive data (use secure storage) |

**For sensitive data**, use secure storage instead of AsyncStorage:

```tsx
import * as Keychain from 'react-native-keychain';

// Store securely
await Keychain.setGenericPassword('auth', JSON.stringify({
  accessToken,
  refreshToken,
}));

// Read securely
const credentials = await Keychain.getGenericPassword();
if (credentials) {
  const { accessToken, refreshToken } = JSON.parse(credentials.password);
}
```

**Handling migration**: When your state shape changes between app versions, you need migration logic:

```tsx
const persistConfig = {
  key: 'root',
  version: 2,
  storage: AsyncStorage,
  migrate: async (state) => {
    if (state?._persist?.version === 1) {
      // Migrate from v1 to v2
      return {
        ...state,
        user: { ...state.user, newField: 'default' },
        _persist: { ...state._persist, version: 2 },
      };
    }
    return state;
  },
};
```

**Performance considerations:**
- Persist only what you need (use `partialize` or `whitelist`)
- Debounce writes to avoid excessive storage operations during rapid state changes
- For large datasets, consider SQLite or MMKV instead of AsyncStorage
- Handle hydration errors gracefully (corrupted storage data)
- Show a loading screen while hydration completes using PersistGate or similar pattern
