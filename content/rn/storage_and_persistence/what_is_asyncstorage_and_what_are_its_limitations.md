AsyncStorage is a simple, unencrypted, asynchronous key-value storage system for React Native. It's the most basic persistent storage option and is similar to the web's `localStorage`, but with an async API.

**Basic usage:**

```tsx
import AsyncStorage from '@react-native-async-storage/async-storage';

// Store data
await AsyncStorage.setItem('user', JSON.stringify({ name: 'John', age: 30 }));

// Read data
const userData = JSON.parse(await AsyncStorage.getItem('user'));

// Remove data
await AsyncStorage.removeItem('user');

// Clear all data
await AsyncStorage.clear();

// Get all keys
const keys = await AsyncStorage.getAllKeys();

// Multi-get
const values = await AsyncStorage.multiGet(['key1', 'key2', 'key3']);

// Multi-set
await AsyncStorage.multiSet([
  ['key1', 'value1'],
  ['key2', 'value2'],
]);
```

**Limitations:**

**1. No encryption**: Data is stored in plain text. Sensitive data like auth tokens, passwords, or personal information should never be stored in AsyncStorage. Use `react-native-keychain` or `expo-secure-store` instead.

**2. String-only values**: AsyncStorage only stores strings. You must serialize and deserialize objects:

```tsx
// Must stringify objects
await AsyncStorage.setItem('user', JSON.stringify({ name: 'John' }));

// Must parse when reading
const user = JSON.parse(await AsyncStorage.getItem('user'));
```

**3. Asynchronous API**: Every operation is async, which means you can't read values synchronously. This is problematic for startup operations where you need data immediately:

```tsx
// Can't do this synchronously
const theme = AsyncStorage.getItem('theme'); // Returns a Promise

// Must use useEffect or similar
useEffect(() => {
  AsyncStorage.getItem('theme').then(setTheme);
}, []);
```

**4. No indexing or querying**: You can't query by value, sort, or filter. To find data, you must load everything and filter in JavaScript:

```tsx
// No equivalent to SQL's: SELECT * FROM users WHERE age > 25
// You must:
const keys = await AsyncStorage.getAllKeys();
const values = await AsyncStorage.multiGet(keys);
const users = values
  .map(([key, value]) => JSON.parse(value))
  .filter((user) => user.age > 25);
```

**5. Performance degrades with large data**: AsyncStorage is not designed for large datasets. Operations slow down significantly with thousands of keys. The underlying implementation (SQLite on Android, file system on iOS) doesn't optimize for scale.

**6. No transactions**: There's no way to ensure atomicity of multiple operations:

```tsx
// If the app crashes between these two operations, data could be inconsistent
await AsyncStorage.setItem('balance', '100');
await AsyncStorage.setItem('lastUpdate', new Date().toISOString());
```

**7. Size limits**: On iOS, AsyncStorage may be purged by the system when storage is low. There's no guaranteed persistence. On Android, the default SQLite backend has practical limits.

**8. No real-time updates**: Changes aren't observed—you must manually read after writes to see updates.

**When to use AsyncStorage:**
- Simple app settings and preferences
- Non-sensitive user preferences
- Small amounts of cached data
- Prototyping and development
- Simple state persistence (with `redux-persist` or `zustand/middleware`)

**When NOT to use AsyncStorage:**
- Sensitive data (use secure storage)
- Large datasets (use SQLite or WatermelonDB)
- Data requiring complex queries (use SQLite)
- Frequently accessed data (use MMKV for better performance)
- Data requiring encryption (use MMKV with encryption or secure storage)

**Migration path**: If you start with AsyncStorage and hit its limitations, the typical upgrade path is:
- Performance issues → MMKV (drop-in replacement)
- Query needs → SQLite or WatermelonDB
- Security needs → react-native-keychain
