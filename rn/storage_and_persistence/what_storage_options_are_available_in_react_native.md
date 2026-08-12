React Native offers several storage options, each suited for different types of data and access patterns. Choosing the right one depends on data size, structure, security requirements, and performance needs.

**1. AsyncStorage (key-value, unencrypted):**
- Simple key-value storage, similar to localStorage on the web
- Stores data as strings (JSON.stringify for objects)
- Asynchronous API
- Good for: user preferences, app settings, simple caches
- Limitations: no encryption, slow for large data, no indexing

```tsx
import AsyncStorage from '@react-native-async-storage/async-storage';

await AsyncStorage.setItem('key', JSON.stringify(value));
const data = JSON.parse(await AsyncStorage.getItem('key'));
```

**2. MMKV (key-value, fast):**
- Synchronous key-value storage (10-100x faster than AsyncStorage)
- Written in C++ for performance
- Supports encryption
- Good for: frequently accessed settings, Redux/Zustand persistence, feature flags

```tsx
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV({ id: 'app-storage' });
storage.set('key', 'value');
const value = storage.getString('key');
```

**3. SQLite (relational database):**
- Full SQL database on device
- Supports complex queries, indexing, transactions
- Good for: structured data, complex queries, large datasets, offline-first apps

```tsx
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase({ name: 'app.db' });
db.executeSql('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT)');
```

**4. WatermelonDB (built on SQLite):**
- Reactive, lazy SQLite wrapper
- Designed for React Native with observable queries
- Excellent performance for large datasets (10k+ records)
- Good for: complex offline-first apps with large local databases

**5. Realm (object database):**
- NoSQL object database
- Live objects that automatically update UI
- Built-in sync with MongoDB Atlas
- Good for: complex object graphs, real-time sync requirements

```tsx
import Realm from 'realm';

const realm = await Realm.open({ schema: [UserSchema] });
realm.write(() => {
  realm.create('User', { name: 'John', age: 30 });
});
```

**6. Secure storage (encrypted):**
- `react-native-keychain` (iOS Keychain / Android Keystore)
- `expo-secure-store`
- Good for: auth tokens, passwords, API keys, sensitive user data

```tsx
import * as Keychain from 'react-native-keychain';

await Keychain.setGenericPassword('auth', JSON.stringify({ token }));
const credentials = await Keychain.getGenericPassword();
```

**7. File system:**
- `react-native-fs` or `expo-file-system`
- Read/write files directly
- Good for: downloaded files, cached media, logs, large binary data

```tsx
import RNFS from 'react-native-fs';

await RNFS.writeFile(`${RNFS.DocumentDirectoryPath}/data.json`, JSON.stringify(data));
const content = await RNFS.readFile(`${RNFS.DocumentDirectoryPath}/data.json`);
```

**Choosing the right option:**

| Use case | Storage option |
|---|---|
| App settings, preferences | AsyncStorage or MMKV |
| Auth tokens, secrets | Secure storage (Keychain/Keystore) |
| Small structured data (<1000 items) | AsyncStorage or MMKV with JSON |
| Large structured data (10k+ items) | SQLite or WatermelonDB |
| Complex object relationships | Realm or WatermelonDB |
| Real-time sync with backend | Realm with MongoDB sync |
| Cached API responses | AsyncStorage or MMKV |
| Downloaded files, media | File system |
| Redux/Zustand state persistence | MMKV (fastest) or AsyncStorage |

**Performance comparison:**
- MMKV: Synchronous, ~100x faster than AsyncStorage
- AsyncStorage: Asynchronous, adequate for small data
- SQLite: Fast for complex queries, slower for simple key-value
- Realm: Fast for object access, live queries

Most apps use a combination: MMKV for settings and state persistence, secure storage for tokens, and SQLite or WatermelonDB for structured business data.
