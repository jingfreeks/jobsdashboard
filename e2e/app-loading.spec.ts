import { test, expect } from '@playwright/test';

test.describe('App Loading', () => {
  test('should load the application successfully', async ({ page }) => {
    await page.goto('/');
    
    // Should redirect to login page
    await expect(page.locator('h1:has-text("Log in to Your Account")')).toBeVisible();
  });

  test('should have working navigation between login and register', async ({ page }) => {
    await page.goto('/login');
    
    // Check if we can navigate to register
    await page.goto('/register');
    await expect(page.locator('h1:has-text("Create Your Account")')).toBeVisible();
    
    // Check if we can navigate back to login
    await page.goto('/login');
    await expect(page.locator('h1:has-text("Log in to Your Account")')).toBeVisible();
  });

  test('should handle form interactions on login page', async ({ page }) => {
    await page.goto('/login');
    
    // Test form interactions
    const usernameInput = page.locator('input[type="text"]');
    const passwordInput = page.locator('input[type="password"]');
    const submitButton = page.locator('button[type="submit"]');
    
    // Fill form
    await usernameInput.fill('testuser');
    await passwordInput.fill('password123');
    
    // Verify values
    await expect(usernameInput).toHaveValue('testuser');
    await expect(passwordInput).toHaveValue('password123');
    
    // Verify submit button is enabled
    await expect(submitButton).toBeEnabled();
  });

  test('should handle form interactions on register page', async ({ page }) => {
    await page.goto('/register');
    
    // Test form interactions
    const nameInput = page.locator('input[type="text"]');
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    const submitButton = page.locator('button[type="submit"]');
    
    // Fill form
    await nameInput.fill('Test User');
    await emailInput.fill('test@example.com');
    await passwordInput.fill('password123');
    
    // Verify values
    await expect(nameInput).toHaveValue('Test User');
    await expect(emailInput).toHaveValue('test@example.com');
    await expect(passwordInput).toHaveValue('password123');
    
    // Verify submit button is enabled
    await expect(submitButton).toBeEnabled();
  });
}); 