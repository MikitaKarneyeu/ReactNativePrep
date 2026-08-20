Mocking native modules in React Native tests is essential because native modules (camera, filesystem, keychain, etc.) aren't available in the Jest test environment. Proper mocking isolates your JavaScript tests from native dependencies.

**Automatic mocks (jest.mock in setup file):**

Create a `jest.setup.js` file referenced in your Jest config:

```tsx
// jest.setup.js

// AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// NetInfo
jest.mock('@react-native-community/netinfo', () => ({
  useNetInfo: jest.fn(() => ({ isConnected: true, type: 'wifi' })),
  addEventListener: jest.fn(),
  fetch: jest.fn(() => Promise.resolve({ isConnected: true })),
}));

// react-native-keychain
jest.mock('react-native-keychain', () => ({
  setGenericPassword: jest.fn(() => Promise.resolve(true)),
  getGenericPassword: jest.fn(() => Promise.resolve({
    username: 'auth',
    password: '{"token":"mock-token"}',
  })),
  resetGenericPassword: jest.fn(() => Promise.resolve(true)),
}));

// react-native-reanimated
jest.mock('react-native-reanimated', () =>
  require('react-native-reanimated/mock')
);

// Image picker
jest.mock('react-native-image-picker', () => ({
  launchImageLibrary: jest.fn(() =>
    Promise.resolve({
      assets: [{ uri: 'file://test.jpg', type: 'image/jpeg', fileName: 'test.jpg' }],
    })
  ),
  launchCamera: jest.fn(),
}));
```

**Manual module mock:**

```tsx
jest.mock('react-native/Libraries/Linking/Linking', () => ({
  openURL: jest.fn(() => Promise.resolve()),
  canOpenURL: jest.fn(() => Promise.resolve(true)),
  getInitialURL: jest.fn(() => Promise.resolve('myapp://home')),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
}));
```

**Mocking with a custom implementation:**

```tsx
jest.mock('@react-native-firebase/messaging', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    getToken: jest.fn(() => Promise.resolve('mock-fcm-token')),
    onMessage: jest.fn(),
    onNotificationOpenedApp: jest.fn(),
    getInitialNotification: jest.fn(() => Promise.resolve(null)),
    requestPermission: jest.fn(() => Promise.resolve(1)),
  })),
}));
```

**Mocking specific parts of a module:**

```tsx
import * as ImagePicker from 'react-native-image-picker';

jest.mock('react-native-image-picker');

// In your test
ImagePicker.launchImageLibrary.mockResolvedValue({
  assets: [{ uri: 'file://test.jpg' }],
});
```

**Creating mock files in __mocks__ directory:**

```
__mocks__/
  react-native-fs.js
  react-native-push-notification.js
```

```tsx
// __mocks__/react-native-fs.js
module.exports = {
  DocumentDirectoryPath: '/mock/documents',
  writeFile: jest.fn(() => Promise.resolve()),
  readFile: jest.fn(() => Promise.resolve('file content')),
  exists: jest.fn(() => Promise.resolve(true)),
  mkdir: jest.fn(() => Promise.resolve()),
};
```

**Mocking navigation:**

```tsx
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
    reset: jest.fn(),
    addListener: jest.fn(() => jest.fn()),
  }),
  useRoute: () => ({
    params: {},
    key: 'test',
    name: 'TestScreen',
  }),
  useFocusEffect: jest.fn(),
  useIsFocused: jest.fn(() => true),
}));
```

**Mocking platform-specific modules:**

```tsx
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  RN.NativeModules.StatusBarManager = {
    getHeight: jest.fn((callback) => callback({ height: 44 })),
  };
  return RN;
});
```

**Mocking TurboModules (New Architecture):**

```tsx
jest.mock('react-native/Libraries/TurboModule/TurboModuleRegistry', () => ({
  getEnforcing: jest.fn((name) => {
    if (name === 'MyModule') {
      return { getData: jest.fn(() => Promise.resolve('mock data')) };
    }
    return {};
  }),
}));
```

**Best practices:**
- Centralize mocks in `jest.setup.js` for consistency
- Use `jest.requireActual` when you want to mock only part of a module
- Provide realistic mock return values that match the actual API
- Clear mocks between tests with `jest.clearAllMocks()`
- Document why each mock is needed
- Keep mocks simple—don't over-mock
- Use `__mocks__` directory for complex module mocks
- Test mock behavior separately if the mock itself is complex
