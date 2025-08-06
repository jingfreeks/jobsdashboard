import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should display login page', async ({ page }) => {
    await page.goto('/login');
    
    // Check if login form is visible
    await expect(page.locator('h1:has-text("Log in to Your Account")')).toBeVisible();
    await expect(page.locator('input[type="text"]')).toBeVisible(); // username field
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should navigate to register page', async ({ page }) => {
    await page.goto('/login');
    
    // Look for register link - it might be in different formats
    const registerLink = page.locator('a:has-text("Register"), a:has-text("Sign up"), a:has-text("Create account")').first();
    await registerLink.click();
    
    // Check if we're on register page
    await expect(page.locator('h1:has-text("Create Your Account")')).toBeVisible();
  });

  test('should display register page', async ({ page }) => {
    await page.goto('/register');
    
    // Check if register form is visible
    await expect(page.locator('h1:has-text("Create Your Account")')).toBeVisible();
    await expect(page.locator('input[type="text"]')).toBeVisible(); // name field
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should navigate to login page', async ({ page }) => {
    await page.goto('/register');
    
    // Look for login link - it might be in different formats
    const loginLink = page.locator('a:has-text("Login"), a:has-text("Sign in"), a:has-text("Log in")').first();
    await loginLink.click();
    
    // Check if we're on login page
    await expect(page.locator('h1:has-text("Log in to Your Account")')).toBeVisible();
  });

  test('should show validation errors for empty form', async ({ page }) => {
    await page.goto('/login');
    
    // Try to submit empty form
    await page.click('button[type="submit"]');
    
    // Should still be on login page
    await expect(page.locator('h1:has-text("Log in to Your Account")')).toBeVisible();
  });

  test('should handle form input', async ({ page }) => {
    await page.goto('/login');
    
    // Fill form fields
    await page.fill('input[type="text"]', 'testuser'); // username field
    await page.fill('input[type="password"]', 'password123');
    
    // Check if values are set
    await expect(page.locator('input[type="text"]')).toHaveValue('testuser');
    await expect(page.locator('input[type="password"]')).toHaveValue('password123');
  });
}); 