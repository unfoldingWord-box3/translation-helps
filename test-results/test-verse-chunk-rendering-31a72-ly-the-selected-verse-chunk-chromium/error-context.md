# Test info

- Name: Verse Chunk Rendering >> should render only the selected verse chunk
- Location: /Volumes/GithubProjects/translation-helps/e2e/test-verse-chunk-rendering.spec.js:7:7

# Error details

```
Error: page.waitForSelector: Target page, context or browser has been closed
Call log:
  - waiting for locator('[data-testid="organization-selector"]') to be visible

    at /Volumes/GithubProjects/translation-helps/e2e/test-verse-chunk-rendering.spec.js:11:16
```

# Test source

```ts
   1 | import { test, expect } from "@playwright/test";
   2 |
   3 | import { readFileSync } from "fs";
   4 | import { resolve } from "path";
   5 |
   6 | test.describe("Verse Chunk Rendering", () => {
   7 |   test("should render only the selected verse chunk", async ({ page }) => {
   8 |     await page.goto("http://localhost:5173/");
   9 |
  10 |     // Select the reference
> 11 |     await page.waitForSelector('[data-testid="organization-selector"]');
     |                ^ Error: page.waitForSelector: Target page, context or browser has been closed
  12 |     await page.selectOption('[data-testid="organization-selector"]', "unfoldingWord");
  13 |
  14 |     await page.waitForSelector('[data-testid="language-selector"]');
  15 |     await page.selectOption('[data-testid="language-selector"]', { label: "EN - English" });
  16 |
  17 |     await page.waitForSelector('[data-testid="resource-selector"]');
  18 |     await page.selectOption('[data-testid="resource-selector"]', {
  19 |       label: "ULT - unfoldingWord Literal Text",
  20 |     });
  21 |
  22 |     await page.waitForSelector('[data-testid="book-selector"]');
  23 |     await page.selectOption('[data-testid="book-selector"]', { label: "Titus" });
  24 |
  25 |     await page.waitForSelector('[data-testid="chapter-selector"]');
  26 |     await page.selectOption('[data-testid="chapter-selector"]', "1");
  27 |
  28 |     await page.waitForSelector('[data-testid="verse-selector"]');
  29 |     await page.selectOption('[data-testid="verse-selector"]', "1");
  30 |
  31 |     // Wait for the renderer to finish processing
  32 |     await page.waitForSelector(".usfm-renderer-container");
  33 |
  34 |     const rendererHtml = await page.locator(".usfm-renderer-container").innerHTML();
  35 |
  36 |     // The expected HTML should only contain the verse, not the whole document.
  37 |     const testCasePath = resolve(__dirname, "../../docs/verse-1-test-case.md");
  38 |     const testCaseContent = readFileSync(testCasePath, "utf-8");
  39 |     const expectedHtmlRaw = testCaseContent
  40 |       .split("## Desired HTML Output")[1]
  41 |       .split("```")[1]
  42 |       .trim();
  43 |
  44 |     // For now, let's just check that the rendered content does NOT contain the file header.
  45 |     expect(rendererHtml).not.toContain('id="sectionable"');
  46 |     expect(rendererHtml).not.toContain("\\id TIT EN_ULT");
  47 |
  48 |     // A more specific check will be added once the rendering is correct.
  49 |     // For now, we are just ensuring the chunking works.
  50 |     const verseContent = `Paul, a servant of God`;
  51 |     const renderedText = await page.locator(".usfm-renderer-container").innerText();
  52 |     expect(renderedText).toContain(verseContent);
  53 |   });
  54 | });
  55 |
```