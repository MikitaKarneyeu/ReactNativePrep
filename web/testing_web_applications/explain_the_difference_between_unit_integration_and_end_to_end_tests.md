Unit, integration, and end-to-end (E2E) tests are three levels of software testing that differ in scope, speed, cost, and the confidence they provide. Each level tests different aspects of an application.

**Unit Tests** — Test individual functions, components, or modules in isolation:

```javascript
// Pure function test
describe('calculateTotal', () => {
  test('calculates total with tax', () => {
    expect(calculateTotal(100, 0.1)).toBe(110);
  });

  test('handles zero price', () => {
    expect(calculateTotal(0, 0.1)).toBe(0);
  });

  test('handles negative values', () => {
    expect(() => calculateTotal(-100, 0.1)).toThrow('Invalid price');
  });
});

// Component test (isolated with mocks)
test('displays formatted price', () => {
  render(<PriceDisplay price={99.99} currency="USD" />);
  expect(screen.getByText('$99.99')).toBeInTheDocument();
});
```

Characteristics:
- Tests one thing at a time
- Dependencies are mocked/stubbed
- Runs in milliseconds
- Easy to pinpoint failures
- Doesn't verify integration between units

**Integration Tests** — Test how multiple units work together:

```javascript
// Test form with validation, state management, and rendering
test('validates and submits the form', async () => {
  const onSubmit = jest.fn();
  render(<SignupForm onSubmit={onSubmit} />);

  // Fill in the form
  await userEvent.type(screen.getByLabelText('Email'), 'invalid-email');
  await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

  // Validation error appears
  expect(screen.getByText('Invalid email')).toBeInTheDocument();

  // Fix the email
  await userEvent.clear(screen.getByLabelText('Email'));
  await userEvent.type(screen.getByLabelText('Email'), 'alice@example.com');
  await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

  // Form submitted successfully
  expect(onSubmit).toHaveBeenCalledWith({ email: 'alice@example.com' });
});

// Test component with real API (MSW mock server)
test('loads and displays data from API', async () => {
  render(<UserList />);

  // Wait for data to load
  expect(await screen.findByText('Alice')).toBeInTheDocument();
  expect(screen.getByText('Bob')).toBeInTheDocument();
});
```

Characteristics:
- Tests interactions between multiple units
- May use real implementations or mocks for external services
- Runs in seconds
- Verifies that components work together correctly
- Best value-to-effort ratio for UI applications

**End-to-End Tests** — Test complete user flows through the real application:

```javascript
// Cypress E2E
describe('E-commerce checkout', () => {
  beforeEach(() => {
    cy.task('seedDatabase');
  });

  it('completes a purchase', () => {
    cy.visit('/products');
    cy.contains('Add to Cart').first().click();
    cy.get('[data-testid="cart-count"]').should('contain', '1');
    cy.contains('Checkout').click();

    cy.url().should('include', '/checkout');
    cy.get('[data-testid="email"]').type('alice@example.com');
    cy.get('[data-testid="card-number"]').type('4242424242424242');
    cy.contains('Place Order').click();

    cy.url().should('include', '/order-confirmation');
    cy.contains('Thank you for your order');
    cy.get('[data-testid="order-id"]').should('exist');
  });
});

// Playwright E2E
test('user can search and view results', async ({ page }) => {
  await page.goto('/');
  await page.fill('[data-testid="search-input"]', 'laptop');
  await page.press('[data-testid="search-input"]', 'Enter');
  await expect(page.locator('.product-card')).toHaveCount(10);
  await page.click('.product-card:first-child');
  await expect(page).toHaveURL(/\/products\//);
});
```

Characteristics:
- Tests the entire stack (browser, frontend, backend, database)
- Uses real browsers and real services
- Runs in minutes
- Highest confidence but slowest and most expensive
- Can be flaky due to timing, network, and environment issues

**Comparison:**

| Aspect | Unit | Integration | E2E |
|--------|------|-------------|-----|
| Scope | Single function/component | Multiple units together | Complete user flows |
| Dependencies | Mocked | Mix of real and mocked | Real |
| Speed | Milliseconds | Seconds | Minutes |
| Reliability | Very high | High | Lower (flaky) |
| Cost to write | Low | Medium | High |
| Cost to maintain | Low | Medium | High |
| Failure diagnosis | Easy | Medium | Hard |
| Confidence | Low | Medium | High |
| Typical percentage | ~70% | ~20% | ~10% |

**Choosing the right level:**

- **Unit test**: Pure functions, utility methods, complex business logic, edge cases
- **Integration test**: Component rendering, user interactions, form submissions, API integration
- **E2E test**: Critical business flows (login, checkout, payment), cross-browser behavior, visual regression
