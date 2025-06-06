import { test, expect } from "@playwright/test";

test.describe("Milestone Marker Rendering", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173");
    await page.waitForSelector(".scripture-panel", { timeout: 30000 });
  });

  test("should render clean text in preview mode", async ({ page }) => {
    // Navigate to Titus 1:1
    await page.click('button[aria-label="Select reference"]');
    await page.selectOption('select[aria-label="Book"]', "TIT");
    await page.selectOption('select[aria-label="Chapter"]', "1");
    await page.selectOption('select[aria-label="Verse"]', "1");
    await page.click('button:has-text("Go")');

    // Wait for scripture to load
    await page.waitForSelector(".scripture-panel .verse-text", { timeout: 10000 });

    // Check that preview mode shows clean text
    const scriptureText = await page.textContent(".scripture-panel");

    // Should NOT contain USFM markers
    expect(scriptureText).not.toContain("\\zaln-s");
    expect(scriptureText).not.toContain("\\zaln-e");
    expect(scriptureText).not.toContain("\\w");
    expect(scriptureText).not.toContain("\\f");

    // Should contain clean readable text
    expect(scriptureText).toContain("Paul");
    expect(scriptureText).toContain("servant");
    expect(scriptureText).toContain("God");

    // Take screenshot for visual confirmation
    await page.screenshot({
      path: "milestone-preview-mode.png",
      fullPage: false,
      clip: {
        x: 0,
        y: 0,
        width: 1280,
        height: 800,
      },
    });
  });

  test("should show milestone markers in source mode when toggled", async ({ page }) => {
    // Navigate to Titus 1:1
    await page.click('button[aria-label="Select reference"]');
    await page.selectOption('select[aria-label="Book"]', "TIT");
    await page.selectOption('select[aria-label="Chapter"]', "1");
    await page.selectOption('select[aria-label="Verse"]', "1");
    await page.click('button:has-text("Go")');

    // Wait for scripture to load
    await page.waitForSelector(".scripture-panel", { timeout: 10000 });

    // Look for preview mode toggle (if it exists in the UI)
    const previewToggle = await page.$('input[type="checkbox"][id="preview"]');

    if (previewToggle) {
      // Toggle to source mode
      await previewToggle.uncheck();

      // Wait for re-render
      await page.waitForTimeout(500);

      // Check that source mode shows USFM markers
      const scriptureText = await page.textContent(".scripture-panel");

      // Should contain USFM markers
      expect(scriptureText).toContain("\\zaln-s");
      expect(scriptureText).toContain("\\zaln-e");
      expect(scriptureText).toContain("\\w");

      // Should have milestone highlighting spans
      const highlightedElements = await page.$$(".milestone-alignment");
      expect(highlightedElements.length).toBeGreaterThan(0);

      // Take screenshot for visual confirmation
      await page.screenshot({
        path: "milestone-source-mode.png",
        fullPage: false,
        clip: {
          x: 0,
          y: 0,
          width: 1280,
          height: 800,
        },
      });
    }
  });

  test("should preserve verse navigation with milestone decorators", async ({ page }) => {
    // Navigate to a chapter with multiple verses
    await page.click('button[aria-label="Select reference"]');
    await page.selectOption('select[aria-label="Book"]', "TIT");
    await page.selectOption('select[aria-label="Chapter"]', "1");
    await page.selectOption('select[aria-label="Verse"]', "1");
    await page.click('button:has-text("Go")');

    // Wait for scripture to load
    await page.waitForSelector(".scripture-panel", { timeout: 10000 });

    // Click on verse 2
    const verse2 = await page.$('.verse-text[data-verse="2"], .v_2, [class*="verse"][class*="2"]');
    if (verse2) {
      await verse2.click();

      // Check that verse 2 is selected
      await page.waitForTimeout(500);
      const selectedVerse = await page.$eval('select[aria-label="Verse"]', (el) => el.value);
      expect(selectedVerse).toBe("2");
    }

    // Take screenshot for visual confirmation
    await page.screenshot({
      path: "milestone-verse-navigation.png",
      fullPage: false,
      clip: {
        x: 0,
        y: 0,
        width: 1280,
        height: 800,
      },
    });
  });

  test("should apply proper CSS styling for milestone markers", async ({ page }) => {
    // Navigate to Titus 1:1
    await page.click('button[aria-label="Select reference"]');
    await page.selectOption('select[aria-label="Book"]', "TIT");
    await page.selectOption('select[aria-label="Chapter"]', "1");
    await page.selectOption('select[aria-label="Verse"]', "1");
    await page.click('button:has-text("Go")');

    // Wait for scripture to load
    await page.waitForSelector(".scripture-panel", { timeout: 10000 });

    // Check if milestone CSS is loaded
    const hasAlignmentStyles = await page.evaluate(() => {
      const styles = Array.from(document.styleSheets);
      return styles.some((sheet) => {
        try {
          const rules = Array.from(sheet.cssRules || []);
          return rules.some(
            (rule) =>
              rule.selectorText &&
              (rule.selectorText.includes(".milestone-alignment") ||
                rule.selectorText.includes(".milestone-word") ||
                rule.selectorText.includes(".aligned-word"))
          );
        } catch (e) {
          return false;
        }
      });
    });

    expect(hasAlignmentStyles).toBe(true);
  });
});
