Storing sensitive data securely in React Native means using platform-native secure storage mechanisms that encrypt data at rest and protect it from unauthorized access. Never use AsyncStorage or MMKV for sensitive data—they store data in plain text.

**react-native-keychain (recommended):**

Uses iOS Keychain and Android Keystore, the most secure storage available on each platform:

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
  const tokens = JSON.parse(credentials.password);
}

// Delete credentials
await Keychain.resetGenericPassword();
```

**With biometric protection:**

```tsx
await Keychain.setGenericPassword('auth', tokenString, {
  accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY,
  accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
});

// This will prompt Face ID / Touch ID / fingerprint
const credentials = await Keychain.getGenericPassword({
  authenticationPrompt: {
    title: 'Authentication required',
    subtitle: 'Verify your identity to access secure data',
    cancel: 'Cancel',
  },
});
```

**Access control options:**

```tsx
Keychain.ACCESSIBLE.WHEN_UNLOCKED           // When device is unlocked
Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY // Not backed up
Keychain.ACCESSIBLE.AFTER_FIRST_UNLOCK       // After first unlock
Keychain.ACCESSIBLE.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY
Keychain.ACCESSIBLE.ALWAYS                   // Always accessible (less secure)

Keychain.ACCESS_CONTROL.BIOMETRY_ANY         // Any biometric
Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET // Current biometric set only
Keychain.ACCESS_CONTROL.DEVICE_PASSCODE      // Device passcode
Keychain.ACCESS_CONTROL.BIOMETRY_ANY_OR_DEVICE_PASSCODE
```

**expo-secure-store (Expo):**

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
  'secret-key-value'
);

// Multiple credentials
await Keychain.setInternetCredentials('app.api.com', 'user@example.com', 'password123');
const creds = await Keychain.getInternetCredentials('app.api.com');
```

**Integration with auth state:**

```tsx
function useSecureAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkStoredAuth();
  }, []);

  async function checkStoredAuth() {
    try {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        const { accessToken } = JSON.parse(credentials.password);
        const isValid = await validateToken(accessToken);
        setIsAuthenticated(isValid);
        if (!isValid) await Keychain.resetGenericPassword();
      }
    } finally {
      setLoading(false);
    }
  }

  async function login(email, password) {
    const { accessToken, refreshToken } = await api.login(email, password);
    await Keychain.setGenericPassword('auth', JSON.stringify({
      accessToken, refreshToken,
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

**What to store in secure storage:**
- Auth tokens (access tokens, refresh tokens)
- API keys and secrets
- User passwords (if you must store them)
- Encryption keys
- Biometric-protected data

**What NOT to store in secure storage:**
- Large amounts of data (use encrypted database)
- Non-sensitive user preferences (use MMKV)
- Cached API responses (use regular storage)
- App configuration data

**Best practices:**
- Clear secure storage on logout
- Use `WHEN_UNLOCKED_THIS_DEVICE_ONLY` for tokens that shouldn't be backed up
- Handle the case where biometric authentication fails or is unavailable
- Rotate tokens and update secure storage
- Don't log or expose secure storage contents
- Test on both iOS and Android
