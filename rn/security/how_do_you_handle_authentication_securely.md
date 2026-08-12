Secure authentication in React Native involves protecting credentials during transmission, storing tokens securely, managing sessions properly, and implementing proper logout. Here's how to handle authentication securely.

**1. Use OAuth 2.0 / OpenID Connect:**

Don't build custom authentication. Use established protocols:

```tsx
import { authorize, refresh, revoke } from 'react-native-app-auth';

const config = {
  issuer: 'https://auth.example.com',
  clientId: 'your-client-id',
  redirectUrl: 'com.myapp://oauth/callback',
  scopes: ['openid', 'profile', 'email', 'offline_access'],
};

// Login
const result = await authorize(config);
// result.accessToken, result.refreshToken, result.idToken
```

**2. Store tokens in secure storage:**

```tsx
import * as Keychain from 'react-native-keychain';

async function storeTokens(accessToken, refreshToken) {
  await Keychain.setGenericPassword('auth', JSON.stringify({
    accessToken,
    refreshToken,
    storedAt: Date.now(),
  }), {
    accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  });
}

async function getTokens() {
  const credentials = await Keychain.getGenericPassword();
  if (credentials) {
    return JSON.parse(credentials.password);
  }
  return null;
}
```

**3. Implement token refresh:**

```tsx
async function refreshAccessToken(refreshToken) {
  const response = await fetch('https://auth.example.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=refresh_token&refresh_token=${refreshToken}&client_id=${CLIENT_ID}`,
  });

  if (!response.ok) {
    throw new Error('Token refresh failed');
  }

  const data = await response.json();
  await storeTokens(data.access_token, data.refresh_token);
  return data.access_token;
}

// Auto-refresh in API interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const tokens = await getTokens();
      if (tokens?.refreshToken) {
        const newAccessToken = await refreshAccessToken(tokens.refreshToken);
        error.config.headers.Authorization = `Bearer ${newAccessToken}`;
        return api.request(error.config);
      }
      // Refresh failed - logout
      await logout();
    }
    return Promise.reject(error);
  }
);
```

**4. Secure token transmission:**

```tsx
// Always use HTTPS
// Send tokens in headers, not URL
const response = await fetch(url, {
  headers: {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  },
});
```

**5. Implement proper logout:**

```tsx
async function logout() {
  try {
    // Revoke tokens server-side
    const tokens = await getTokens();
    if (tokens?.refreshToken) {
      await fetch('https://auth.example.com/oauth/revoke', {
        method: 'POST',
        body: `token=${tokens.refreshToken}`,
      });
    }
  } finally {
    // Clear local storage
    await Keychain.resetGenericPassword();
    await AsyncStorage.clear();
    // Reset navigation to login
    navigationRef.reset({ index: 0, routes: [{ name: 'Login' }] });
  }
}
```

**6. Implement session timeout:**

```tsx
function useSessionTimeout(timeoutMs = 30 * 60 * 1000) { // 30 minutes
  const lastActivity = useRef(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      if (Date.now() - lastActivity.current > timeoutMs) {
        logout();
      }
    }, 60000); // Check every minute

    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        lastActivity.current = Date.now();
      }
    });

    return () => {
      clearInterval(interval);
      subscription.remove();
    };
  }, [timeoutMs]);
}
```

**7. Biometric authentication for sensitive operations:**

```tsx
import * as Keychain from 'react-native-keychain';

async function authenticateWithBiometrics() {
  const result = await Keychain.getGenericPassword({
    authenticationPrompt: {
      title: 'Authenticate to continue',
      subtitle: 'Verify your identity',
    },
  });
  return !!result;
}

// Require biometric for sensitive actions
async function transferMoney(amount) {
  const authenticated = await authenticateWithBiometrics();
  if (!authenticated) {
    showMessage('Authentication required');
    return;
  }
  await api.transfer(amount);
}
```

**8. Multi-factor authentication:**

```tsx
function MFAScreen({ onVerified }) {
  const [code, setCode] = useState('');

  const verifyMFA = async () => {
    const response = await api.verifyMFA(code);
    if (response.verified) {
      onVerified();
    }
  };

  return (
    <View>
      <TextInput
        value={code}
        onChangeText={setCode}
        keyboardType="number-pad"
        maxLength={6}
        placeholder="Enter 6-digit code"
      />
      <Button title="Verify" onPress={verifyMFA} />
    </View>
  );
}
```

**Best practices:**
- Use OAuth 2.0 with PKCE for mobile apps
- Store tokens in Keychain/Keystore, never in AsyncStorage
- Implement automatic token refresh
- Send tokens in Authorization headers, never in URLs
- Implement session timeout
- Revoke tokens on logout (both client and server)
- Use biometric authentication for sensitive operations
- Implement rate limiting on the server for login attempts
- Log authentication events for security monitoring
- Handle offline authentication gracefully
