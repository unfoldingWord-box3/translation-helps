import { test, expect } from '@playwright/test';

test.describe('Test YAML parsing', () => {
  test('should parse YAML correctly', async ({ page }) => {
    // Capture console messages and errors
    const logs = [];
    page.on('console', msg => {
      logs.push({ type: msg.type(), text: msg.text() });
    });
    
    page.on('pageerror', error => {
      console.log('Page error:', error.message);
    });

    // Navigate to the page
    await page.goto('/');
    
    // Wait a moment for initial load
    await page.waitForTimeout(1000);

    // Test YAML parsing directly in the browser
    const yamlTest = await page.evaluate(async () => {
      try {
        // First check if yaml is available
        console.log('Checking for yaml object...');
        const yamlAvailable = typeof yaml !== 'undefined';
        console.log('yaml available globally:', yamlAvailable);
        
        // Try to import it
        let yamlLib;
        try {
          // This won't work in browser but let's see the error
          yamlLib = await import('js-yaml');
          console.log('Import successful, yaml methods:', Object.keys(yamlLib));
        } catch (e) {
          console.log('Import failed:', e.message);
        }
        
        // Try fetching and parsing manually
        const response = await fetch('https://git.door43.org/unfoldingWord/en_ult/raw/branch/master/manifest.yaml');
        const text = await response.text();
        console.log('Fetched manifest, length:', text.length);
        
        // Try different ways to parse
        let parsed = null;
        let parseError = null;
        
        // Method 1: window.jsyaml
        if (window.jsyaml) {
          try {
            parsed = window.jsyaml.load(text);
            console.log('Parsed with window.jsyaml');
          } catch (e) {
            console.log('window.jsyaml.load failed:', e.message);
          }
        }
        
        // Method 2: global yaml
        if (!parsed && window.yaml) {
          try {
            parsed = window.yaml.load(text);
            console.log('Parsed with window.yaml');
          } catch (e) {
            console.log('window.yaml.load failed:', e.message);
          }
        }
        
        return {
          yamlAvailable,
          windowJsyaml: !!window.jsyaml,
          windowYaml: !!window.yaml,
          parsed: !!parsed,
          parsedKeys: parsed ? Object.keys(parsed) : null,
          manifestProjects: parsed?.projects?.length || 0
        };
      } catch (e) {
        return { error: e.message, stack: e.stack };
      }
    });

    console.log('\n=== YAML Test Results ===');
    console.log(JSON.stringify(yamlTest, null, 2));

    // Log all console messages
    console.log('\n=== Browser Console Logs ===');
    logs.forEach(log => {
      console.log(`[${log.type}] ${log.text}`);
    });

    // Check how js-yaml is being loaded by Vite
    const viteModules = await page.evaluate(() => {
      // Check if there are any Vite-related errors
      const scripts = Array.from(document.querySelectorAll('script'));
      return scripts.map(s => ({
        src: s.src,
        type: s.type,
        hasContent: !!s.textContent
      })).filter(s => s.src.includes('js-yaml') || s.src.includes('yaml'));
    });

    console.log('\n=== Scripts loading YAML ===');
    console.log(JSON.stringify(viteModules, null, 2));
  });
});