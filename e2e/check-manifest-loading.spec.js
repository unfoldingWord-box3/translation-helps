import { test, expect } from '@playwright/test';

test.describe('Check manifest loading', () => {
  test('should load manifests and display content', async ({ page }) => {
    const consoleMessages = [];
    const networkRequests = [];
    
    // Capture console messages
    page.on('console', msg => {
      consoleMessages.push({
        type: msg.type(),
        text: msg.text()
      });
    });

    // Capture network requests
    page.on('request', request => {
      if (request.url().includes('door43.org') || request.url().includes('manifest')) {
        networkRequests.push({
          url: request.url(),
          method: request.method()
        });
      }
    });

    // Capture network responses
    page.on('response', response => {
      if (response.url().includes('door43.org') || response.url().includes('manifest')) {
        console.log(`Response: ${response.status()} ${response.url()}`);
      }
    });

    // Navigate to the page
    await page.goto('/');
    
    // Wait for potential manifest loading
    await page.waitForTimeout(5000);

    // Log console messages
    console.log('\n=== Console Messages ===');
    consoleMessages.forEach(msg => {
      if (msg.text.includes('manifest') || msg.text.includes('error') || msg.text.includes('Failed')) {
        console.log(`[${msg.type}] ${msg.text}`);
      }
    });

    // Log network requests to DCS
    console.log('\n=== DCS Network Requests ===');
    networkRequests.forEach(req => {
      console.log(`${req.method} ${req.url}`);
    });

    // Check if manifests are loaded in the context
    const manifestsLoaded = await page.evaluate(() => {
      // Try to access React DevTools or check DOM for manifest data
      const scripturePanel = document.querySelector('[data-testid="scripture-panel"]');
      const notesPanel = document.querySelector('[data-testid="translation-notes-panel"]');
      
      return {
        scriptureContent: scripturePanel ? scripturePanel.textContent : null,
        notesContent: notesPanel ? notesPanel.textContent : null
      };
    });

    console.log('\n=== Content Check ===');
    console.log('Scripture Panel:', manifestsLoaded.scriptureContent);
    console.log('Notes Panel:', manifestsLoaded.notesContent);

    // Check for loading indicators
    const loadingIndicators = await page.$$('text=/loading/i');
    console.log('Loading indicators found:', loadingIndicators.length);

    // Take a screenshot
    await page.screenshot({ path: 'manifest-loading-test.png', fullPage: true });
  });
});