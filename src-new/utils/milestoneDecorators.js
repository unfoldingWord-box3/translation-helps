/**
 * milestoneDecorators.js
 * Mode-aware decorators for USFM milestone markers.
 * Merges simple-text-editor-rcl's default decorators with custom overrides.
 */

import { UsfmEditor } from "simple-text-editor-rcl";

/**
 * Creates mode-aware decorators for USFM milestone markers by merging
 * simple-text-editor-rcl's built-in decorator set with our custom overrides.
 *
 * @param {boolean} previewMode - If true, shows clean readable text; if false, shows all markup.
 * @returns {object} Decorator configuration for UsfmEditor.
 */
export const createMilestoneDecorators = (previewMode = true) => {
  const baseDecorators = (UsfmEditor.defaultProps && UsfmEditor.defaultProps.decorators) || {};

  if (previewMode) {
    return {
      // Preserve all built-in decorators, then override specific milestone patterns
      ...baseDecorators,

      // Remove alignment markers completely, keeping just the word
      alignmentMarkers: [/\\zaln-s\s*\|[^\\]*\\\*\\w\s+([^|\\]+)\|[^\\]*\\w\*\\zaln-e\\\*/g, "$1"],

      // Remove standalone word markers, keeping just the word
      wordMarkers: [/\\w\s+([^|\\]+)\|[^\\]*\\w\*/g, "$1"],

      // Remove any escaping cleanup for zaln start/end not handled above
      zalnCleanup: [/\\zaln-[se][^\\]*\\\*/g, ""],

      // Strip footnotes entirely
      footnotes: [/\\f\s+[^\\]+[\s\S]*?\\f\*/g, ""],

      // Strip endnotes entirely
      endnotes: [/\\fe\s+[^\\]+[\s\S]*?\\fe\*/g, ""],

      // Strip cross-references entirely
      crossReferences: [/\\x\s+[^\\]+[\s\S]*?\\x\*/g, ""],

      // Remove all non-verse/chapter markers for clean reading
      allMarkers: [/\\([^vc]\w*\d*)(\s+[^\\]*)?\s*/g, ""],

      // Clean verse markers to just show the verse number
      verseMarkers: [/\\v\s+(\d+)\s*/g, "$1 "],

      // Format chapter markers as readable headings
      chapterMarkers: [/\\c\s+(\d+)\s*/g, "\n\nChapter $1\n\n"],

      // Final cleanup of stray backslashes
      backslashCleanup: [/\\/g, ""],

      // Collapse multiple spaces to single space
      spaceCleanup: [/\s{2,}/g, " "],

      // Collapse multiple newlines to two newlines
      newlineCleanup: [/\n{3,}/g, "\n\n"],

      // Trim whitespace at line starts/ends
      trimLines: [/^\s+|\s+$/gm, ""],
    };
  } else {
    return {
      // Preserve all built-in decorators, then add our enhanced markers
      ...baseDecorators,

      // Highlight alignment markers with CSS span
      alignmentMarkers: [
        /\\zaln-s\s*\|([^\\]*)\\\*\\w\s+([^|\\]+)\|([^\\]*)\\w\*\\zaln-e\\\*/g,
        '<span class="milestone-alignment" title="Alignment marker">\\zaln-s |$1\\*\\w $2|$3\\w*\\zaln-e\\*</span>',
      ],

      // Highlight word markers with CSS span
      wordMarkers: [
        /\\w\s+([^|\\]+)\|([^\\]*)\\w\*/g,
        '<span class="milestone-word" title="Word marker">\\w $1|$2\\w*</span>',
      ],

      // Highlight cross-references with CSS span
      crossReferences: [
        /(\\x\s+[^\\]+[\s\S]*?\\x\*)/g,
        '<span class="milestone-crossref" title="Cross-reference marker">$1</span>',
      ],
    };
  }
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
