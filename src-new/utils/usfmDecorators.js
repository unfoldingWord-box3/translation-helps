/**
 * usfmDecorators.js
 *
 * Exports a function to create USFM decorators that transform all USFM markers
 * into semantic HTML tags for consistent rendering.
 *
 * Decorator order is CRITICAL: decorators must be sorted from smallest scope (most deeply nested)
 * to largest scope (most encompassing), i.e., "inside out". This ensures correct nesting and
 * prevents decorators from interfering with each other.
 *
 * The order below is chosen to:
 * 1. Apply attribute decorators first, so that attributes are always nested inside the correct tag.
 * 2. Apply word-level decorators (w) before alignment (zaln), so words are always inside alignments.
 * 3. Apply alignment decorators before footnotes/endnotes, so notes can wrap aligned content if needed.
 * 4. Apply verse, paragraph, section, and chapter decorators after all inline/word-level decorators, so they wrap the full content.
 * 5. Book/major/TOC/title decorators are last, as they are the most encompassing.
 *
 * This implementation follows the documentation in docs/simple-text-editor-rcl-integration.md,
 * docs/usfm-decorators.md, and produces the exact HTML structure required by docs/verse-1-test-case.md.
 */

export const createUsfmDecorators = () => {
  return {
    // 1. Attributes (generic) - match the full attribute string after the marker (e.g., |x-strong="..." x-lemma="..." ...)
    // attributes: [/\|([^\*\\]+)/g, "<attributes>|$1</attributes>"],
    // 2. Word decorator: most granular, applied first
    w: [
      /\\w\s([^|]+)\|([^\\]+)\\w\*/g,
      '<word><marker class="w">\\w </marker><content>$1</content><attributes>|$2</attributes><marker class="w*">\\w*</marker></word>',
    ],
    // 3. Alignment decorator: wraps words, applied second (with optional nesting)
    zaln: [
      /\\zaln-s\s([^\*]+)\\\*([\s\S]*?(?:\\zaln-s\s[^\*]+\\\*[\s\S]*?\\zaln-e\\\*)*?)\\zaln-e\\\*/g,
      '<zaln><marker class="zaln-s">\\zaln-s </marker><attributes>$1</attributes><marker class="*">\\*</marker>$2<marker class="zaln-e">\\zaln-e</marker><marker class="*">\\*</marker></zaln>',
    ],
    // 4. Footnotes (\f ... \f*)
    f: [/\\f\s+([^\\]+)\\f\*/g, "<footnote>$1</footnote>"],
    // 5. Endnotes (\fe ... \fe*)
    fe: [/\\fe\s+([^\\]+)\\fe\*/g, "<endnote>$1</endnote>"],
    // 6. Verse decorator: wraps alignment and words, applied last
    v: [/\\v\s+(\d+)/g, "<v><marker>\\v </marker><number>$1</number>"],
    // 7. Paragraph marker (\p)
    p: [/\\p/g, "<p><marker>\\p</marker></p>"],
    // 8. Section headings (\s, \s1, \s2)
    s: [
      /\\s\d?\s+([^\n]+)/g,
      '<header class="s"><marker class="marker s">\\s </marker>$1</header>',
    ],
    // 9. Chapter marker (\c)
    c: [/\\c\s+(\d+)/g, "<c><marker>\\c </marker><number>$1</number></c>"],

    // Book title (\h)
    h: [/\\h\s+([^\n]+)/g, '<header class="h"><marker class="marker h">\\h </marker>$1</header>'],
    // Major title (\mt, \mt1, \mt2)
    mt: [
      /\\mt\d?\s+([^\n]+)/g,
      '<header class="mt"><marker class="marker mt">\\mt </marker>$1</header>',
    ],
    // TOC markers (\toc1, \toc2, \toc3)
    toc1: [
      /\\toc1\s+([^\n]+)/g,
      '<header class="toc1"><marker class="marker toc1">\\toc1 </marker>$1</header>',
    ],
    toc2: [
      /\\toc2\s+([^\n]+)/g,
      '<header class="toc2"><marker class="marker toc2">\\toc2 </marker>$1</header>',
    ],
    toc3: [
      /\\toc3\s+([^\n]+)/g,
      '<header class="toc3"><marker class="marker toc3">\\toc3 </marker>$1</header>',
    ],
  };
};
