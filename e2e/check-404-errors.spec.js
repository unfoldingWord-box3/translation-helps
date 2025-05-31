import { test, expect } from '@playwright/test';

test.describe('Check for 404 errors', () => {
  test('should load without 404 errors', async ({ page }) => {
    const consoleErrors = [];
    const networkErrors = [];

    // Listen for console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Listen for failed network requests
    page.on('requestfailed', request => {
      networkErrors.push({
        url: request.url(),
        failure: request.failure()
      });
    });

    // Track all network responses
    const responses = [];
    page.on('response', response => {
      if (response.status() >= 400) {
        responses.push({
          url: response.url(),
          status: response.status(),
          statusText: response.statusText()
        });
      }
    });

    // Navigate to the page
    await page.goto('/');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Wait a bit more to catch any delayed requests
    await page.waitForTimeout(3000);

    // Log all errors for debugging
    if (consoleErrors.length > 0) {
      console.log('Console errors:', consoleErrors);
    }
    
    if (networkErrors.length > 0) {
      console.log('Network errors:', networkErrors);
    }
    
    if (responses.length > 0) {
      console.log('Failed responses (4xx/5xx):');
      responses.forEach(resp => {
        console.log(`  ${resp.status} ${resp.statusText}: ${resp.url}`);
      });
    }

    // Check that the main elements are visible
    await expect(page.getByText('Translation Helps Viewer')).toBeVisible();
    await expect(page.getByTestId('reference-selector')).toBeVisible();
    
    // Assert no 404 errors
    const notFoundErrors = responses.filter(r => r.status === 404);
    if (notFoundErrors.length > 0) {
      console.log('\n404 Not Found errors:');
      notFoundErrors.forEach(err => {
        console.log(`  - ${err.url}`);
      });
    }
    
    expect(notFoundErrors.length).toBe(0);
  });
});