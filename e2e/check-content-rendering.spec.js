import { test, expect } from '@playwright/test';

test.describe('Check content rendering', () => {
  test('should render scripture content after manifests load', async ({ page }) => {
    // Capture console messages
    page.on('console', msg => {
      const text = msg.text();
      if (text.includes('manifest') || text.includes('Parsed') || text.includes('verses')) {
        console.log(`[${msg.type()}] ${text}`);
      }
    });

    // Navigate to the page
    await page.goto('/');
    
    // Wait for manifests to load (we saw they take a few seconds)
    console.log('Waiting for manifests to load...');
    await page.waitForTimeout(3000);
    
    // Check if the scripture content is now visible
    const scriptureContent = await page.locator('[data-testid="scripture-panel"]').textContent();
    console.log('\nScripture Panel Content:', scriptureContent);
    
    // Check for verse content specifically
    const verses = await page.locator('.verse').count();
    console.log('Number of verses found:', verses);
    
    // If no verses, let's check what's in the React context
    if (verses === 0) {
      // Try clicking on the scripture panel to trigger a re-render
      await page.locator('[data-testid="scripture-panel"]').click();
      await page.waitForTimeout(1000);
      
      const versesAfterClick = await page.locator('.verse').count();
      console.log('Verses after click:', versesAfterClick);
    }
    
    // Check translation notes
    const notesContent = await page.locator('[data-testid="translation-notes-panel"]').textContent();
    console.log('\nTranslation Notes Content:', notesContent);
    
    // Try changing the reference to trigger a reload
    console.log('\nChanging chapter to trigger reload...');
    await page.selectOption('[data-testid="chapter-selector"]', '2');
    await page.waitForTimeout(2000);
    
    const versesChapter2 = await page.locator('.verse').count();
    console.log('Verses in chapter 2:', versesChapter2);
    
    // Go back to chapter 1
    await page.selectOption('[data-testid="chapter-selector"]', '1');
    await page.waitForTimeout(2000);
    
    const versesBackToChapter1 = await page.locator('.verse').count();
    console.log('Verses back in chapter 1:', versesBackToChapter1);
    
    // Take a final screenshot
    await page.screenshot({ path: 'content-rendering-test.png', fullPage: true });
    
    // Check if any error messages are displayed
    const errorMessages = await page.locator('text=/error|failed|no.*available/i').all();
    console.log('\nError messages found:', errorMessages.length);
    for (const msg of errorMessages) {
      console.log(' -', await msg.textContent());
    }
  });
});