Testing user interactions involves simulating how users interact with your application — clicking buttons, typing in inputs, selecting options, submitting forms, and navigating — and then verifying the expected outcomes. React Testing Library and `@testing-library/user-event` are the primary tools for this.

**Setting up user events:**

```javascript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Create a user instance (recommended in v14+)
const user = userEvent.setup();

test('interaction test', async () => {
  render(<MyComponent />);
  await user.click(screen.getByRole('button'));
  // ... assertions
});
```

**Clicking elements:**

```javascript
test('toggles menu on button click', async () => {
  const user = userEvent.setup();
  render(<Navigation />);

  const menuButton = screen.getByRole('button', { name: /menu/i });

  // Menu is initially hidden
  expect(screen.queryByRole('menu')).not.toBeInTheDocument();

  // Click to open
  await user.click(menuButton);
  expect(screen.getByRole('menu')).toBeInTheDocument();

  // Click to close
  await user.click(menuButton);
  expect(screen.queryByRole('menu')).not.toBeInTheDocument();
});

test('selects a tab', async () => {
  const user = userEvent.setup();
  render(<Tabs />);

  await user.click(screen.getByRole('tab', { name: 'Settings' }));
  expect(screen.getByRole('tab', { name: 'Settings' })).toHaveAttribute('aria-selected', 'true');
  expect(screen.getByText('Settings content')).toBeInTheDocument();
});
```

**Typing in inputs:**

```javascript
test('types in input field', async () => {
  const user = userEvent.setup();
  render(<SearchInput />);

  const input = screen.getByRole('searchbox');
  await user.type(input, 'react hooks');

  expect(input).toHaveValue('react hooks');
});

test('clears and retypes', async () => {
  const user = userEvent.setup();
  render(<Input defaultValue="old value" />);

  const input = screen.getByRole('textbox');
  await user.clear(input);
  await user.type(input, 'new value');

  expect(input).toHaveValue('new value');
});
```

**Keyboard interactions:**

```javascript
test('submits on Enter key', async () => {
  const user = userEvent.setup();
  const onSubmit = jest.fn();
  render(<QuickAdd onSubmit={onSubmit} />);

  const input = screen.getByRole('textbox');
  await user.type(input, 'New item{Enter}');

  expect(onSubmit).toHaveBeenCalledWith('New item');
});

test('navigates with keyboard', async () => {
  const user = userEvent.setup();
  render(<Dropdown options={['Option 1', 'Option 2', 'Option 3']} />);

  const trigger = screen.getByRole('button', { name: /select/i });
  await user.click(trigger);
  await user.keyboard('{ArrowDown}{ArrowDown}{Enter}');

  expect(screen.getByText('Option 2')).toBeInTheDocument();
});
```

**Form interactions:**

```javascript
test('fills out and submits a form', async () => {
  const user = userEvent.setup();
  const onSubmit = jest.fn();
  render(<ContactForm onSubmit={onSubmit} />);

  // Fill in fields
  await user.type(screen.getByLabelText('Name'), 'Alice');
  await user.type(screen.getByLabelText('Email'), 'alice@example.com');
  await user.type(screen.getByLabelText('Message'), 'Hello!');

  // Select options
  await user.selectOptions(screen.getByLabelText('Subject'), 'support');

  // Check checkbox
  await user.click(screen.getByLabelText('I agree to terms'));

  // Submit
  await user.click(screen.getByRole('button', { name: 'Send' }));

  expect(onSubmit).toHaveBeenCalledWith({
    name: 'Alice',
    email: 'alice@example.com',
    message: 'Hello!',
    subject: 'support',
    agreed: true
  });
});
```

**Hover and focus interactions:**

```javascript
test('shows tooltip on hover', async () => {
  const user = userEvent.setup();
  render(<Tooltip text="More info"><button>Hover me</button></Tooltip>);

  const button = screen.getByRole('button', { name: 'Hover me' });
  await user.hover(button);

  expect(screen.getByText('More info')).toBeInTheDocument();

  await user.unhover(button);
  expect(screen.queryByText('More info')).not.toBeInTheDocument();
});

test('shows focus styles', async () => {
  const user = userEvent.setup();
  render(<FocusableComponent />);

  await user.tab(); // Tab to first focusable element
  expect(screen.getByRole('button', { name: 'First' })).toHaveFocus();

  await user.tab(); // Tab to next
  expect(screen.getByRole('button', { name: 'Second' })).toHaveFocus();
});
```

**Testing async interactions:**

```javascript
test('loads more items on button click', async () => {
  const user = userEvent.setup();
  render(<ItemList />);

  // Wait for initial items
  expect(await screen.findByText('Item 1')).toBeInTheDocument();

  // Click load more
  await user.click(screen.getByRole('button', { name: 'Load more' }));

  // Wait for new items
  expect(await screen.findByText('Item 11')).toBeInTheDocument();
});
```

**Testing drag and drop:**

```javascript
test('reorders items by dragging', async () => {
  const user = userEvent.setup();
  render(<SortableList items={['A', 'B', 'C']} />);

  const items = screen.getAllByRole('listitem');
  // Note: userEvent doesn't support drag directly
  // Use fireEvent or a library like @testing-library/user-event with pointer events
});
```

**Best practices:**

1. Always `await` user interactions (`userEvent` methods return promises)
2. Use `userEvent.setup()` at the start of each test
3. Find elements by accessible queries (role, label, text)
4. Test the outcome visible to the user, not internal state
5. Test error states and edge cases (empty inputs, invalid data)
6. Use `jest.fn()` or `vi.fn()` to mock callbacks
