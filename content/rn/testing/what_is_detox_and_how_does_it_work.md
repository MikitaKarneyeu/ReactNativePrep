Detox is a gray-box end-to-end testing framework built specifically for React Native by Wix. It tests the actual compiled app running on a simulator or device, verifying complete user flows from the UI through to native code and network requests.

**What "gray-box" means**: Detox synchronizes with the app's internal state. Unlike black-box tools (Appium) that only see the UI, Detox knows when the app is idle by monitoring:
- Pending network requests
- Animations in progress
- Pending timers and delays
- UI layout updates

This synchronization eliminates the flaky timeouts and `sleep()` calls common in E2E testing.

**How Detox works:**

1. **Test runner**: Uses Jest as the test runner. Tests are written in JavaScript.
2. **Detox server**: A WebSocket server that sends commands to the app.
3. **Detox native module**: A module embedded in the app that receives commands (tap, type, scroll) and reports back when the app is idle.
4. **Synchronization**: Before each action, Detox waits until the app is idle (no pending animations, network requests, or timers).

**Setup:**

```bash
npm install --save-dev detox

# Initialize
npx detox init
```

**Configuration** (`detox.config.js`):

```tsx
module.exports = {
  testRunner: {
    args: {
      config: 'e2e/jest.config.js',
      maxWorkers: 1,
    },
  },
  apps: {
    'ios.debug': {
      type: 'ios.app',
      binaryPath: 'ios/build/Build/Products/Debug-iphonesimulator/MyApp.app',
      build: 'xcodebuild -workspace ios/MyApp.xcworkspace -scheme MyApp -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build',
    },
    'android.debug': {
      type: 'android.apk',
      binaryPath: 'android/app/build/outputs/apk/debug/app-debug.apk',
      build: 'cd android && ./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug',
    },
  },
  devices: {
    simulator: {
      type: 'ios.simulator',
      device: { type: 'iPhone 15' },
    },
    emulator: {
      type: 'android.emulator',
      device: { avdName: 'Pixel_4_API_30' },
    },
  },
  configurations: {
    'ios.sim.debug': {
      device: 'simulator',
      app: 'ios.debug',
    },
    'android.emu.debug': {
      device: 'emulator',
      app: 'android.debug',
    },
  },
};
```

**Writing tests:**

```tsx
describe('Login Flow', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should show login screen', async () => {
    await expect(element(by.id('login-screen'))).toBeVisible();
    await expect(element(by.text('Sign In'))).toBeVisible();
  });

  it('should login with valid credentials', async () => {
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

**Common Detox APIs:**

```tsx
// Finding elements
element(by.id('test-id'))
element(by.text('Hello'))
element(by.type('RCTTextView'))
element(by.traits(['button']))
element(by.id('list')).atIndex(0)

// Actions
await element(by.id('input')).typeText('Hello');
await element(by.id('input')).clearText();
await element(by.id('button')).tap();
await element(by.id('list')).scroll(200, 'down');
await element(by.id('list')).scrollTo('bottom');

// Assertions
await expect(element(by.id('view'))).toBeVisible();
await expect(element(by.id('view'))).not.toBeVisible();
await expect(element(by.text('Hello'))).toExist();
await expect(element(by.id('input'))).toHaveText('Hello');
await expect(element(by.id('input'))).toHaveValue('value');

// Device actions
await device.pressBack(); // Android
await device.shake();
await device.setOrientation('landscape');
await device.openURL({ url: 'myapp://deep-link' });
```

**Running tests:**

```bash
# Build and test
npx detox build --configuration ios.sim.debug
npx detox test --configuration ios.sim.debug

# Or combined
npx detox test --configuration ios.sim.debug --reuse
```

**Best practices:**
- Add `testID` props to all interactive elements in your app
- Keep E2E tests focused on critical user paths
- Use `device.reloadReactNative()` in `beforeEach` for test isolation
- Run E2E tests in CI on every pull request
- Use Detox's `--reuse` flag during development for faster iteration
- Take screenshots on failure for debugging
- Test on both iOS and Android
- Seed test data before tests run
