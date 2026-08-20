React Testing Library (RTL) is a testing utility for React that encourages testing components in a way that resembles how users interact with them. It is built on top of DOM Testing Library and follows the guiding principle: "The more your tests resemble the way your software is used, the more confidence they can give you."

**Core philosophy:**

React Testing Library shifts testing away from implementation details and toward user behavior:

1. **Don't test implementation details** — Don't test state, internal methods, or component lifecycle. Test what the user sees and does.
2. **Test from the user's perspective** — Find elements the way users do: by role, label, text, or placeholder.
3. **Accessibility-first queries** — Queries that encourage accessible markup (getByRole, getByLabelText).
4. **Interact like a user** — Use `userEvent` to simulate clicks, typing, and other interactions.

**Basic example:**

```javascript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Counter from './Counter';

test('increments counter when clicked', async () => {
  const user = userEvent.setup();
  render(<Counter />);

  // Find elements like a user would
  const button = screen.getByRole('button', { name: /increment/i });
  const display = screen.getByText('Count: 0');

  // Interact like a user
  await user.click(button);

  // Assert what the user sees
  expect(screen.getByText('Count: 1')).toBeInTheDocument();
});
```

**Query priority (from RTL docs):**

1. `getByRole` — Most preferred (accessible, finds by ARIA role)
2. `getByLabelText` — Form elements with labels
3. `getByPlaceholderText` — Inputs with placeholders
4. `getByText` — Non-interactive elements with text
5. `getByDisplayValue` — Form elements with current values
6. `getByAltText` — Images with alt text
7. `getByTitle` — Elements with title attribute
8. `getByTestId` — Last resort (data-testid attribute)

```javascript
// ✅ Preferred — queries that encourage accessible markup
screen.getByRole('button', { name: 'Submit' });
screen.getByRole('heading', { name: 'Welcome' });
screen.getByLabelText('Email address');
screen.getByRole('link', { name: 'About' });
screen.getByRole('textbox', { name: 'Search' });

// ⚠️ Acceptable but less preferred
screen.getByText('Hello World');
screen.getByPlaceholderText('Enter your email');

// ❌ Last resort — doesn't encourage accessible markup
screen.getByTestId('submit-button');
```

**Async testing:**

```javascript
// findBy* — waits for element to appear (async)
test('loads user data', async () => {
  render(<UserProfile userId="1" />);

  // Wait for the user name to appear
  expect(await screen.findByText('Alice')).toBeInTheDocument();
});

// waitFor — wait for a condition
test('updates after async action', async () => {
  render(<AsyncComponent />);

  await waitFor(() => {
    expect(screen.getByText('Loaded!')).toBeInTheDocument();
  });
});

// queryBy* — returns null instead of throwing (for asserting absence)
test('does not show error initially', () => {
  render(<Form />);
  expect(screen.queryByText('Error')).not.toBeInTheDocument();
});
```

**Testing forms:**

```javascript
test('submits form with user input', async () => {
  const user = userEvent.setup();
  const handleSubmit = jest.fn();
  render(<LoginForm onSubmit={handleSubmit} />);

  await user.type(screen.getByLabelText('Email'), 'alice@example.com');
  await user.type(screen.getByLabelText('Password'), 'password123');
  await user.click(screen.getByRole('button', { name: 'Log in' }));

  expect(handleSubmit).toHaveBeenCalledWith({
    email: 'alice@example.com',
    password: 'password123'
  });
});
```

**Testing with API calls (Mock Service Worker):**

```javascript
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  http.get('/api/users', () => {
    return HttpResponse.json([
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' }
    ]);
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('displays users from API', async () => {
  render(<UserList />);
  expect(await screen.findByText('Alice')).toBeInTheDocument();
  expect(screen.getByText('Bob')).toBeInTheDocument();
});
```

**What NOT to test:**

```javascript
// ❌ Don't test implementation details
expect(component.state.count).toBe(1);
expect(component.instance().handleClick).toHaveBeenCalled();

// ❌ Don't test React itself
// "renders correctly" snapshots of simple components
// That state updates work

// ❌ Don't use snapshot tests for everything
// They're brittle and don't test behavior
```

React Testing Library is the standard for testing React components and is maintained by the Testing Library team. It works with Jest, Vitest, or any test runner.
