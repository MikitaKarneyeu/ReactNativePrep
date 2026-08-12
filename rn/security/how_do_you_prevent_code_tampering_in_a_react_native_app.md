Preventing code tampering in React Native involves protecting the JavaScript bundle from being modified, reverse-engineered, or redistributed. Since React Native bundles JavaScript as plain text, they are more vulnerable to tampering than compiled native code.

**1. JavaScript bundle obfuscation:**

Transform your code to make it difficult to understand and modify:

```bash
# Using react-native-obfuscating-transformer
npm install react-native-obfuscating-transformer
```

Configure in `metro.config.js`:

```tsx
const { getDefaultConfig } = require('metro-config');

module.exports = (async () => {
  const config = await getDefaultConfig();
  return {
    ...config,
    transformer: {
      ...config.transformer,
      babelTransformerPath: require.resolve('react-native-obfuscating-transformer'),
      obfuscatorOptions: {
        compact: true,
        controlFlowFlattening: true,
        deadCodeInjection: true,
        debugProtection: true,
        disableConsoleOutput: true,
        identifierNamesGenerator: 'hexadecimal',
        renameGlobals: false,
        selfDefending: true,
        stringArray: true,
        stringArrayEncoding: ['base64'],
        stringArrayThreshold: 0.75,
      },
    },
  };
})();
```

**2. Root/jailbreak detection:**

Detect compromised devices where tampering is easier:

```tsx
import JailMonkey from 'jail-monkey';
import { Platform } from 'react-native';

function checkDeviceIntegrity() {
  const issues = [];

  if (JailMonkey.isJailBroken()) {
    issues.push('Device is jailbroken/rooted');
  }

  if (JailMonkey.isDebuggedMode()) {
    issues.push('App is being debugged');
  }

  if (JailMonkey.isOnExternalStorage()) {
    issues.push('App is on external storage');
  }

  return issues;
}

function App() {
  const [tampered, setTampered] = useState(false);

  useEffect(() => {
    const issues = checkDeviceIntegrity();
    if (issues.length > 0) {
      setTampered(true);
      // Report to analytics
      Sentry.captureMessage(`Device integrity issues: ${issues.join(', ')}`);
    }
  }, []);

  if (tampered) {
    return <SecurityWarningScreen />;
  }

  return <MainApp />;
}
```

**3. Integrity verification:**

Verify that your app bundle hasn't been modified:

```tsx
// Generate a checksum of your bundle at build time
// and verify it at runtime

// In your build script:
// shasum -a 256 main.jsbundle > bundle.checksum

// In your app:
async function verifyBundleIntegrity() {
  const expectedHash = require('./bundle.checksum');
  const actualHash = await computeBundleHash();

  if (expectedHash !== actualHash) {
    Sentry.captureMessage('Bundle integrity check failed');
    return false;
  }
  return true;
}
```

**4. Disable debugging in production:**

```tsx
if (!__DEV__) {
  // Disable debugging
  global.__REMOTEDEV__ = undefined;
  global.__REACT_DEVTOOLS_GLOBAL_HOOK__ = undefined;

  // Disable console
  console.log = () => {};
  console.warn = () => {};
  console.error = () => {};
  console.debug = () => {};

  // Disable yellow box warnings
  LogBox.ignoreAllLogs();
}
```

**5. Android-specific protections:**

Enable ProGuard/R8 for code shrinking and obfuscation:

```gradle
// android/app/build.gradle
buildTypes {
  release {
    minifyEnabled true
    shrinkResources true
    proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
  }
}
```

**6. iOS-specific protections:**

In `Info.plist`, disable debugging:
```xml
<key>get-task-allow</key>
<false/>
```

**7. Server-side validation:**

Don't rely solely on client-side security. Validate critical operations server-side:

```tsx
// Client-side: detect tampering and report
// Server-side: always validate and authorize

async function performSecureAction() {
  // Server validates the request regardless of client-side checks
  const result = await api.secureAction({
    action: 'transfer',
    amount: 100,
    // Server verifies authorization, validates input,
    // and applies business rules
  });
}
```

**8. Anti-debugging techniques:**

```tsx
// Detect if debugger is attached
if (__DEV__ === false) {
  const start = Date.now();
  debugger; // This pauses if debugger is open
  if (Date.now() - start > 100) {
    // Debugger detected
    Sentry.captureMessage('Debugger detected in production');
  }
}
```

**9. Code signing:**

Both iOS and Android use code signing to verify that the app hasn't been tampered with since it was built:
- iOS: Code signing with your Apple Developer certificate
- Android: APK signing with your keystore

**Best practices:**
- Obfuscate the JavaScript bundle for production builds
- Implement root/jailbreak detection
- Disable debugging and console output in production
- Use server-side validation for critical operations
- Enable ProGuard/R8 on Android
- Implement integrity checks
- Report tampering attempts to your monitoring service
- Don't rely on client-side security alone—assume the client can be compromised
- Keep security measures updated as new attack vectors emerge
