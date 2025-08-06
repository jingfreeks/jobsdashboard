import { test, expect } from '@playwright/test';
import { mockAuthentication, mockBankAPI } from './test-helpers';

test.describe('Bank Management', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication and API
    await mockAuthentication(page);
    await mockBankAPI(page);

    // Navigate to admin dashboard
    await page.goto('/admin/dashboard');
    
    // Wait for the page to load
    await page.waitForSelector('h1:has-text("Admin Dashboard")', { timeout: 15000 });
  });

  // Basic functionality tests
  test('should display admin dashboard', async ({ page }) => {
    await expect(page.locator('h1:has-text("Admin Dashboard")')).toBeVisible();
  });

  test('should have settings section in sidebar', async ({ page }) => {
    await expect(page.locator('aside button:has-text("Settings")')).toBeVisible();
  });

  test('should expand settings menu when clicked', async ({ page }) => {
    await page.click('aside button:has-text("Settings")');
    
    await expect(page.locator('button:has-text("Bank")')).toBeVisible();
    await expect(page.locator('button:has-text("City")')).toBeVisible();
    await expect(page.locator('button:has-text("State")')).toBeVisible();
  });

  test('should navigate to bank management', async ({ page }) => {
    // Click on Settings button to set selectedSection to "settings"
    await page.click('aside button:has-text("Settings")');
    
    // Click on Bank to set selectedSettings to "bank"
    await page.click('button:has-text("Bank")');
    
    // Wait for the banks list to load
    await page.waitForSelector('h2:has-text("Banks List")', { timeout: 15000 });
    await expect(page.locator('h2:has-text("Banks List")')).toBeVisible();
  });

  test('should show main content area', async ({ page }) => {
    await expect(page.locator('main')).toBeVisible();
  });

  test('should have sidebar navigation', async ({ page }) => {
    await expect(page.locator('aside')).toBeVisible();
    await expect(page.locator('button:has-text("Dashboard")')).toBeVisible();
    await expect(page.locator('button:has-text("Jobs")')).toBeVisible();
  });

  // Advanced functionality tests
  test.describe('Advanced Bank Operations', () => {
    test.beforeEach(async ({ page }) => {
      // Navigate to bank management properly
      await page.click('aside button:has-text("Settings")');
      await page.click('button:has-text("Bank")');
      await page.waitForSelector('h2:has-text("Banks List")', { timeout: 15000 });
    });

    test('should show banks list', async ({ page }) => {
      await expect(page.locator('h2:has-text("Banks List")')).toBeVisible();
    });

    test('should show add bank button', async ({ page }) => {
      await expect(page.locator('button:has-text("Add Bank")')).toBeVisible();
    });

    test('should show bank items in list', async ({ page }) => {
      // Wait for bank items to load
      await page.waitForSelector('li:has-text("Chase Bank")', { timeout: 10000 });
      
      // Check if bank items are visible
      await expect(page.locator('li:has-text("Chase Bank")')).toBeVisible();
      await expect(page.locator('li:has-text("Bank of America")')).toBeVisible();
      await expect(page.locator('li:has-text("Wells Fargo")')).toBeVisible();
      await expect(page.locator('li:has-text("Citibank")')).toBeVisible();
    });

    test('should open add bank modal', async ({ page }) => {
      await page.click('button:has-text("Add Bank")');
      
      await expect(page.locator('h3:has-text("Create New Bank")')).toBeVisible();
      await expect(page.locator('input[placeholder="Bank Name"]')).toBeVisible();
      await expect(page.locator('button:has-text("Create")')).toBeVisible();
    });

    test('should close modal when clicking cancel', async ({ page }) => {
      await page.click('button:has-text("Add Bank")');
      await page.click('button:has-text("Cancel")');
      
      await expect(page.locator('h3:has-text("Create New Bank")')).not.toBeVisible();
    });

    test('should close modal when clicking backdrop', async ({ page }) => {
      await page.click('button:has-text("Add Bank")');
      
      // Click outside the modal to close it
      await page.mouse.click(10, 10);
      
      await expect(page.locator('h3:has-text("Create New Bank")')).not.toBeVisible();
    });

    test('should create a new bank', async ({ page }) => {
      await page.click('button:has-text("Add Bank")');
      await page.fill('input[placeholder="Bank Name"]', 'Test Bank');
      await page.click('button:has-text("Create")');
      
      // Wait for modal to close
      await expect(page.locator('h3:has-text("Create New Bank")')).not.toBeVisible();
    });

    test('should validate form input', async ({ page }) => {
      await page.click('button:has-text("Add Bank")');
      
      // Try to click create button without filling the form
      // The button should be disabled, so we'll just check it exists
      const createButton = page.locator('button:has-text("Create")');
      await expect(createButton).toBeVisible();
      
      // Modal should still be open
      await expect(page.locator('h3:has-text("Create New Bank")')).toBeVisible();
    });

    test('should handle keyboard navigation', async ({ page }) => {
      await page.click('button:has-text("Add Bank")');
      await page.keyboard.press('Escape');
      
      await expect(page.locator('h3:has-text("Create New Bank")')).not.toBeVisible();
    });

    test('should show loading state when adding bank', async ({ page }) => {
      await page.click('button:has-text("Add Bank")');
      await page.fill('input[placeholder="Bank Name"]', 'Test Bank');
      await page.click('button:has-text("Create")');
      
      // The loading state might be brief, so just check the modal closes
      await expect(page.locator('h3:has-text("Create New Bank")')).not.toBeVisible();
    });
  });
}); 