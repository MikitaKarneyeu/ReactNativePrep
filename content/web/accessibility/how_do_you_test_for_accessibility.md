Accessibility testing combines automated tools, manual testing, and user testing to ensure your web application is usable by people with disabilities. A comprehensive testing strategy catches different types of issues at different stages of development.

**1. Automated testing (catches ~30-40% of issues):**

**In unit/component tests (jest-axe):**
```javascript
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

test('form has no accessibility violations', async () => {
  const { container } = render(<LoginForm />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

// Configure axe rules
test('checks with specific rules', async () => {
  const { container } = render(<Component />);
  const results = await axe(container, {
    rules: {
      'color-contrast': { enabled: true },
      'valid-lang': { enabled: true }
    }
  });
  expect(results).toHaveNoViolations();
});
```

**In E2E tests (Cypress/Playwright):**
```javascript
// Cypress with cypress-axe
describe('Accessibility', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.injectAxe();
  });

  it('has no violations on home page', () => {
    cy.checkA11y();
  });

  it('has no violations in navigation', () => {
    cy.checkA11y('nav');
  });

  it('has no violations after opening modal', () => {
    cy.get('[data-testid="open-modal"]').click();
    cy.checkA11y('[role="dialog"]');
  });
});
```

**Browser extensions:**
- axe DevTools (Chrome, Firefox)
- WAVE (Chrome, Firefox)
- Lighthouse (Chrome DevTools)
- Accessibility Insights (Chrome)

**2. Manual testing (catches remaining issues):**

**Keyboard testing:**
```
□ Tab through all interactive elements
□ Focus is always visible
□ Enter/Space activates buttons and links
□ Arrow keys work in menus, tabs, radio groups
□ Escape closes modals and dropdowns
□ No keyboard traps (can always tab out)
□ Tab order follows visual layout
□ Skip links work
```

**Screen reader testing:**
```
□ Navigate by headings (VoiceOver: VO+Cmd+H)
□ Navigate by landmarks (VO+Cmd+U, then select)
□ All images have meaningful alt text
□ Form inputs are labeled
□ Dynamic content is announced (aria-live)
□ Interactive elements are clearly identified
□ Tables have proper headers
□ Page title is descriptive
```

**Visual testing:**
```
□ Color contrast ratio meets 4.5:1 (normal) / 3:1 (large)
□ Content is readable at 200% zoom
□ No information conveyed by color alone
□ Animations respect prefers-reduced-motion
□ Text is resizable without breaking layout
□ Focus indicators are visible
```

**3. CI/CD integration:**

```yaml
# GitHub Actions
- name: Run Lighthouse
  uses: treosh/lighthouse-ci-action@v10
  with:
    urls: |
      http://localhost:3000/
      http://localhost:3000/about
    budgetPath: ./lighthouse-budget.json

# Lighthouse budget
[
  {
    "path": "/*",
    "timings": [
      { "metric": "accessibility", "budget": 100 }
    ]
  }
]
```

**4. User testing:**

The most valuable form of accessibility testing involves real users with disabilities. This reveals issues that automated and manual testing miss:

- How do screen reader users actually navigate your site?
- Can users with motor disabilities complete key tasks?
- Is the content understandable for users with cognitive disabilities?

**Testing tools summary:**

| Tool | Type | Catches |
|------|------|---------|
| jest-axe | Automated (unit) | HTML structure, ARIA, contrast |
| cypress-axe | Automated (E2E) | Same as jest-axe in full app |
| Lighthouse | Automated (browser) | Accessibility score and issues |
| axe DevTools | Browser extension | Detailed issue reporting |
| WAVE | Browser extension | Visual accessibility overlay |
| VoiceOver | Screen reader | Real assistive technology experience |
| NVDA | Screen reader | Most popular Windows screen reader |

**Recommended testing workflow:**

1. **During development** — IDE extensions catch issues in real-time
2. **Unit tests** — jest-axe catches structural issues
3. **PR review** — Lighthouse CI checks accessibility score
4. **Manual testing** — Keyboard and screen reader testing before release
5. **Periodic audits** — Full WCAG audit with tools and user testing

No single tool catches all accessibility issues. A combination of automated tools, manual testing, and real user feedback provides the best coverage.
