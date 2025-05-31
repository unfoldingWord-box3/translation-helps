import { test, expect } from '@playwright/test';

test.describe('Debug rendering issues', () => {
  test('should check for rendering and console errors', async ({ page }) => {
    const consoleMessages = [];
    const networkErrors = [];
    const responses = [];

    // Capture ALL console messages, not just errors
    page.on('console', msg => {
      consoleMessages.push({
        type: msg.type(),
        text: msg.text(),
        location: msg.location()
      });
    });

    // Listen for page errors (uncaught exceptions)
    page.on('pageerror', error => {
      console.log('Page error:', error.message);
      console.log('Stack:', error.stack);
    });

    // Listen for failed network requests
    page.on('requestfailed', request => {
      networkErrors.push({
        url: request.url(),
        failure: request.failure()
      });
    });

    // Track all network responses
    page.on('response', response => {
      responses.push({
        url: response.url(),
        status: response.status(),
        statusText: response.statusText()
      });
    });

    // Navigate to the page
    console.log('Navigating to page...');
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    // Wait a bit for JavaScript to execute
    await page.waitForTimeout(2000);

    // Check if root element exists
    const rootElement = await page.$('#root');
    console.log('Root element exists:', !!rootElement);

    // Check if root has any content
    const rootContent = await page.evaluate(() => {
      const root = document.getElementById('root');
      return {
        exists: !!root,
        innerHTML: root ? root.innerHTML : null,
        childCount: root ? root.children.length : 0
      };
    });
    console.log('Root element content:', rootContent);

    // Log all console messages
    console.log('\n=== Console Messages ===');
    consoleMessages.forEach(msg => {
      console.log(`[${msg.type}] ${msg.text}`);
      if (msg.location.url) {
        console.log(`  at ${msg.location.url}:${msg.location.lineNumber}`);
      }
    });

    // Log network errors
    if (networkErrors.length > 0) {
      console.log('\n=== Network Errors ===');
      networkErrors.forEach(err => {
        console.log(`Failed: ${err.url}`);
        console.log(`  Reason: ${err.failure.errorText}`);
      });
    }

    // Log failed responses
    const failedResponses = responses.filter(r => r.status >= 400);
    if (failedResponses.length > 0) {
      console.log('\n=== Failed HTTP Responses ===');
      failedResponses.forEach(resp => {
        console.log(`${resp.status} ${resp.statusText}: ${resp.url}`);
      });
    }

    // Check for specific elements that should be rendered
    console.log('\n=== Checking for rendered elements ===');
    
    // Check if React rendered anything
    const reactRoot = await page.evaluate(() => {
      const root = document.getElementById('root');
      if (!root) return 'No root element';
      if (root.children.length === 0) return 'Root has no children';
      return 'Root has content';
    });
    console.log('React root status:', reactRoot);

    // Take a screenshot for visual debugging
    await page.screenshot({ path: 'debug-screenshot.png', fullPage: true });
    console.log('Screenshot saved as debug-screenshot.png');

    // Get page HTML for inspection
    const pageHTML = await page.content();
    console.log('\n=== Page HTML (first 500 chars) ===');
    console.log(pageHTML.substring(0, 500) + '...');

    // Check for any error boundaries
    const errorBoundaryText = await page.textContent('body');
    if (errorBoundaryText.includes('Something went wrong') || errorBoundaryText.includes('Error')) {
      console.log('\n=== Possible Error Boundary Message ===');
      console.log(errorBoundaryText);
    }

    // Basic assertion to make test pass/fail
    expect(rootContent.exists).toBe(true);
    expect(rootContent.childCount).toBeGreaterThan(0);
  });
});