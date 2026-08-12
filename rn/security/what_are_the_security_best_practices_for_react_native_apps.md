Security in React Native requires protecting the app bundle, securing data storage, preventing unauthorized access, and ensuring secure network communication. Here are the essential best practices.

**1. Secure data storage:**
Never store sensitive data (tokens, passwords, API keys) in AsyncStorage or MMKV without encryption. Use platform-native secure storage:

```tsx
import * as Keychain from 'react-native-keychain';

// Store auth tokens securely
await Keychain.setGenericPassword('auth', JSON.stringify({
  accessToken,
  refreshToken,
}), {
  accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
});
```

**2. Certificate pinning:**
Prevent man-in-the-middle attacks by pinning your server's certificate:

```tsx
import { Platform } from 'react-native';

// iOS: configure in Info.plist or use TrustKit
// Android: configure network_security_config.xml
```

**3. Code obfuscation:**
Make reverse engineering harder by obfuscating your JavaScript bundle:

```bash
# Use react-native-obfuscating-transformer or Jscrambler
```

**4. Root/jailbreak detection:**
Detect compromised devices and limit functionality:

```tsx
import JailMonkey from 'jail-monkey';

if (JailMonkey.isJailBroken()) {
  // Limit functionality or warn user
}
```

**5. Secure network communication:**
- Always use HTTPS
- Implement certificate pinning
- Validate SSL certificates
- Don't disable certificate validation in production

**6. Protect API keys:**
Never hardcode API keys in JavaScript—they're extractable from the bundle. Use environment variables and backend proxying:

```tsx
// Bad - API key visible in bundle
const API_KEY = 'sk-1234567890';

// Good - call through your backend
const response = await fetch('https://your-api.com/proxy-endpoint');
```

**7. Input validation:**
Validate all user input on both client and server:

```tsx
function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}
```

**8. Secure authentication:**
- Use OAuth 2.0 / OpenID Connect
- Store tokens in secure storage (Keychain/Keystore)
- Implement token refresh
- Use biometric authentication for sensitive operations
- Implement session timeout

**9. Prevent debugging in production:**

```tsx
if (!__DEV__) {
  // Disable console.log in production
  console.log = () => {};
  console.warn = () => {};
  console.error = () => {};
}
```

**10. Keep dependencies updated:**
Regularly audit and update npm packages:

```bash
npm audit
npm audit fix
```

**11. Secure deep links:**
Validate deep link parameters and don't expose sensitive operations through deep links without authentication.

**12. Protect against code injection:**
- Don't use `eval()` or dynamic code execution
- Don't render unsanitized HTML
- Validate all data from external sources

**13. Platform-specific security:**

**iOS:**
- Enable App Transport Security (ATS)
- Use Keychain for sensitive data
- Implement data protection entitlements
- Disable debugging with `get-task-allow` in release builds

**Android:**
- Use Android Keystore for sensitive data
- Implement network security config
- Use ProGuard/R8 for code shrinking and obfuscation
- Disable debugging in release builds
- Use SafetyNet API for device integrity checks

**14. Secure WebView usage:**
If using WebView:
```tsx
<WebView
  source={{ uri: 'https://your-trusted-domain.com' }}
  originWhitelist={['https://your-trusted-domain.com']}
  javaScriptEnabled={true}
  allowsInlineMediaPlayback={false}
  // Disable navigation to unknown URLs
  onShouldStartLoadWithRequest={(request) =>
    request.url.startsWith('https://your-trusted-domain.com')
  }
/>
```

**15. Error handling:**
Don't expose sensitive information in error messages:
```tsx
catch (error) {
  // Log full error internally
  Sentry.captureException(error);
  // Show generic message to user
  showMessage('Something went wrong. Please try again.');
}
```

**Checklist for production:**
- [ ] Sensitive data in secure storage
- [ ] Certificate pinning implemented
- [ ] Code obfuscation enabled
- [ ] Root/jailbreak detection
- [ ] API keys not in client code
- [ ] Input validation on client and server
- [ ] HTTPS everywhere
- [ ] Dependencies audited
- [ ] Debugging disabled in release
- [ ] Source maps not exposed in production
