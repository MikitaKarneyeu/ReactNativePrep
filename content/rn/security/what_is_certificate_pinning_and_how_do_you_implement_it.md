Certificate pinning is a security technique that prevents man-in-the-middle (MITM) attacks by validating that the server's certificate matches a known, expected certificate. Even if an attacker has a valid certificate from a compromised CA, the connection will be rejected if it doesn't match the pinned certificate.

**Why it matters**: Without certificate pinning, any valid certificate (including those from compromised certificate authorities) can intercept your app's HTTPS traffic. This is especially important on mobile devices that may connect to untrusted networks.

**How it works:**

1. Your app stores the expected certificate's hash (or public key)
2. When connecting to your server, the app checks the server's certificate against the pinned hash
3. If they don't match, the connection is rejected

**Implementation with react-native-ssl-pinning:**

```bash
npm install react-native-ssl-pinning
```

```tsx
import { fetch as sslFetch } from 'react-native-ssl-pinning';

// Make a request with certificate pinning
const response = await sslFetch('https://api.example.com/data', {
  method: 'GET',
  headers: { 'Authorization': `Bearer ${token}` },
  sslPinning: {
    certs: ['my-cert'], // Name of the certificate file in native resources
  },
  timeoutInterval: 10000,
});
```

**iOS implementation (TrustKit):**

Install TrustKit via CocoaPods:
```ruby
# In Podfile
pod 'TrustKit'
```

Configure in `AppDelegate.m` or `AppDelegate.swift`:

```swift
import TrustKit

func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
  let trustKitConfig: [String: Any] = [
    kTSKPinnedDomains: [
      "api.example.com": [
        kTSKEnforcePinning: true,
        kTSKIncludeSubdomains: true,
        kTSKPublicKeyHashes: [
          "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=", // Primary
          "BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB=", // Backup
        ],
      ]
    ]
  ]
  TrustKit.initSharedInstance(withConfiguration: trustKitConfig)
  return true
}
```

**Android implementation (Network Security Config):**

Create `android/app/src/main/res/xml/network_security_config.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
  <domain-config>
    <domain includeSubdomains="true">api.example.com</domain>
    <pin-set expiration="2025-01-01">
      <pin digest="SHA-256">AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=</pin>
      <pin digest="SHA-256">BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB=</pin>
    </pin-set>
  </domain-config>
</network-security-config>
```

Reference in `AndroidManifest.xml`:

```xml
<application
  android:networkSecurityConfig="@xml/network_security_config"
  ...>
```

**Getting certificate hashes:**

```bash
# Get certificate hash for a domain
openssl s_client -connect api.example.com:443 -servername api.example.com < /dev/null 2>/dev/null | \
  openssl x509 -pubkey -noout | \
  openssl pkey -pubin -outform der | \
  openssl dgst -sha256 -binary | \
  base64
```

**Public key pinning vs certificate pinning:**

- **Certificate pinning**: Pin the entire certificate. Must update the app when the certificate is renewed.
- **Public key pinning**: Pin just the public key. Survives certificate renewal if the same key pair is used. More flexible and recommended.

**Best practices:**
- Always include backup pins (at least 2) in case the primary needs rotation
- Set expiration dates on pins to force updates
- Use public key pinning over certificate pinning for flexibility
- Test pinning thoroughly—incorrect pins can lock users out
- Implement a pinning bypass for development/testing builds
- Monitor certificate expiration and plan rotation
- Consider using a certificate management service
- Don't pin to leaf certificates—pin to intermediate or root CA

**Common issues:**
- Forgetting backup pins causes outages when certificates rotate
- Pinning to certificates that expire soon
- Not handling pin validation failures gracefully
- Pinning in development builds makes testing harder

**Certificate pinning bypass for testing:**

```tsx
// Only in development
if (__DEV__) {
  // Bypass certificate pinning for local development
  // Do NOT ship this to production
}
```

Certificate pinning is a strong security measure but adds operational complexity. For many apps, using HTTPS with proper certificate validation is sufficient. Pin it when you're handling highly sensitive data (financial, healthcare).
