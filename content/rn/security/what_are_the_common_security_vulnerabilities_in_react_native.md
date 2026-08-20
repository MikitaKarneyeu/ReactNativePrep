React Native apps share common web and mobile security vulnerabilities, plus some unique to the platform. Understanding these vulnerabilities is the first step to preventing them.

**1. Insecure data storage:**
Storing sensitive data (tokens, passwords, personal information) in plain text using AsyncStorage or MMKV without encryption.

```tsx
// Vulnerable
await AsyncStorage.setItem('authToken', token);
await AsyncStorage.setItem('password', password);

// Secure
await Keychain.setGenericPassword('auth', token);
```

**2. Exposed API keys and secrets:**
Hardcoding API keys in JavaScript that can be extracted from the bundle.

```tsx
// Vulnerable - visible in the JS bundle
const FIREBASE_API_KEY = 'AIzaSy...';
const STRIPE_KEY = 'sk_live_...';

// Secure - use backend proxy or environment-specific config
const response = await fetch('https://your-api.com/proxy');
```

**3. Man-in-the-middle attacks:**
Lack of certificate pinning allows attackers to intercept HTTPS traffic.

```tsx
// Vulnerable - accepts any valid certificate
fetch('https://api.example.com/data');

// Secure - with certificate pinning
sslFetch('https://api.example.com/data', {
  sslPinning: { certs: ['my-cert'] },
});
```

**4. Insecure deep links:**
Not validating deep link parameters, allowing malicious apps to trigger unintended actions.

```tsx
// Vulnerable - no validation
function handleDeepLink(url) {
  const { action, params } = parseDeepLink(url);
  executeAction(action, params); // Arbitrary action execution
}

// Secure - whitelist actions and validate params
function handleDeepLink(url) {
  const { action, params } = parseDeepLink(url);
  const allowedActions = ['openProfile', 'openSettings'];
  if (allowedActions.includes(action)) {
    executeAction(action, validateParams(params));
  }
}
```

**5. Unvalidated input:**
Not validating user input, leading to injection attacks or data corruption.

```tsx
// Vulnerable
const query = userInput;
db.executeSql(`SELECT * FROM users WHERE name = '${query}'`);

// Secure
db.executeSql('SELECT * FROM users WHERE name = ?', [userInput]);
```

**6. Insecure WebView usage:**
Allowing WebView to load arbitrary URLs or execute JavaScript from untrusted sources.

```tsx
// Vulnerable
<WebView source={{ uri: userInputUrl }} javaScriptEnabled={true} />

// Secure
<WebView
  source={{ uri: 'https://trusted-domain.com' }}
  originWhitelist={['https://trusted-domain.com']}
  onShouldStartLoadWithRequest={(req) =>
    req.url.startsWith('https://trusted-domain.com')
  }
/>
```

**7. Code injection via eval:**
Using `eval()` or dynamic code execution with untrusted input.

```tsx
// Vulnerable
eval(userInput);
new Function(userInput)();

// Secure - never use eval with user input
// Use JSON.parse for data
const data = JSON.parse(userInput);
```

**8. Debugging left enabled:**
Debugging features exposed in production builds.

```tsx
// Vulnerable - debugging enabled in production
console.log('Auth token:', token); // Logs sensitive data

// Secure
if (__DEV__) {
  console.log('Debug info');
}
```

**9. Insecure dependencies:**
Using outdated npm packages with known vulnerabilities.

```bash
# Regular security audit
npm audit
npm audit fix

# Check for outdated packages
npm outdated
```

**10. Missing root/jailbreak detection:**
Not detecting compromised devices where security controls can be bypassed.

**11. Excessive permissions:**
Requesting more permissions than necessary.

```xml
<!-- Android: only request what you need -->
<uses-permission android:name="android.permission.CAMERA" />
<!-- Don't request without need -->
<!-- <uses-permission android:name="android.permission.READ_CONTACTS" /> -->
```

**12. Unprotected API endpoints:**
Relying solely on client-side validation without server-side authorization.

**13. Sensitive data in error messages:**
Exposing internal details in error messages shown to users.

```tsx
// Vulnerable
catch (error) {
  showMessage(`Error: ${error.message}, Stack: ${error.stack}`);
}

// Secure
catch (error) {
  Sentry.captureException(error);
  showMessage('Something went wrong. Please try again.');
}
```

**14. Insecure authentication:**
- Weak password requirements
- No brute-force protection
- No session timeout
- Storing tokens insecurely

**15. Clipboard data leakage:**
Copying sensitive data to the clipboard where other apps can read it.

```tsx
// Vulnerable
Clipboard.setString(password);

// Secure - clear clipboard after use
Clipboard.setString(otp);
setTimeout(() => Clipboard.setString(''), 30000);
```

**Prevention checklist:**
- Use secure storage for sensitive data
- Implement certificate pinning
- Obfuscate production builds
- Validate all input
- Implement root/jailbreak detection
- Keep dependencies updated
- Disable debugging in production
- Use HTTPS everywhere
- Implement proper authentication and authorization
- Report security issues to monitoring services
