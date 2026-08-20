Mocking API calls in tests isolates your frontend tests from the backend, makes tests faster and more reliable, and allows you to test different response scenarios (success, error, loading, edge cases). There are several approaches, from simple mocks to full network interception.

**1. Mock Service Worker (MSW) — Recommended:**

MSW intercepts network requests at the network level, so your application code doesn't need any changes. It works in both tests and development.

```javascript
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { render, screen } from '@testing-library/react';
import UserList from './UserList';

// Define request handlers
const handlers = [
  http.get('/api/users', () => {
    return HttpResponse.json([
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' }
    ]);
  }),

  http.get('/api/users/:id', ({ params }) => {
    const user = { id: params.id, name: 'Alice', email: 'alice@example.com' };
    return HttpResponse.json(user);
  })
];

// Set up the server
const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('displays users from API', async () => {
  render(<UserList />);
  expect(await screen.findByText('Alice')).toBeInTheDocument();
  expect(screen.getByText('Bob')).toBeInTheDocument();
});

test('handles API error', async () => {
  // Override handler for this test
  server.use(
    http.get('/api/users', () => {
      return new HttpResponse(null, { status: 500 });
    })
  );

  render(<UserList />);
  expect(await screen.findByText('Error loading users')).toBeInTheDocument();
});

test('handles empty response', async () => {
  server.use(
    http.get('/api/users', () => {
      return HttpResponse.json([]);
    })
  );

  render(<UserList />);
  expect(await screen.findByText('No users found')).toBeInTheDocument();
});
```

**2. Jest/Vitest mocking:**

```javascript
// Mock the entire module
jest.mock('./api', () => ({
  fetchUsers: jest.fn(),
  createUser: jest.fn()
}));

import { fetchUsers } from './api';

test('renders users', async () => {
  fetchUsers.mockResolvedValue([
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' }
  ]);

  render(<UserList />);
  expect(await screen.findByText('Alice')).toBeInTheDocument();
});

test('handles fetch error', async () => {
  fetchUsers.mockRejectedValue(new Error('Network error'));

  render(<UserList />);
  expect(await screen.findByText('Error')).toBeInTheDocument();
});
```

**3. Mocking fetch directly:**

```javascript
// Global fetch mock
global.fetch = jest.fn();

beforeEach(() => {
  fetch.mockClear();
});

test('fetches and displays data', async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ name: 'Alice' })
  });

  render(<UserProfile userId="1" />);
  expect(await screen.findByText('Alice')).toBeInTheDocument();
  expect(fetch).toHaveBeenCalledWith('/api/users/1');
});

test('handles network error', async () => {
  fetch.mockRejectedValueOnce(new Error('Network failure'));

  render(<UserProfile userId="1" />);
  expect(await screen.findByText('Error loading profile')).toBeInTheDocument();
});
```

**4. Axios mocking:**

```javascript
import axios from 'axios';
jest.mock('axios');

test('fetches users with axios', async () => {
  axios.get.mockResolvedValue({
    data: [{ id: 1, name: 'Alice' }]
  });

  render(<UserList />);
  expect(await screen.findByText('Alice')).toBeInTheDocument();
  expect(axios.get).toHaveBeenCalledWith('/api/users');
});
```

**Testing different scenarios:**

```javascript
// Loading state
test('shows loading indicator', () => {
  server.use(
    http.get('/api/users', async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return HttpResponse.json([]);
    })
  );

  render(<UserList />);
  expect(screen.getByRole('progressbar')).toBeInTheDocument();
});

// Error with status code
test('shows error for 404', async () => {
  server.use(
    http.get('/api/users/999', () => {
      return new HttpResponse(null, { status: 404 });
    })
  );

  render(<UserProfile userId="999" />);
  expect(await screen.findByText('User not found')).toBeInTheDocument();
});

// Network timeout
test('handles timeout', async () => {
  server.use(
    http.get('/api/users', () => {
      return HttpResponse.error();
    })
  );

  render(<UserList />);
  expect(await screen.findByText('Network error')).toBeInTheDocument();
});
```

**MSW setup for development + testing:**

```javascript
// src/mocks/handlers.js
export const handlers = [
  http.get('/api/users', () => {
    return HttpResponse.json([
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' }
    ]);
  })
];

// src/mocks/browser.js (for development)
import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';
export const worker = setupWorker(...handlers);

// src/mocks/server.js (for tests)
import { setupServer } from 'msw/node';
import { handlers } from './handlers';
export const server = setupServer(...handlers);

// src/index.js (development only)
if (process.env.NODE_ENV === 'development') {
  const { worker } = await import('./mocks/browser');
  worker.start();
}
```

**Best practices:**

1. Use MSW for most API mocking — it doesn't require changing your application code
2. Reset handlers after each test to avoid test pollution
3. Test error states, loading states, and edge cases
4. Don't mock too much — let integration tests use real API logic when possible
5. Share handler definitions between tests and development
