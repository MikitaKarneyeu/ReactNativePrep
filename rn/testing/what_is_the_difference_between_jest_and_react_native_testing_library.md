Jest and React Native Testing Library (RNTL) serve complementary but different roles in React Native testing. Understanding their distinction is key to writing effective tests.

**Jest** is a test runner, assertion library, and mocking framework:

- **Test runner**: Discovers, runs, and reports test results
- **Assertions**: Provides `expect()` for making claims about values
- **Mocking**: Creates mock functions (`jest.fn()`), mocks modules (`jest.mock()`), and spies on methods
- **Snapshots**: Captures component output for regression testing
- **Setup/teardown**: `beforeEach`, `afterEach`, `beforeAll`, `afterAll`

```tsx
// Jest provides all of this
describe('math operations', () => {
  test('adds two numbers', () => {
    expect(add(1, 2)).toBe(3); // Assertion
  });

  test('calls callback', () => {
    const callback = jest.fn(); // Mock function
    processItems([1, 2], callback);
    expect(callback).toHaveBeenCalledTimes(2);
  });
});
```

**React Native Testing Library (RNTL)** is a component testing utility:

- **Rendering**: Provides `render()` to mount React Native components in a test environment
- **Querying**: Offers methods to find elements by text, role, placeholder, testID
- **Events**: Provides `fireEvent` and `userEvent` for simulating interactions
- **Async utilities**: `waitFor`, `findBy*` for async operations
- **User-centric approach**: Encourages testing what users see, not implementation details

```tsx
// RNTL provides the testing approach
import { render, screen, fireEvent } from '@testing-library/react-native';

test('submits form', () => {
  const onSubmit = jest.fn(); // Jest mock
  render(<LoginForm onSubmit={onSubmit} />); // RNTL render

  fireEvent.changeText( // RNTL event
    screen.getByPlaceholderText('Email'), // RNTL query
    'test@example.com'
  );
  fireEvent.press(screen.getByText('Submit'));

  expect(onSubmit).toHaveBeenCalled(); // Jest assertion
});
```

**They work together:**

```tsx
// Both are used in every component test
import { render, screen, fireEvent } from '@testing-library/react-native';

test('displays error for invalid email', async () => {
  // RNTL: render component
  render(<EmailForm />);

  // RNTL: find and interact with elements
  fireEvent.changeText(screen.getByPlaceholderText('Email'), 'invalid');
  fireEvent.press(screen.getByText('Submit'));

  // RNTL: query for result, Jest: make assertion
  expect(await screen.findByText('Invalid email')).toBeTruthy();
});
```

**What each controls:**

| Aspect | Jest | RNTL |
|---|---|---|
| Test discovery & running | ✅ | ❌ |
| Assertions (`expect`) | ✅ | ❌ |
| Mocking (`jest.mock`) | ✅ | ❌ |
| Snapshots | ✅ | ❌ |
| Component rendering | ❌ | ✅ |
| Element querying | ❌ | ✅ |
| Event simulation | ❌ | ✅ |
| Async utilities | ❌ | ✅ |

**Without RNTL (enzyme-style or raw Jest):**

```tsx
// Testing implementation details - NOT recommended
test('sets state on press', () => {
  const wrapper = render(<Counter />);
  const instance = wrapper.getInstance();
  instance.setState({ count: 5 });
  expect(instance.state.count).toBe(5);
});
```

**With RNTL (user-centric):**

```tsx
// Testing user behavior - recommended
test('increments on press', () => {
  render(<Counter />);
  fireEvent.press(screen.getByText('Increment'));
  expect(screen.getByText('Count: 1')).toBeTruthy();
});
```

**Key philosophical difference**: Jest is infrastructure (running tests). RNTL is methodology (how to test components). RNTL's philosophy is that tests should resemble how users interact with the app—finding elements by their visible text or accessibility role, not by component structure or internal state.

**Summary**: You always use both. Jest runs the tests and provides assertions. RNTL provides the API for rendering and interacting with React Native components in a user-centric way.
