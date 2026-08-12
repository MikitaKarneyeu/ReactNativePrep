Secure storage in React Native protects sensitive data like auth tokens, API keys, passwords, and personal information using platform-native security mechanisms: iOS Keychain and Android Keystore.

**Why not AsyncStorage or MMKV?**
AsyncStorage stores data in plain text (SQLite on Android, plist on iOS). MMKV can encrypt but doesn't use hardware-backed security. Platform secure storage uses hardware security modules where available, making it resistant to extraction even on rooted/jailbroken devices.

**Using react-native-keychain:**

```bash
npm install react-native-keychain
cd ios && pod install
```

```tsx
import * as Keychain from 'react-native-keychain';

// Store credentials
await Keychain.setGenericPassword('auth', JSON.stringify({
  accessToken: 'eyJhbGciOiJSUzI1NiIs...',
  refreshToken: 'dGhpcyBpcyBhIHJlZnJlc2g...',
}));

// Retrieve credentials
const credentials = await Keychain.getGenericPassword();
if (credentials) {
  const { accessToken, refreshToken } = JSON.parse(credentials.password);
}

// Delete credentials
await Keychain.resetGenericPassword();
```

**With access control (biometric protection):**

```tsx
import * as Keychain from 'react-native-keychain';

// Require biometric auth to access
await Keychain.setGenericPassword('auth', tokenString, {
  accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY,
  accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
});

// This will prompt Face ID / Touch ID / fingerprint
const credentials = await Keychain.getGenericPassword({
  authenticationPrompt: {
    title: 'Authentication required',
    subtitle: 'Please authenticate to access your data',
  },
});
```

**Access control options:**

```tsx
// Only when device is unlocked
Keychain.ACCESSIBLE.WHEN_UNLOCKED

// Only when device is unlocked, not backed up
Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY

// After first unlock (survives lock screen)
Keychain.ACCESSIBLE.AFTER_FIRST_UNLOCK

// After first unlock, not backed up
Keychain.ACCESSIBLE.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY

// Biometric required
Keychain.ACCESS_CONTROL.BIOMETRY_ANY

// Biometric or device passcode
Keychain.ACCESS_CONTROL.BIOMETRY_ANY_OR_DEVICE_PASSCODE
```

**Storing different types of sensitive data:**

```tsx
// Auth tokens
await Keychain.setGenericPassword('auth', JSON.stringify({
  accessToken,
  refreshToken,
  expiresAt,
}));

// API keys
await Keychain.setInternetCredentials(
  'api.example.com',
  'apiKey',
  'secret-api-key-value'
);

// Retrieve by service
const apiCreds = await Keychain.getInternetCredentials('api.example.com');
```

**Using expo-secure-store (Expo):**

```tsx
import * as SecureStore from 'expo-secure-store';

// Store
await SecureStore.setItemAsync('authToken', token, {
  keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
});

// Retrieve
const token = await SecureStore.getItemAsync('authToken');

// Delete
await SecureStore.deleteItemAsync('authToken');
```

**Integration with auth flow:**

```tsx
function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        const { accessToken } = JSON.parse(credentials.password);
        const isValid = await validateToken(accessToken);
        setIsAuthenticated(isValid);
      }
    } finally {
      setLoading(false);
    }
  }

  async function login(email, password) {
    const { accessToken, refreshToken } = await api.login(email, password);
    await Keychain.setGenericPassword('auth', JSON.stringify({
      accessToken,
      refreshToken,
    }));
    setIsAuthenticated(true);
  }

  async function logout() {
    await Keychain.resetGenericPassword();
    setIsAuthenticated(false);
  }

  return { isAuthenticated, loading, login, logout };
}
```

**Best practices:**
- Never store sensitive data in AsyncStorage or MMKV without encryption
- Use `WHEN_UNLOCKED_THIS_DEVICE_ONLY` for tokens that shouldn't be backed up
- Use biometric protection for highly sensitive data
- Clear secure storage on logout
- Don't store large amounts of data in Keychain/Keystore (it's designed for small secrets)
- Handle the case where Keychain access is denied or unavailable
- Use different service names/keys for different types of data
- Rotate tokens and update secure storage accordingly
