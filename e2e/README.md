# End-to-End Testing with Playwright

This directory contains end-to-end tests for the Jobs Dashboard application using Playwright.

## Test Structure

- `bank-management.spec.ts` - Tests for bank management functionality
- `auth-flow.spec.ts` - Tests for authentication flows

## Running Tests

### All Tests
```bash
npm run test:e2e
```

### Interactive UI Mode
```bash
npm run test:e2e:ui
```

### Debug Mode
```bash
npm run test:e2e:debug
```

### Headed Mode (with browser visible)
```bash
npm run test:e2e:headed
```

### View Test Report
```bash
npm run test:e2e:report
```

## Test Configuration

Tests are configured in `playwright.config.ts` with:
- Cross-browser testing (Chrome, Firefox, Safari)
- Mobile testing (Pixel 5, iPhone 12)
- Automatic dev server startup
- Screenshot and video capture on failure
- HTML report generation

## Writing Tests

### Basic Test Structure
```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test('should do something', async ({ page }) => {
    await page.goto('/path');
    await expect(page.locator('selector')).toBeVisible();
  });
});
```

### Best Practices
1. Use descriptive test names
2. Group related tests with `test.describe()`
3. Use `test.beforeEach()` for common setup
4. Use meaningful selectors (prefer text content over CSS classes)
5. Add comments for complex test steps
6. Test both positive and negative scenarios

### Common Patterns
```typescript
// Wait for element
await page.waitForSelector('selector');

// Click element
await page.click('button:has-text("Submit")');

// Fill form
await page.fill('input[name="email"]', 'test@example.com');

// Assert element is visible
await expect(page.locator('h1')).toBeVisible();

// Assert element has value
await expect(page.locator('input')).toHaveValue('expected value');
```

## CI/CD Integration

Tests run automatically in GitHub Actions on:
- Push to main/develop branches
- Pull requests to main/develop branches

Test results and artifacts are uploaded for review. 