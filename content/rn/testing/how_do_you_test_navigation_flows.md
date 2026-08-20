Testing navigation flows in React Native involves verifying that screens render correctly, navigation actions work as expected, and deep links resolve properly. The approach depends on the depth of testing you need.

**Mocking React Navigation:**

Create a mock navigation setup for unit and component tests:

```tsx
// test-utils.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { render } from '@testing-library/react-native';

function renderWithNavigation(ui, { initialState } = {}) {
  return render(
    <NavigationContainer initialState={initialState}>
      {ui}
    </NavigationContainer>
  );
}

export { renderWithNavigation };
```

**Testing a screen's content:**

```tsx
import { render, screen, fireEvent } from '@testing-library/react-native';

test('Home screen displays welcome message', () => {
  const navigation = { navigate: jest.fn() };
  render(<HomeScreen navigation={navigation} />);

  expect(screen.getByText('Welcome')).toBeTruthy();
  expect(screen.getByText('Go to Profile')).toBeTruthy();
});
```

**Testing navigation actions:**

```tsx
test('navigates to Profile when button is pressed', () => {
  const navigation = { navigate: jest.fn() };
  render(<HomeScreen navigation={navigation} />);

  fireEvent.press(screen.getByText('Go to Profile'));

  expect(navigation.navigate).toHaveBeenCalledWith('Profile', expect.any(Object));
});
```

**Testing with mock route params:**

```tsx
test('displays user name from route params', () => {
  const route = { params: { userId: '123', userName: 'Alice' } };
  const navigation = { navigate: jest.fn(), goBack: jest.fn() };

  render(<ProfileScreen route={route} navigation={navigation} />);

  expect(screen.getByText('Alice')).toBeTruthy();
});
```

**Testing full navigation flows:**

For integration-level testing, render the actual navigator:

```tsx
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';

const Stack = createNativeStackNavigator();

function TestNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

test('navigates from Home to Details', async () => {
  render(<TestNavigator />);

  expect(screen.getByText('Home')).toBeTruthy();

  fireEvent.press(screen.getByText('View Details'));

  await waitFor(() => {
    expect(screen.getByText('Details Screen')).toBeTruthy();
  });
});
```

**Testing deep links:**

```tsx
import { createNavigationContainerRef } from '@react-navigation/native';

test('deep link opens correct screen', async () => {
  const ref = createNavigationContainerRef();

  render(
    <NavigationContainer ref={ref} linking={linkingConfig}>
      <AppNavigator />
    </NavigationContainer>
  );

  // Simulate deep link
  await act(async () => {
    ref.navigate('Profile', { userId: '123' });
  });

  await waitFor(() => {
    expect(screen.getByText('Profile: 123')).toBeTruthy();
  });
});
```

**Testing authentication flows:**

```tsx
test('redirects to Login when not authenticated', async () => {
  mockAuthState({ isAuthenticated: false });

  render(
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );

  await waitFor(() => {
    expect(screen.getByText('Login')).toBeTruthy();
  });
});

test('shows Home when authenticated', async () => {
  mockAuthState({ isAuthenticated: true, user: { name: 'Alice' } });

  render(
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );

  await waitFor(() => {
    expect(screen.getByText('Welcome, Alice')).toBeTruthy();
  });
});
```

**Mocking navigation for isolated screen tests:**

```tsx
const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
  reset: jest.fn(),
  setOptions: jest.fn(),
  setParams: jest.fn(),
  dispatch: jest.fn(),
  isFocused: jest.fn(() => true),
  addListener: jest.fn(() => jest.fn()),
};

const mockRoute = {
  key: 'test-key',
  name: 'TestScreen',
  params: {},
};

function renderScreen(ScreenComponent, params = {}) {
  return render(
    <ScreenComponent
      navigation={mockNavigation}
      route={{ ...mockRoute, params }}
    />
  );
}
```

**Best practices:**
- Mock navigation for unit tests; use real navigators for integration tests
- Test that navigation is called with correct arguments, not the navigation implementation itself
- Test deep link configurations separately
- Use `waitFor` for navigation transitions that are asynchronous
- Clear mock functions between tests (`jest.clearAllMocks()`)
