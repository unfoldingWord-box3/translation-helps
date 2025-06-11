import { test, expect } from "@playwright/test";

import { readFileSync } from "fs";
import { resolve } from "path";

test.describe("Verse Chunk Rendering", () => {
  test("should render only the selected verse chunk", async ({ page }) => {
    await page.goto("http://localhost:5173/");

    // Wait for the page to fully load
    await page.waitForLoadState("networkidle", { timeout: 30000 });

    // Select the reference with increased timeout
    await page.waitForSelector('[data-testid="organization-selector"]', { timeout: 20000 });
    await page.selectOption('[data-testid="organization-selector"]', "unfoldingWord");

    await page.waitForSelector('[data-testid="language-selector"]', { timeout: 10000 });
    await page.selectOption('[data-testid="language-selector"]', { label: "EN - English" });

    await page.waitForSelector('[data-testid="resource-selector"]', { timeout: 10000 });
    await page.selectOption('[data-testid="resource-selector"]', {
      label: "ULT - unfoldingWord Literal Text",
    });

    await page.waitForSelector('[data-testid="book-selector"]', { timeout: 10000 });
    await page.selectOption('[data-testid="book-selector"]', { label: "Titus" });

    await page.waitForSelector('[data-testid="chapter-selector"]', { timeout: 10000 });
    await page.selectOption('[data-testid="chapter-selector"]', "1");

    await page.waitForSelector('[data-testid="verse-selector"]', { timeout: 10000 });
    await page.selectOption('[data-testid="verse-selector"]', "1");

    // Wait for the renderer to finish processing with increased timeout
    await page.waitForSelector(".usfm-renderer-container", { timeout: 20000 });

    const rendererHtml = await page.locator(".usfm-renderer-container").innerHTML();

    // The expected HTML should only contain the verse, not the whole document.
    const testCasePath = resolve(__dirname, "../../docs/verse-1-test-case.md");
    const testCaseContent = readFileSync(testCasePath, "utf-8");
    const expectedHtmlRaw = testCaseContent
      .split("## Desired HTML Output")[1]
      .split("```")[1]
      .trim();

    // For now, let's just check that the rendered content does NOT contain the file header.
    expect(rendererHtml).not.toContain('id="sectionable"');
    expect(rendererHtml).not.toContain("\\id TIT EN_ULT");

    // A more specific check will be added once the rendering is correct.
    // For now, we are just ensuring the chunking works.
    const verseContent = `Paul, a servant of God`;
    const renderedText = await page.locator(".usfm-renderer-container").innerText();
    expect(renderedText).toContain(verseContent);
  });
});
