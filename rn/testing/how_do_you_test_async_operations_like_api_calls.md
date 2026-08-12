Testing async operations like API calls in React Native requires mocking the network layer and using async testing utilities to wait for results. The approach depends on whether you're testing components that use APIs or the API layer itself.

**1. Mocking fetch globally:**

```tsx
// jest.setup.js
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: 'mock data' }),
  })
);

// In tests
beforeEach(() => {
  fetch.mockClear();
});
```

**2. Testing a component that fetches data:**

```tsx
import { render, screen, waitFor } from '@testing-library/react-native';

test('loads and displays users', async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: () => Promise.resolve([
      { id: '1', name: 'Alice' },
      { id: '2', name: 'Bob' },
    ]),
  });

  render(<UserList />);

  // Initially shows loading
  expect(screen.getByText('Loading...')).toBeTruthy();

  // Wait for data to load
  await waitFor(() => {
    expect(screen.getByText('Alice')).toBeTruthy();
    expect(screen.getByText('Bob')).toBeTruthy();
  });

  // Verify API was called correctly
  expect(fetch).toHaveBeenCalledWith('/api/users');
});
```

**3. Testing error states:**

```tsx
test('displays error when API fails', async () => {
  fetch.mockRejectedValueOnce(new Error('Network error'));

  render(<UserList />);

  await waitFor(() => {
    expect(screen.getByText('Failed to load users')).toBeTruthy();
  });
});

test('displays error for non-200 response', async () => {
  fetch.mockResolvedValueOnce({
    ok: false,
    status: 500,
    json: () => Promise.resolve({ error: 'Server error' }),
  });

  render(<UserList />);

  await waitFor(() => {
    expect(screen.getByText('Something went wrong')).toBeTruthy();
  });
});
```

**4. Testing form submission with API call:**

```tsx
test('submits form and shows success', async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: () => Promise.resolve({ id: '1', name: 'Alice' }),
  });

  render(<UserForm />);

  fireEvent.changeText(screen.getByPlaceholderText('Name'), 'Alice');
  fireEvent.press(screen.getByText('Submit'));

  await waitFor(() => {
    expect(screen.getByText('User created successfully')).toBeTruthy();
  });

  expect(fetch).toHaveBeenCalledWith('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Alice' }),
  });
});
```

**5. Mocking with MSW (Mock Service Worker):**

```tsx
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/native';

const server = setupServer(
  http.get('/api/users', () => {
    return HttpResponse.json([
      { id: '1', name: 'Alice' },
    ]);
  }),
  http.post('/api/users', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ id: '2', ...body });
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('loads users', async () => {
  render(<UserList />);

  await waitFor(() => {
    expect(screen.getByText('Alice')).toBeTruthy();
  });
});

test('handles server error', async () => {
  server.use(
    http.get('/api/users', () => {
      return new HttpResponse(null, { status: 500 });
    })
  );

  render(<UserList />);

  await waitFor(() => {
    expect(screen.getByText('Error loading users')).toBeTruthy();
  });
});
```

**6. Testing TanStack Query hooks:**

```tsx
import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

test('useUsers hook fetches data', async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: () => Promise.resolve([{ id: '1', name: 'Alice' }]),
  });

  const { result } = renderHook(() => useUsers(), {
    wrapper: createWrapper(),
  });

  expect(result.current.isLoading).toBe(true);

  await waitFor(() => {
    expect(result.current.isSuccess).toBe(true);
  });

  expect(result.current.data).toEqual([{ id: '1', name: 'Alice' }]);
});
```

**7. Testing with timers:**

```tsx
jest.useFakeTimers();

test('shows timeout error after 10 seconds', async () => {
  fetch.mockImplementation(() => new Promise(() => {})); // Never resolves

  render(<UserList />);

  act(() => {
    jest.advanceTimersByTime(10000);
  });

  await waitFor(() => {
    expect(screen.getByText('Request timed out')).toBeTruthy();
  });
});
```

**Best practices:**
- Always mock network requests—never make real API calls in tests
- Test loading, success, and error states
- Use `waitFor` from RNTL for async assertions
- Clear mocks between tests
- Test that the correct API endpoint and parameters are used
- Use MSW for more complex API mocking scenarios
- Disable retries in test configuration to avoid flaky tests
- Test edge cases: empty responses, malformed data, network timeouts
