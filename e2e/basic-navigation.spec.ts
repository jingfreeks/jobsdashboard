import { test, expect } from '@playwright/test';

test.describe('Basic Navigation', () => {
  test('should redirect to login page by default', async ({ page }) => {
    await page.goto('/');
    
    // Should redirect to login page
    await expect(page.locator('h1:has-text("Log in to Your Account")')).toBeVisible();
  });

  test('should display login page directly', async ({ page }) => {
    await page.goto('/login');
    
    // Check if login form is visible
    await expect(page.locator('h1:has-text("Log in to Your Account")')).toBeVisible();
    await expect(page.locator('input[type="text"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should display register page directly', async ({ page }) => {
    await page.goto('/register');
    
    // Check if register form is visible
    await expect(page.locator('h1:has-text("Create Your Account")')).toBeVisible();
    await expect(page.locator('input[type="text"]')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should handle form input on login page', async ({ page }) => {
    await page.goto('/login');
    
    // Fill form fields
    await page.fill('input[type="text"]', 'testuser');
    await page.fill('input[type="password"]', 'password123');
    
    // Check if values are set
    await expect(page.locator('input[type="text"]')).toHaveValue('testuser');
    await expect(page.locator('input[type="password"]')).toHaveValue('password123');
  });

  test('should handle form input on register page', async ({ page }) => {
    await page.goto('/register');
    
    // Fill form fields
    await page.fill('input[type="text"]', 'Test User');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    
    // Check if values are set
    await expect(page.locator('input[type="text"]')).toHaveValue('Test User');
    await expect(page.locator('input[type="email"]')).toHaveValue('test@example.com');
    await expect(page.locator('input[type="password"]')).toHaveValue('password123');
  });
}); 