The testing pyramid is a conceptual model that describes the ideal distribution of different types of tests in a software project. It recommends having many low-level tests (unit tests) at the base, fewer mid-level tests (integration tests) in the middle, and very few high-level tests (end-to-end tests) at the top.

**The three layers:**

```
        /  E2E  \          Few — slow, expensive, brittle
       /----------\
      / Integration \      Moderate — medium speed, valuable
     /----------------\
    /    Unit Tests    \   Many — fast, cheap, reliable
   /____________________\
```

**1. Unit Tests (base — ~70% of tests):**

Test individual functions, components, or modules in isolation. They are fast, reliable, and cheap to write and maintain.

```javascript
// Test a pure function
test('formats currency correctly', () => {
  expect(formatCurrency(1234.5)).toBe('$1,234.50');
  expect(formatCurrency(0)).toBe('$0.00');
});

// Test a component renders correctly
test('renders user name', () => {
  render(<UserCard user={{ name: 'Alice', email: 'alice@example.com' }} />);
  expect(screen.getByText('Alice')).toBeInTheDocument();
});
```

**2. Integration Tests (middle — ~20% of tests):**

Test how multiple units work together. They verify that components, services, and APIs integrate correctly. These provide the best value-to-effort ratio.

```javascript
// Test a form with validation and submission
test('submits form with valid data', async () => {
  render(<ContactForm />);

  await userEvent.type(screen.getByLabelText('Name'), 'Alice');
  await userEvent.type(screen.getByLabelText('Email'), 'alice@example.com');
  await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

  expect(screen.getByText('Thank you!')).toBeInTheDocument();
});

// Test component with API interaction
test('loads and displays user data', async () => {
  server.use(
    http.get('/api/users/1', () => {
      return HttpResponse.json({ name: 'Alice', email: 'alice@example.com' });
    })
  );

  render(<UserProfile userId="1" />);
  expect(await screen.findByText('Alice')).toBeInTheDocument();
});
```

**3. End-to-End Tests (top — ~10% of tests):**

Test complete user flows through the entire application, including the browser, network, and backend. They are the most realistic but also the slowest and most expensive.

```javascript
// Cypress E2E test
describe('User login flow', () => {
  it('logs in and accesses dashboard', () => {
    cy.visit('/login');
    cy.get('[data-testid="email"]').type('alice@example.com');
    cy.get('[data-testid="password"]').type('password123');
    cy.get('[data-testid="submit"]').click();
    cy.url().should('include', '/dashboard');
    cy.contains('Welcome, Alice');
  });
});
```

**Why the pyramid shape:**

| Aspect | Unit | Integration | E2E |
|--------|------|-------------|-----|
| Speed | Milliseconds | Seconds | Minutes |
| Cost (write) | Low | Medium | High |
| Cost (maintain) | Low | Medium | High |
| Reliability | High | Medium | Lower (flaky) |
| Coverage | Narrow | Medium | Broad |
| Debugging | Easy | Medium | Hard |
| Confidence | Low (isolated) | Medium | High (full stack) |

**The testing trophy (alternative model):**

Kent C. Dodds proposed the "testing trophy" for modern React applications:

```
     _____
    / E2E \          Few
   /-------\
  /Integration\      Most tests (highest value)
 /-------------\
|   Unit Tests  |    Some (for complex logic)
 \_____________/
     Static          TypeScript, ESLint
```

This model emphasizes integration tests over unit tests for UI applications because:
- Testing component rendering, user interactions, and API integration together gives more confidence
- Over-mocking in unit tests can miss real integration issues
- Static analysis (TypeScript, ESLint) catches many bugs that unit tests would catch

**Best practices:**

1. **Write tests at the right level** — Test pure logic with unit tests, test component interactions with integration tests, test critical flows with E2E
2. **Don't aim for 100% coverage** — Focus on testing business logic, user interactions, and edge cases
3. **Use the right tools** — Jest/Vitest for unit/integration, React Testing Library for component tests, Cypress/Playwright for E2E
4. **Test behavior, not implementation** — Don't test internal state; test what the user sees and does
5. **Keep tests fast** — Slow test suites discourage running tests frequently
6. **Avoid testing the framework** — Don't test that React renders or that state updates work
