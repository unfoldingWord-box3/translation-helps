import { test, expect } from "@playwright/test";

test.describe("Translation Questions Integration Tests", () => {
  test("should display translation questions for verses that have them", async ({ page }) => {
    // Capture console messages for debugging
    page.on("console", (msg) => {
      const text = msg.text();
      if (
        text.includes("tQ:") ||
        text.includes("Loading tQ") ||
        text.includes("Found") ||
        text.includes("Parsed")
      ) {
        console.log(`[${msg.type()}] ${text}`);
      }
    });

    // Navigate to the page
    await page.goto("/");

    // Wait for manifests to load
    console.log("Waiting for manifests to load...");
    await page.waitForTimeout(3000);

    // Test 1: Titus 1:1 - Should show 1 translation question
    console.log("\n=== Testing Titus 1:1 ===");

    // Select Titus 1:1 (should be default)
    await page.selectOption('[data-testid="book-selector"]', "tit");
    await page.selectOption('[data-testid="chapter-selector"]', "1");
    await page.selectOption('[data-testid="verse-selector"]', "1");
    await page.waitForTimeout(1000);

    // Click Translation Questions tab
    await page.locator("text=Translation Questions").click();
    await page.waitForTimeout(2000);

    // Check that questions are displayed
    const tq1Content = await page
      .locator('[data-testid="translation-questions-panel"]')
      .textContent();
    console.log("Titus 1:1 TQ Content:", tq1Content);

    // Verify specific question content
    await expect(page.locator("text=/What was Paul.*purpose/i")).toBeVisible();
    await expect(page.locator("text=/establish the faith/i")).toBeVisible();

    // Take screenshot
    await page.screenshot({ path: "translation-questions-titus-1-1.png", fullPage: true });

    // Test 2: Titus 1:2 - Should show 2 translation questions
    console.log("\n=== Testing Titus 1:2 ===");

    // Change to verse 2
    await page.selectOption('[data-testid="verse-selector"]', "2");
    await page.waitForTimeout(2000);

    const tq2Content = await page
      .locator('[data-testid="translation-questions-panel"]')
      .textContent();
    console.log("Titus 1:2 TQ Content:", tq2Content);

    // Verify both questions are displayed
    await expect(page.locator("text=/When did God promise.*everlasting life/i")).toBeVisible();
    await expect(page.locator("text=/Does God lie/i")).toBeVisible();
    await expect(page.locator("text=/promised it to them before/i")).toBeVisible();
    await expect(page.locator("text=/A: No./")).toBeVisible();

    // Take screenshot
    await page.screenshot({ path: "translation-questions-titus-1-2.png", fullPage: true });

    // Test 3: Verify verse 16 also has questions (showing comprehensive coverage)
    console.log("\n=== Testing Titus 1:16 (coverage test) ===");

    // Change to verse 16 to show broad question coverage
    await page.selectOption('[data-testid="verse-selector"]', "16");
    await page.waitForTimeout(2000);

    const verse16Content = await page
      .locator('[data-testid="translation-questions-panel"]')
      .textContent();
    console.log("Titus 1:16 TQ Content:", verse16Content);

    // Verify this verse also has questions (showing comprehensive coverage)
    await expect(page.locator("text=/corrupted man professes/i")).toBeVisible();

    // Test 4: Different book - Test Genesis (if available)
    console.log("\n=== Testing Genesis 1:1 ===");

    // Try Genesis
    await page.selectOption('[data-testid="book-selector"]', "gen");
    await page.selectOption('[data-testid="chapter-selector"]', "1");
    await page.selectOption('[data-testid="verse-selector"]', "1");
    await page.waitForTimeout(3000);

    const genContent = await page
      .locator('[data-testid="translation-questions-panel"]')
      .textContent();
    console.log("Genesis 1:1 TQ Content:", genContent);

    // Take screenshot of Genesis
    await page.screenshot({ path: "translation-questions-genesis-1-1.png", fullPage: true });

    // Test 5: Tab interaction - Switch between tabs
    console.log("\n=== Testing tab interaction ===");

    // Go back to Titus with questions
    await page.selectOption('[data-testid="book-selector"]', "tit");
    await page.selectOption('[data-testid="chapter-selector"]', "1");
    await page.selectOption('[data-testid="verse-selector"]', "1");
    await page.waitForTimeout(1000);

    // Click Translation Notes tab
    await page.locator("text=Translation Notes").click();
    await page.waitForTimeout(1000);

    // Verify Translation Notes content is visible
    await expect(page.locator('[data-testid="translation-notes-panel"]')).toBeVisible();

    // Click back to Translation Questions
    await page.locator("text=Translation Questions").click();
    await page.waitForTimeout(1000);

    // Verify questions are still there
    await expect(page.locator("text=/What was Paul.*purpose/i")).toBeVisible();

    // Final comprehensive screenshot
    await page.screenshot({ path: "translation-questions-final-test.png", fullPage: true });

    // Test 6: Error handling - Check console for any errors
    console.log("\n=== Checking for errors ===");

    // Check if any error messages are displayed in UI
    const errorMessages = await page.locator("text=/error|failed|Error loading/i").all();
    console.log("UI error messages found:", errorMessages.length);
    for (const msg of errorMessages) {
      console.log(" -", await msg.textContent());
    }

    // Log success metrics
    console.log("\n=== Success Metrics ===");
    const successLogs = await page.evaluate(() => {
      return (
        window.console._logs?.filter(
          (log) =>
            log.includes("tQ: Loaded") || (log.includes("Found") && log.includes("tQ entries"))
        ) || []
      );
    });
    console.log("Success logs captured:", successLogs.length);
  });

  test("should handle loading states properly", async ({ page }) => {
    // Test loading states and transitions
    page.on("console", (msg) => {
      const text = msg.text();
      if (text.includes("Loading tQ") || text.includes("tQ: Loading")) {
        console.log(`[LOADING] ${text}`);
      }
    });

    await page.goto("/");

    // Check initial loading state
    await page.locator("text=Translation Questions").click();

    // Verify loading state is shown briefly
    const loadingVisible = await page.locator("text=Loading").isVisible();
    console.log("Loading state visible:", loadingVisible);

    // Wait for loading to complete
    await page.waitForTimeout(3000);

    // Verify content is loaded
    const finalContent = await page
      .locator('[data-testid="translation-questions-panel"]')
      .textContent();
    console.log("Final loaded content length:", finalContent.length);

    expect(finalContent.length).toBeGreaterThan(10); // Should have some content
  });

  test("should maintain questions when changing verses with questions", async ({ page }) => {
    // Test verse-to-verse navigation
    await page.goto("/");
    await page.waitForTimeout(3000);

    // Start with Titus 1:1
    await page.selectOption('[data-testid="book-selector"]', "tit");
    await page.selectOption('[data-testid="chapter-selector"]', "1");
    await page.selectOption('[data-testid="verse-selector"]', "1");
    await page.locator("text=Translation Questions").click();
    await page.waitForTimeout(2000);

    // Verify first question
    await expect(page.locator("text=/What was Paul.*purpose/i")).toBeVisible();

    // Switch to verse 2
    await page.selectOption('[data-testid="verse-selector"]', "2");
    await page.waitForTimeout(2000);

    // Verify different questions appear
    await expect(page.locator("text=/When did God promise.*everlasting life/i")).toBeVisible();
    await expect(page.locator("text=/Does God lie/i")).toBeVisible();

    // Switch back to verse 1
    await page.selectOption('[data-testid="verse-selector"]', "1");
    await page.waitForTimeout(2000);

    // Verify original question is back
    await expect(page.locator("text=/What was Paul.*purpose/i")).toBeVisible();

    console.log("Verse switching test completed successfully");
  });
});
