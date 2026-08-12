Unit testing React Native components involves rendering them in a test environment, simulating user interactions, and asserting on the resulting output. React Native Testing Library (RNTL) is the recommended tool.

**Basic component test:**

```tsx
// Greeting.tsx
function Greeting({ name }) {
  return (
    <View>
      <Text>Hello, {name}!</Text>
    </View>
  );
}

// Greeting.test.tsx
import { render, screen } from '@testing-library/react-native';

test('displays greeting with name', () => {
  render(<Greeting name="Alice" />);
  expect(screen.getByText('Hello, Alice!')).toBeTruthy();
});
```

**Testing interactions:**

```tsx
// Counter.tsx
function Counter() {
  const [count, setCount] = useState(0);
  return (
    <View>
      <Text>Count: {count}</Text>
      <Button title="Increment" onPress={() => setCount((c) => c + 1)} />
    </View>
  );
}

// Counter.test.tsx
import { render, screen, fireEvent } from '@testing-library/react-native';

test('increments count when button is pressed', () => {
  render(<Counter />);

  expect(screen.getByText('Count: 0')).toBeTruthy();

  fireEvent.press(screen.getByText('Increment'));
  expect(screen.getByText('Count: 1')).toBeTruthy();

  fireEvent.press(screen.getByText('Increment'));
  expect(screen.getByText('Count: 2')).toBeTruthy();
});
```

**Testing text input:**

```tsx
import { render, screen, fireEvent } from '@testing-library/react-native';

test('updates text input', () => {
  render(<SearchBar />);

  const input = screen.getByPlaceholderText('Search...');
  fireEvent.changeText(input, 'react native');

  expect(screen.getByText('Searching for: react native')).toBeTruthy();
});
```

**Testing async operations:**

```tsx
import { render, screen, waitFor } from '@testing-library/react-native';

test('loads and displays user data', async () => {
  render(<UserProfile userId="123" />);

  // Wait for loading to finish
  await waitFor(() => {
    expect(screen.getByText('John Doe')).toBeTruthy();
  });
});
```

**Testing with mocked functions:**

```tsx
import { render, screen, fireEvent } from '@testing-library/react-native';

test('calls onSubmit with form data', () => {
  const onSubmit = jest.fn();
  render(<LoginForm onSubmit={onSubmit} />);

  fireEvent.changeText(screen.getByPlaceholderText('Email'), 'test@example.com');
  fireEvent.changeText(screen.getByPlaceholderText('Password'), 'password123');
  fireEvent.press(screen.getByText('Login'));

  expect(onSubmit).toHaveBeenCalledWith({
    email: 'test@example.com',
    password: 'password123',
  });
});
```

**Testing custom hooks:**

```tsx
import { renderHook, act } from '@testing-library/react-native';

test('useCounter hook', () => {
  const { result } = renderHook(() => useCounter());

  expect(result.current.count).toBe(0);

  act(() => {
    result.current.increment();
  });

  expect(result.current.count).toBe(1);
});
```

**Querying elements (in priority order):**

```tsx
// By text (most user-facing)
screen.getByText('Submit');
screen.queryByText('Error'); // Returns null if not found (vs throwing)
screen.getAllByText('Item'); // Returns array

// By role (accessibility)
screen.getByRole('button');
screen.getByRole('header');

// By testID (last resort)
screen.getByTestId('submit-button');

// By placeholder
screen.getByPlaceholderText('Enter email');

// Async queries
await screen.findByText('Loaded!'); // Waits for element to appear
```

**Mocking native modules:**

```tsx
// jest.setup.js
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);
```

**Best practices:**
- Query by text, role, or placeholder (user-visible attributes)
- Avoid `getByTestId` unless no other query works
- Use `queryByText` when asserting elements don't exist
- Use `findByText` for async content
- Test user flows, not individual component internals
- Keep tests focused—one behavior per test
- Use `beforeEach` to reset state between tests
- Mock external dependencies (API, storage, native modules)
