/**
 * milestoneDecorators.js
 * Granular decorators for USFM milestone markers that separate markers, content, and attributes.
 *
 * CRITICAL: This implementation solves the alignment rendering problem where content gets hidden
 * by the library's CSS rule `.usfm .preview .marker, .usfm .preview .attributes { display: none; }`
 *
 * IMPORTANT: ALL TEXT CONTENT from the original USFM must be preserved in the output HTML.
 * The decorators only wrap content with spans and classes - they never remove or replace text.
 * Both preview and non-preview modes generate IDENTICAL HTML structure.
 * Only CSS controls visibility differences between modes.
 *
 * See docs/usfm-alignment-rendering-solution.md for detailed explanation.
 */

/**
 * Creates granular decorators that separate USFM structures into distinct parts:
 * - marker: USFM markers (hidden in preview mode by CSS)
 * - content: actual text that needs to be displayed (always visible)
 * - attributes: metadata (hidden in preview mode by CSS)
 *
 * CRITICAL: This function always returns the SAME decorators regardless of mode.
 * CSS handles the visibility differences, not different HTML structures.
 *
 * @param {boolean} previewMode - Ignored. Kept for API compatibility.
 * @returns {object} Decorator configuration for UsfmEditor.
 */
export const createMilestoneDecorators = (previewMode = true) => {
  // CRITICAL: Same HTML structure for both preview and non-preview modes
  // CSS controls visibility via .usfm .preview .marker { display: none; }
  return {
    // Step 1: Process alignment start markers - separate marker, attributes, closing marker
    alignmentStart: [
      /(\\zaln-s)\s+(\|[^\\]*)(\\?\*)/g,
      '<span class="milestone"><span class="marker">$1 </span><span class="attributes">$2</span><span class="marker">$3</span>',
    ],

    // Step 2: Process word markers - separate marker, content, attributes, closing marker
    wordMarker: [
      /(\\w)\s+([^|\\]+)(\|[^\\]*)(\\w\*)/g,
      '<span class="word"><span class="marker">$1 </span><span class="content">$2</span><span class="attributes">$3</span><span class="marker">$4</span></span>',
    ],

    // Step 3: Process alignment end markers
    alignmentEnd: [/(\\zaln-e)(\\?\*)/g, '<span class="marker">$1$2</span></span>'],

    // Header processing - wrap markers and content separately
    bookTitle: [
      /(\\h)\s+(.+?)(?=\\|$)/g,
      '<span class="header"><span class="marker">$1 </span><span class="content"><h1 class="book-title">$2</h1></span></span>',
    ],

    majorTitle: [
      /(\\mt\d?)\s+(.+?)(?=\\|$)/g,
      '<span class="header"><span class="marker">$1 </span><span class="content"><h2 class="major-title">$2</h2></span></span>',
    ],

    // Section headings
    sectionHeading: [
      /(\\s\d?)\s+(.+?)(?=\\|$)/g,
      '<span class="section"><span class="marker">$1 </span><span class="content"><h3 class="section-heading">$2</h3></span></span>',
    ],

    // Chapter markers
    chapterMarker: [
      /(\\c)\s+(\d+)(?=\\|$)/g,
      '<span class="chapter"><span class="marker">$1 </span><span class="content"><h2 class="chapter-heading">Chapter $2</h2></span></span>',
    ],

    // Verse markers - separate marker from content
    verseMarker: [
      /(\\v)\s+(\d+)(?=\s|\\|$)/g,
      '<span class="verse-marker"><span class="marker">$1 </span><span class="content verse-number" data-verse="$2">$2</span></span> ',
    ],

    // Paragraph markers
    paragraphMarker: [
      /(\\p)(?=\s|\\|$)/g,
      '<span class="paragraph-marker"><span class="marker">$1</span></span>',
    ],

    // Poetry markers
    poetryMarker1: [
      /(\\q1?)(?=\s|\\|$)/g,
      '<span class="poetry-marker"><span class="marker">$1</span></span><div class="poetry-1">',
    ],
    poetryMarker2: [
      /(\\q2)(?=\s|\\|$)/g,
      '<span class="poetry-marker"><span class="marker">$1</span></span><div class="poetry-2">',
    ],
    poetryMarker3: [
      /(\\q3)(?=\s|\\|$)/g,
      '<span class="poetry-marker"><span class="marker">$1</span></span><div class="poetry-3">',
    ],

    // Footnotes - separate marker, content, attributes
    footnoteMarker: [
      /(\\f)\s+(.+?)(\\f\*)/g,
      '<span class="footnote"><span class="marker">$1 </span><span class="content"><sup class="footnote-ref">[note]</sup></span><span class="marker">$3</span></span>',
    ],

    // Endnotes - separate marker, content, attributes
    endnoteMarker: [
      /(\\fe)\s+(.+?)(\\fe\*)/g,
      '<span class="endnote"><span class="marker">$1 </span><span class="content"><sup class="endnote-ref">[end]</sup></span><span class="marker">$3</span></span>',
    ],

    // Cross-references - wrap with appropriate classes
    crossReferences: [
      /(\\x)\s+([^\\]+)(\\x\*)/g,
      '<span class="crossref"><span class="marker">$1 </span><span class="content">$2</span><span class="marker">$3</span></span>',
    ],

    // Final cleanup - collapse extra whitespace but preserve structure
    spaceCleanup: [/\s{2,}/g, " "],
    lineCleanup: [/\n{3,}/g, "\n\n"],
  };
};

/**
 * Parses alignment attributes string into a data object.
 *
 * @param {string} alignAttributes - The attribute string from zaln-s marker.
 * @returns {object} Parsed linguistic data.
 */
export const parseAlignmentData = (alignAttributes) => {
  const data = {
    strong: null,
    lemma: null,
    morph: null,
    occurrence: null,
    occurrences: null,
    content: null,
  };
  if (!alignAttributes) return data;

  const mStrong = alignAttributes.match(/x-strong="([^"]+)"/);
  if (mStrong) data.strong = mStrong[1];

  const mLemma = alignAttributes.match(/x-lemma="([^"]+)"/);
  if (mLemma) data.lemma = mLemma[1];

  const mMorph = alignAttributes.match(/x-morph="([^"]+)"/);
  if (mMorph) data.morph = mMorph[1];

  const mOcc = alignAttributes.match(/x-occurrence="([^"]+)"/);
  if (mOcc) data.occurrence = mOcc[1];

  const mOccs = alignAttributes.match(/x-occurrences="([^"]+)"/);
  if (mOccs) data.occurrences = mOccs[1];

  const mContent = alignAttributes.match(/x-content="([^"]+)"/);
  if (mContent) data.content = mContent[1];

  return data;
};

/**
 * Default export for backward compatibility (preview mode).
 */
const defaultExport = createMilestoneDecorators(true);
export default defaultExport;
