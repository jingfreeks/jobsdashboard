import { Page } from '@playwright/test';

export async function mockAuthentication(page: Page) {
  // Mock localStorage to simulate authenticated user with redux-persist
  await page.addInitScript(() => {
    // Mock authentication state for redux-persist
    const mockAuthState = {
      user: 'testuser',
      token: 'mock-token-12345',
      userId: '123',
      roles: ['Admin']
    };
    
    // Set onboarding complete
    localStorage.setItem('onboardingComplete', 'true');
    
    // Mock redux-persist storage format
    localStorage.setItem('persist:auth', JSON.stringify({
      user: JSON.stringify(mockAuthState.user),
      token: JSON.stringify(mockAuthState.token),
      userId: JSON.stringify(mockAuthState.userId),
      roles: JSON.stringify(mockAuthState.roles)
    }));
    
    // Also set the root persist key
    localStorage.setItem('persist:root', JSON.stringify({
      auth: JSON.stringify({
        user: JSON.stringify(mockAuthState.user),
        token: JSON.stringify(mockAuthState.token),
        userId: JSON.stringify(mockAuthState.userId),
        roles: JSON.stringify(mockAuthState.roles)
      })
    }));
  });
}

export async function mockBankAPI(page: Page) {
  // Mock the bank API endpoints
  await page.route('**/bank', async (route) => {
    const method = route.request().method();
    
    if (method === 'GET') {
      // Mock GET /bank - return list of banks
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { _id: '1', name: 'Chase Bank' },
          { _id: '2', name: 'Bank of America' },
          { _id: '3', name: 'Wells Fargo' },
          { _id: '4', name: 'Citibank' }
        ])
      });
    } else if (method === 'POST') {
      // Mock POST /bank - create new bank
      const postData = JSON.parse(route.request().postData() || '{}');
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          _id: `new-${Date.now()}`,
          name: postData.name
        })
      });
    } else if (method === 'PATCH') {
      // Mock PATCH /bank - update bank
      const patchData = JSON.parse(route.request().postData() || '{}');
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          _id: patchData._id,
          name: patchData.name
        })
      });
    } else if (method === 'DELETE') {
      // Mock DELETE /bank - delete bank
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true })
      });
    }
  });
}

export async function navigateToBankManagement(page: Page) {
  // Navigate to admin dashboard
  await page.goto('/admin/dashboard');
  
  // Wait for the page to load
  await page.waitForSelector('h1:has-text("Admin Dashboard")', { timeout: 15000 });
  
  // Click on Settings button in the sidebar
  await page.click('aside button:has-text("Settings")');
  
  // Wait for the settings submenu to appear and click on Bank
  await page.waitForSelector('button:has-text("Bank")', { timeout: 5000 });
  await page.click('button:has-text("Bank")');
  
  // Wait for the banks list to load
  await page.waitForSelector('h2:has-text("Banks List")', { timeout: 15000 });
}

export async function waitForPageLoad(page: Page) {
  // Wait for the page to be fully loaded
  await page.waitForLoadState('networkidle');
  await page.waitForLoadState('domcontentloaded');
} 