Cypress and Selenium are both end-to-end testing tools for web applications, but they differ significantly in architecture, execution model, developer experience, and capabilities.

**Cypress** runs directly in the browser alongside your application. It uses the same JavaScript runtime as your app, giving it direct access to the DOM, network requests, and browser APIs.

```javascript
// Cypress test
describe('Login', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('logs in successfully', () => {
    cy.get('[data-testid="email"]').type('alice@example.com');
    cy.get('[data-testid="password"]').type('password123');
    cy.get('[data-testid="submit"]').click();
    cy.url().should('include', '/dashboard');
    cy.contains('Welcome, Alice');
  });

  it('shows error for invalid credentials', () => {
    cy.get('[data-testid="email"]').type('wrong@example.com');
    cy.get('[data-testid="password"]').type('wrong');
    cy.get('[data-testid="submit"]').click();
    cy.get('.error-message').should('contain', 'Invalid credentials');
  });
});
```

**Selenium** uses the WebDriver protocol to control an external browser process. It communicates with the browser through a driver (ChromeDriver, GeckoDriver) over HTTP.

```python
# Selenium test (Python)
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

driver = webdriver.Chrome()
driver.get("http://localhost:3000/login")

email = driver.find_element(By.CSS_SELECTOR, '[data-testid="email"]')
email.send_keys("alice@example.com")

password = driver.find_element(By.CSS_SELECTOR, '[data-testid="password"]')
password.send_keys("password123")

submit = driver.find_element(By.CSS_SELECTOR, '[data-testid="submit"]')
submit.click()

WebDriverWait(driver, 10).until(
    EC.url_contains("/dashboard")
)

assert "Welcome, Alice" in driver.page_source
driver.quit()
```

**Key differences:**

| Aspect | Cypress | Selenium |
|--------|---------|----------|
| Architecture | Runs in browser (same process) | External browser control via WebDriver |
| Language | JavaScript/TypeScript only | Java, Python, C#, Ruby, JS, etc. |
| Browser support | Chrome, Firefox, Edge, Electron | All major browsers |
| Speed | Faster (in-browser execution) | Slower (HTTP communication) |
| Debugging | Excellent (time travel, screenshots, video) | Basic (screenshots) |
| Automatic waits | Yes (retry-able assertions) | No (explicit waits needed) |
| Network mocking | Built-in (intercept) | Requires proxy/server |
| Iframe support | Limited | Full |
| Multi-tab | Not supported | Supported |
| Mobile testing | Not supported | Supported (via Appium) |
| Parallel execution | Via parallelization config | Via Selenium Grid |
| CI/CD integration | Excellent (cypress cloud) | Requires setup |

**Cypress advantages:**

```javascript
// Automatic waiting — no explicit waits needed
cy.get('.element'); // Retries until element exists
cy.contains('text'); // Retries until text appears

// Time travel — see each step in the test runner
cy.get('.button').click();
cy.get('.result').should('be.visible');

// Network interception
cy.intercept('GET', '/api/users', { fixture: 'users.json' }).as('getUsers');
cy.visit('/users');
cy.wait('@getUsers');

// Component testing
cy.mount(<Button onClick={onClick}>Click me</Button>);
cy.get('button').click();
```

**Selenium advantages:**

```python
# Multi-language support
# True cross-browser testing (including Safari)
# Multi-tab/window handling
driver.execute_script("window.open('https://example.com')")
driver.switch_to.window(driver.window_handles[1])

# Mobile testing via Appium
# Large ecosystem and community
```

**When to use each:**

**Use Cypress when:**
- Building modern JavaScript web applications
- Developer experience and debugging are priorities
- You need fast, reliable E2E tests
- Your team works in JavaScript/TypeScript
- You want built-in network mocking and time travel

**Use Selenium when:**
- You need Safari or mobile browser testing
- Your team uses languages other than JavaScript
- You need multi-tab testing
- You're testing across many different browser versions
- You have existing Selenium infrastructure

**Modern alternatives:**

- **Playwright** — Microsoft's E2E tool with multi-browser support, auto-waits, and modern DX. Combines Cypress-like DX with Selenium-like browser coverage.
- **Puppeteer** — Chrome/Chromium-only, used for automation and testing.

```javascript
// Playwright test
import { test, expect } from '@playwright/test';

test('login flow', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[data-testid="email"]', 'alice@example.com');
  await page.fill('[data-testid="password"]', 'password123');
  await page.click('[data-testid="submit"]');
  await expect(page).toHaveURL('/dashboard');
  await expect(page.locator('text=Welcome, Alice')).toBeVisible();
});
```

Playwright is increasingly becoming the preferred choice for new projects as it combines the best aspects of both Cypress and Selenium.
