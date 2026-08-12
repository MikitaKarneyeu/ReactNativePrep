React Native testing involves multiple layers, each with specialized tools. A comprehensive testing strategy covers unit tests, component tests, integration tests, and end-to-end tests.

**1. Jest (test runner and assertion library):**
Jest is the default test runner for React Native, included when you initialize a project. It provides the test runner, assertions, mocking, and snapshot testing.

```tsx
// jest.config.js (React Native default)
module.exports = {
  preset: 'react-native',
  setupFilesAfterFramework: ['./jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(@react-native|react-native|@react-navigation)/)',
  ],
};
```

**2. React Native Testing Library (RNTL):**
A testing utility for React Native components that encourages testing from the user's perspective. It queries components by text, role, testID, and other accessibility attributes rather than implementation details.

```tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';

test('increments counter on press', () => {
  render(<Counter />);

  const button = screen.getByText('Increment');
  fireEvent.press(button);

  expect(screen.getByText('Count: 1')).toBeTruthy();
});
```

**3. Detox (end-to-end testing):**
A gray-box E2E testing framework designed specifically for React Native. It synchronizes with the app's UI and animations.

```tsx
describe('Login flow', () => {
  it('should login successfully', async () => {
    await element(by.id('email-input')).typeText('user@example.com');
    await element(by.id('password-input')).typeText('password123');
    await element(by.id('login-button')).tap();
    await expect(element(by.text('Welcome'))).toBeVisible();
  });
});
```

**4. Maestro (E2E alternative):**
A newer E2E testing tool with a simpler YAML-based syntax:

```yaml
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

**Testing layers and tools:**

| Layer | Tool | What it tests |
|---|---|---|
| Unit tests | Jest | Pure functions, utilities, hooks |
| Component tests | Jest + RNTL | Component rendering, interactions |
| Integration tests | Jest + RNTL | Multiple components working together |
| E2E tests | Detox / Maestro | Full user flows on a real device |
| Snapshot tests | Jest | Visual regression |

**Setup for a typical project:**

```bash
# Already included with React Native
npm install --save-dev jest @testing-library/react-native

# For E2E
npm install --save-dev detox

# For mocking
npm install --save-dev @testing-library/jest-native
```

**What I test and with which tool:**

- **Pure functions and utilities**: Jest unit tests
- **Custom hooks**: Jest with `renderHook` from RNTL
- **Components**: RNTL for user-facing behavior, snapshot tests for simple components
- **Navigation flows**: RNTL with mocked navigation
- **API integration**: Jest with mocked fetch/axios
- **Critical user flows**: Detox or Maestro E2E tests

**Best practices:**
- Test behavior, not implementation (query by text/role, not by component name)
- Use `userEvent` over `fireEvent` when possible for more realistic interactions
- Mock native modules and third-party libraries at the boundary
- Keep tests fast—mock network requests and timers
- Write tests that are resilient to refactoring (don't test internal state)
- Use E2E tests sparingly for critical paths (they're slow and fragile)
- Run tests in CI on every pull request
