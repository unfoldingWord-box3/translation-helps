# Test info

- Name: Check for 404 errors >> should load without 404 errors
- Location: /Volumes/GithubProjects/translation-helps/e2e/check-404-errors.spec.js:4:7

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 0
Received: 3
    at /Volumes/GithubProjects/translation-helps/e2e/check-404-errors.spec.js:73:35
```

# Page snapshot

```yaml
- navigation:
  - heading "Translation Helps Viewer" [level=1]
  - text: Titus 1:1
- main:
  - text: Book
  - combobox "Book":
    - option "Genesis"
    - option "Exodus"
    - option "Leviticus"
    - option "Numbers"
    - option "Deuteronomy"
    - option "Joshua"
    - option "Judges"
    - option "Ruth"
    - option "1 Samuel"
    - option "2 Samuel"
    - option "1 Kings"
    - option "2 Kings"
    - option "1 Chronicles"
    - option "2 Chronicles"
    - option "Ezra"
    - option "Nehemiah"
    - option "Esther"
    - option "Job"
    - option "Psalms"
    - option "Proverbs"
    - option "Ecclesiastes"
    - option "Song of Solomon"
    - option "Isaiah"
    - option "Jeremiah"
    - option "Lamentations"
    - option "Ezekiel"
    - option "Daniel"
    - option "Hosea"
    - option "Joel"
    - option "Amos"
    - option "Obadiah"
    - option "Jonah"
    - option "Micah"
    - option "Nahum"
    - option "Habakkuk"
    - option "Zephaniah"
    - option "Haggai"
    - option "Zechariah"
    - option "Malachi"
    - option "Matthew"
    - option "Mark"
    - option "Luke"
    - option "John"
    - option "Acts"
    - option "Romans"
    - option "1 Corinthians"
    - option "2 Corinthians"
    - option "Galatians"
    - option "Ephesians"
    - option "Philippians"
    - option "Colossians"
    - option "1 Thessalonians"
    - option "2 Thessalonians"
    - option "1 Timothy"
    - option "2 Timothy"
    - option "Titus" [selected]
    - option "Philemon"
    - option "Hebrews"
    - option "James"
    - option "1 Peter"
    - option "2 Peter"
    - option "1 John"
    - option "2 John"
    - option "3 John"
    - option "Jude"
    - option "Revelation"
  - text: Chapter
  - combobox "Chapter":
    - option "1" [selected]
    - option "2"
    - option "3"
  - text: Verse
  - combobox "Verse":
    - option "1" [selected]
    - option "2"
    - option "3"
    - option "4"
    - option "5"
    - option "6"
    - option "7"
    - option "8"
    - option "9"
    - option "10"
    - option "11"
    - option "12"
    - option "13"
    - option "14"
    - option "15"
    - option "16"
    - option "17"
    - option "18"
    - option "19"
    - option "20"
    - option "21"
    - option "22"
    - option "23"
    - option "24"
    - option "25"
    - option "26"
    - option "27"
    - option "28"
    - option "29"
    - option "30"
    - option "31"
  - text: TIT 1:1
  - heading "TIT 1" [level=2]
  - paragraph: No verses available for this chapter.
  - button "Translation Notes"
  - button "Translation Questions"
  - button "Translation Words"
  - button "Translation Word Links"
  - heading "Translation Notes" [level=3]
  - paragraph: No translation notes available for this verse.
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 |
   3 | test.describe('Check for 404 errors', () => {
   4 |   test('should load without 404 errors', async ({ page }) => {
   5 |     const consoleErrors = [];
   6 |     const networkErrors = [];
   7 |
   8 |     // Listen for console errors
   9 |     page.on('console', msg => {
  10 |       if (msg.type() === 'error') {
  11 |         consoleErrors.push(msg.text());
  12 |       }
  13 |     });
  14 |
  15 |     // Listen for failed network requests
  16 |     page.on('requestfailed', request => {
  17 |       networkErrors.push({
  18 |         url: request.url(),
  19 |         failure: request.failure()
  20 |       });
  21 |     });
  22 |
  23 |     // Track all network responses
  24 |     const responses = [];
  25 |     page.on('response', response => {
  26 |       if (response.status() >= 400) {
  27 |         responses.push({
  28 |           url: response.url(),
  29 |           status: response.status(),
  30 |           statusText: response.statusText()
  31 |         });
  32 |       }
  33 |     });
  34 |
  35 |     // Navigate to the page
  36 |     await page.goto('/');
  37 |     
  38 |     // Wait for the page to load
  39 |     await page.waitForLoadState('networkidle');
  40 |     
  41 |     // Wait a bit more to catch any delayed requests
  42 |     await page.waitForTimeout(3000);
  43 |
  44 |     // Log all errors for debugging
  45 |     if (consoleErrors.length > 0) {
  46 |       console.log('Console errors:', consoleErrors);
  47 |     }
  48 |     
  49 |     if (networkErrors.length > 0) {
  50 |       console.log('Network errors:', networkErrors);
  51 |     }
  52 |     
  53 |     if (responses.length > 0) {
  54 |       console.log('Failed responses (4xx/5xx):');
  55 |       responses.forEach(resp => {
  56 |         console.log(`  ${resp.status} ${resp.statusText}: ${resp.url}`);
  57 |       });
  58 |     }
  59 |
  60 |     // Check that the main elements are visible
  61 |     await expect(page.getByText('Translation Helps Viewer')).toBeVisible();
  62 |     await expect(page.getByTestId('reference-selector')).toBeVisible();
  63 |     
  64 |     // Assert no 404 errors
  65 |     const notFoundErrors = responses.filter(r => r.status === 404);
  66 |     if (notFoundErrors.length > 0) {
  67 |       console.log('\n404 Not Found errors:');
  68 |       notFoundErrors.forEach(err => {
  69 |         console.log(`  - ${err.url}`);
  70 |       });
  71 |     }
  72 |     
> 73 |     expect(notFoundErrors.length).toBe(0);
     |                                   ^ Error: expect(received).toBe(expected) // Object.is equality
  74 |   });
  75 | });
```