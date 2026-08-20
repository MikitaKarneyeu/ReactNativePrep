Snapshot tests are a testing technique where the output of a component (or any serializable value) is captured and saved to a file. On subsequent test runs, the new output is compared against the saved snapshot. If they differ, the test fails and shows the exact changes.

**How snapshot tests work:**

```javascript
// First run — creates the snapshot file
test('matches snapshot', () => {
  const { container } = render(<Button variant="primary">Click me</button>);
  expect(container).toMatchSnapshot();
});

// Creates: __tests__/__snapshots__/Button.test.tsx.snap
// Contains the serialized HTML output
```

**Snapshot file content:**

```
// Jest Snapshot v1
exports[`matches snapshot 1`] = `
<button
  class="btn btn-primary"
>
  Click me
</button>
`;
```

**On subsequent runs:**

- If the component output matches the snapshot → test passes
- If the output differs → test fails, showing a diff
- To update the snapshot after intentional changes: `npm test -- -u`

**Inline snapshots:**

```javascript
test('renders correctly', () => {
  const { container } = render(<Alert type="error">Something went wrong</Alert>);
  expect(container).toMatchInlineSnapshot(`
    <div class="alert alert-error">
      Something went wrong
    </div>
  `);
});
```

**When snapshot tests are useful:**

1. **Rendering complex components** — Components with many props, conditional rendering, or complex markup
2. **Preventing accidental UI changes** — Catching unintended changes to component output
3. **Documenting component output** — Snapshots serve as documentation of what the component renders
4. **Quick regression testing** — Easy to write, covers a lot of markup

```javascript
// Useful for components with many variants
test('renders all button variants', () => {
  const { rerender } = render(<Button variant="primary">Primary</Button>);
  expect(document.body).toMatchSnapshot();

  rerender(<Button variant="secondary">Secondary</Button>);
  expect(document.body).toMatchSnapshot();

  rerender(<Button variant="danger">Danger</Button>);
  expect(document.body).toMatchSnapshot();
});
```

**When NOT to use snapshot tests:**

1. **Frequently changing components** — Snapshots break on every change, leading to `--updateSnapshot` fatigue
2. **Testing behavior** — Snapshots test structure, not behavior (user interactions, state changes)
3. **Small, simple components** — Overhead isn't worth it; write specific assertions instead
4. **Components with random/unique values** — UUIDs, timestamps, or generated IDs cause constant failures

**Problems with snapshot tests:**

```javascript
// ❌ Snapshot testing anti-patterns

// 1. Too large — snapshot becomes unreadable and always changes
test('renders entire page', () => {
  const { container } = render(<EntirePage />);
  expect(container).toMatchSnapshot(); // 500 lines of HTML
});

// 2. Snapshot of implementation details
test('calls render method', () => {
  const spy = jest.spyOn(Component.prototype, 'render');
  render(<Component />);
  expect(spy).toMatchSnapshot();
});

// 3. Updating without reviewing
// Developers often run `jest -u` without reviewing changes
```

**Better alternatives to snapshot tests:**

```javascript
// ✅ Specific assertions instead of snapshots
test('renders user information', () => {
  render(<UserCard user={{ name: 'Alice', role: 'Admin' }} />);

  expect(screen.getByText('Alice')).toBeInTheDocument();
  expect(screen.getByText('Admin')).toBeInTheDocument();
  expect(screen.getByRole('img')).toHaveAttribute('alt', "Alice's avatar");
});

// ✅ Test specific attributes
test('applies correct styles', () => {
  render(<Button variant="primary">Click</Button>);
  const button = screen.getByRole('button');
  expect(button).toHaveClass('btn', 'btn-primary');
  expect(button).toBeEnabled();
});

// ✅ Visual regression testing (for visual changes)
// Use tools like Percy, Chromatic, or Playwright's visual comparison
```

**Best practices if you use snapshots:**

1. Keep snapshots small — snapshot specific elements, not entire pages
2. Use inline snapshots for small outputs
3. Review snapshot diffs carefully before updating
4. Use `toMatchSnapshot({ property: value })` to ignore unstable values
5. Combine with specific assertions — don't rely solely on snapshots
6. Consider using `toMatchInlineSnapshot()` for easier review
7. Set a snapshot limit — if a snapshot is > 50 lines, consider specific tests instead

**Modern recommendation:**

Most testing experts now recommend against heavy snapshot testing. Instead, write specific assertions that test the behavior and output you care about. Use snapshots sparingly for complex, stable markup that would be tedious to assert line by line. For visual testing, use dedicated visual regression tools (Percy, Chromatic, Playwright visual comparison) that compare rendered screenshots rather than DOM snapshots.
