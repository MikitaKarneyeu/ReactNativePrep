End-to-end (E2E) testing tools for React Native run tests against the actual compiled app on a simulator or real device, testing the full stack from UI to backend. The main options are Detox, Maestro, and Appium.

**1. Detox** (by Wix):
A gray-box E2E framework built specifically for React Native. It synchronizes with the app's internal state (network requests, animations, timers) to eliminate flaky tests.

```tsx
// detox.config.js
module.exports = {
  testRunner: { args: { config: 'e2e/jest.config.js' } },
  apps: {
    'ios.debug': {
      type: 'ios.app',
      binaryPath: 'ios/build/Build/Products/Debug-iphonesimulator/MyApp.app',
      build: 'xcodebuild -workspace ios/MyApp.xcworkspace -scheme MyApp -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build',
    },
  },
  devices: {
    simulator: {
      type: 'ios.simulator',
      device: { type: 'iPhone 15' },
    },
  },
  configurations: {
    'ios.sim.debug': {
      device: 'simulator',
      app: 'ios.debug',
    },
  },
};

// E2E test
describe('Login flow', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  it('should login successfully', async () => {
    await element(by.id('email-input')).typeText('user@example.com');
    await element(by.id('password-input')).typeText('password123');
    await element(by.id('login-button')).tap();
    await expect(element(by.text('Welcome'))).toBeVisible();
  });

  it('should show error for invalid credentials', async () => {
    await element(by.id('email-input')).typeText('wrong@example.com');
    await element(by.id('password-input')).typeText('wrong');
    await element(by.id('login-button')).tap();
    await expect(element(by.text('Invalid credentials'))).toBeVisible();
  });
});
```

**2. Maestro** (by mobile.dev):
A newer E2E tool with a simpler, YAML-based syntax. No compilation step needed for tests—just run against a running app.

```yaml
# login.yaml
appId: com.myapp
---
- launchApp
- tapOn: "Sign In"
- inputText: "user@example.com"
- tapOn: "Password"
- inputText: "password123"
- tapOn: "Login"
- assertVisible: "Welcome"
```

```bash
# Run tests
maestro test login.yaml
```

Maestro also supports:
- Conditional logic (`runFlow`)
- Test tags and filtering
- Screenshot comparison
- Cloud execution (Maestro Cloud)

**3. Appium** (cross-platform):
A general-purpose mobile testing framework that supports React Native through WebDriver protocol. Uses the same API for iOS and Android.

```tsx
// Appium test
const element = await driver.$('~login-button');
await element.click();
const message = await driver.$('~welcome-text');
expect(await message.getText()).toBe('Welcome');
```

**Comparison:**

| Feature | Detox | Maestro | Appium |
|---|---|---|---|
| RN-specific | Yes | No (mobile-generic) | No |
| Synchronization | Built-in (gray-box) | UI-based | Limited |
| Test syntax | JavaScript/Jest | YAML | JS/Java/Python |
| Setup complexity | High | Low | Medium |
| Speed | Fast | Fast | Slow |
| Flakiness | Low | Low | Higher |
| Cloud support | Detox Cloud | Maestro Cloud | BrowserStack, Sauce Labs |
| Community | Strong RN community | Growing | Large, general mobile |

**When to use each:**

**Detox**: When you need fine-grained control, are building a React Native-specific testing suite, and want the most reliable synchronization with the app.

**Maestro**: When you want quick E2E tests with minimal setup, have non-technical team members writing tests, or need a simpler testing syntax.

**Appium**: When you need to test both React Native and native apps with the same framework, or your team already uses Appium.

**Best practices for E2E testing:**
- Test only critical user flows (login, checkout, core features)
- Keep tests independent—each test should start fresh
- Use test IDs (`testID` prop) for stable element selection
- Run E2E tests in CI on every pull request for critical paths
- Use the same app build for all tests in a suite
- Handle test data setup and cleanup (seed database, clear storage)
- Take screenshots on failure for debugging
- Run on both iOS and Android
