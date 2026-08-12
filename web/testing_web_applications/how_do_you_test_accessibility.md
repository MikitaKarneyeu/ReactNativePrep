Testing accessibility ensures your web application is usable by people with disabilities, including those who use screen readers, keyboard navigation, or other assistive technologies. Accessibility testing combines automated tools, manual testing, and specialized assertions.

**Automated testing with jest-axe:**

```javascript
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

test('form has no accessibility violations', async () => {
  const { container } = render(<ContactForm />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

test('navigation has no accessibility violations', async () => {
  const { container } = render(<Navigation />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

// Custom rules configuration
test('checks with custom rules', async () => {
  const { container } = render(<MyComponent />);
  const results = await axe(container, {
    rules: {
      'color-contrast': { enabled: true },
      'valid-lang': { enabled: true }
    }
  });
  expect(results).toHaveNoViolations();
});
```

**Testing accessible names and roles:**

```javascript
// Testing Library queries encourage accessible markup
test('button has accessible name', () => {
  render(<SubmitButton />);
  // getByRole finds the button and verifies its accessible name
  expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
});

test('form inputs have labels', () => {
  render(<LoginForm />);
  expect(screen.getByLabelText('Email')).toBeInTheDocument();
  expect(screen.getByLabelText('Password')).toBeInTheDocument();
});

test('images have alt text', () => {
  render(<Avatar src="/photo.jpg" alt="Alice's profile picture" />);
  expect(screen.getByAltText("Alice's profile picture")).toBeInTheDocument();
});

test('headings have correct hierarchy', () => {
  render(<Article />);
  const headings = screen.getAllByRole('heading');
  expect(headings[0]).toHaveProperty('tagName', 'H1');
  expect(headings[1]).toHaveProperty('tagName', 'H2');
});
```

**Testing keyboard navigation:**

```javascript
import userEvent from '@testing-library/user-event';

test('all interactive elements are keyboard accessible', async () => {
  const user = userEvent.setup();
  render(<Navigation />);

  // Tab through all interactive elements
  await user.tab();
  expect(screen.getByRole('link', { name: 'Home' })).toHaveFocus();

  await user.tab();
  expect(screen.getByRole('link', { name: 'About' })).toHaveFocus();

  await user.tab();
  expect(screen.getByRole('button', { name: 'Menu' })).toHaveFocus();
});

test('dropdown is keyboard navigable', async () => {
  const user = userEvent.setup();
  render(<Dropdown options={['Option 1', 'Option 2', 'Option 3']} />);

  const trigger = screen.getByRole('button', { name: /select/i });
  trigger.focus();

  await user.keyboard('{Enter}'); // Open dropdown
  expect(screen.getByRole('listbox')).toBeInTheDocument();

  await user.keyboard('{ArrowDown}'); // Navigate to first option
  expect(screen.getAllByRole('option')[0]).toHaveFocus();

  await user.keyboard('{Enter}'); // Select option
  expect(trigger).toHaveTextContent('Option 1');
});

test('modal traps focus', async () => {
  const user = userEvent.setup();
  render(<Modal isOpen={true}><button>Close</button></Modal>);

  // Tab should cycle within the modal
  const closeButton = screen.getByRole('button', { name: 'Close' });
  await user.tab();
  expect(closeButton).toHaveFocus();

  // Shift+Tab should also stay in modal
  await user.keyboard('{Shift>}{Tab}{/Shift}');
  expect(closeButton).toHaveFocus();
});
```

**Testing ARIA attributes:**

```javascript
test('tablist has correct ARIA attributes', () => {
  render(<Tabs />);

  const tablist = screen.getByRole('tablist');
  expect(tablist).toBeInTheDocument();

  const tabs = screen.getAllByRole('tab');
  expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
  expect(tabs[1]).toHaveAttribute('aria-selected', 'false');

  const panel = screen.getByRole('tabpanel');
  expect(panel).toHaveAttribute('aria-labelledby', tabs[0].id);
});

test('live region announces updates', () => {
  render(<StatusMessage message="Loading..." />);

  const status = screen.getByRole('status');
  expect(status).toHaveAttribute('aria-live', 'polite');
  expect(status).toHaveTextContent('Loading...');
});
```

**E2E accessibility testing:**

```javascript
// Cypress with cypress-axe
describe('Accessibility', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.injectAxe();
  });

  it('has no accessibility violations on home page', () => {
    cy.checkA11y();
  });

  it('has no violations in the navigation', () => {
    cy.checkA11y('nav');
  });

  it('has no violations after opening modal', () => {
    cy.get('[data-testid="open-modal"]').click();
    cy.checkA11y('.modal');
  });
});

// Playwright accessibility testing
test('page has no accessibility violations', async ({ page }) => {
  await page.goto('/');
  const accessibilityScanResults = await page.getByRole('button').all();
  // Use @axe-core/playwright for automated scanning
});
```

**Manual accessibility testing checklist:**

1. **Keyboard navigation** — Can you navigate the entire page with only Tab, Enter, Escape, and arrow keys?
2. **Focus visible** — Is the focused element clearly visible?
3. **Screen reader** — Does the page make sense when read by VoiceOver (Mac), NVDA (Windows), or JAWS?
4. **Color contrast** — Is text readable? Use browser DevTools or tools like axe DevTools.
5. **Zoom** — Does the page work at 200% zoom?
6. **Reduced motion** — Are animations disabled when `prefers-reduced-motion` is set?

**CI/CD integration:**

```yaml
# GitHub Actions with Lighthouse CI
- name: Run Lighthouse
  uses: treosh/lighthouse-ci-action@v10
  with:
    urls: |
      http://localhost:3000/
      http://localhost:3000/about
    budgetPath: ./lighthouse-budget.json
```

Automated testing catches about 30-40% of accessibility issues. The rest requires manual testing with screen readers and keyboard navigation. Combine automated checks in CI with regular manual audits.
