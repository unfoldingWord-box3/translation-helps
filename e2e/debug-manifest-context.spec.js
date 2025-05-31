import { test, expect } from '@playwright/test';

test.describe('Debug manifest context', () => {
  test('should check manifest loading in React context', async ({ page }) => {
    // Enable console logging
    page.on('console', msg => {
      if (msg.type() === 'log' || msg.type() === 'error') {
        console.log(`[${msg.type()}] ${msg.text()}`);
      }
    });

    // Navigate to the page
    await page.goto('/');
    
    // Wait for initial load
    await page.waitForTimeout(2000);

    // Inject debugging code to check React context
    const contextData = await page.evaluate(() => {
      // Find React fiber
      const rootElement = document.getElementById('root');
      const reactFiberKey = Object.keys(rootElement).find(key => key.startsWith('__reactFiber'));
      
      if (!reactFiberKey) {
        return { error: 'Could not find React fiber' };
      }

      // Try to traverse the React tree to find context values
      let fiber = rootElement[reactFiberKey];
      const contexts = [];
      
      // Simple traversal to find context providers
      function traverseFiber(node, depth = 0) {
        if (!node || depth > 20) return;
        
        if (node.elementType && node.elementType.displayName) {
          contexts.push({
            name: node.elementType.displayName,
            props: node.memoizedProps
          });
        }
        
        if (node.child) traverseFiber(node.child, depth + 1);
        if (node.sibling) traverseFiber(node.sibling, depth);
      }
      
      traverseFiber(fiber);
      
      return { contexts };
    });

    console.log('\n=== React Context Debug ===');
    console.log(JSON.stringify(contextData, null, 2));

    // Add a console log to the MultiManifestsProvider to see what's happening
    await page.evaluate(() => {
      // Override console.error to catch any YAML parsing errors
      const originalError = console.error;
      console.error = function(...args) {
        if (args[0] && args[0].toString().includes('manifest')) {
          console.log('MANIFEST ERROR:', ...args);
        }
        originalError.apply(console, args);
      };
    });

    // Wait for manifest loading
    await page.waitForTimeout(3000);

    // Check if js-yaml is available
    const yamlCheck = await page.evaluate(() => {
      try {
        // Check if the yaml module is loaded
        return typeof window.jsyaml !== 'undefined' ? 'global' : 'not found';
      } catch (e) {
        return 'error: ' + e.message;
      }
    });

    console.log('\n=== YAML Library Check ===');
    console.log('js-yaml status:', yamlCheck);

    // Try to manually fetch and parse a manifest to see if there's an issue
    const manualFetchTest = await page.evaluate(async () => {
      try {
        const response = await fetch('https://git.door43.org/unfoldingWord/en_ult/raw/branch/master/manifest.yaml');
        const text = await response.text();
        console.log('Manifest text (first 200 chars):', text.substring(0, 200));
        
        // Try to check if load function exists
        const hasLoad = typeof load !== 'undefined';
        console.log('Has load function:', hasLoad);
        
        return {
          fetchSuccess: true,
          responseLength: text.length,
          firstLine: text.split('\n')[0]
        };
      } catch (e) {
        return {
          fetchSuccess: false,
          error: e.message
        };
      }
    });

    console.log('\n=== Manual Fetch Test ===');
    console.log(JSON.stringify(manualFetchTest, null, 2));
  });
});