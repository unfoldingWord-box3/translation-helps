import { Proskomma } from "proskomma";

/**
 * CustomProskomma - A wrapper class for Proskomma with unfoldingWord conventions
 * Ported from uw-proskomma package to provide:
 * - Organization-based selectors
 * - USFM preprocessing (converts \s5 to \ts*)
 * - Custom selector string formatting
 */
export class CustomProskomma extends Proskomma {
  constructor() {
    super();

    // Define selectors with organization support
    this.selectors = [
      {
        name: "org",
        type: "string",
        regex: "^[^\\s]+$",
      },
      {
        name: "lang",
        type: "string",
        regex: "^[^\\s]+$",
      },
      {
        name: "abbr",
        type: "string",
        regex: "^[A-za-z0-9_-]+$",
      },
    ];

    this.validateSelectors();

    // Initialize filters and custom tags (from uw-proskomma)
    this.filters = {};
    this.customTags = {
      heading: [],
      paragraph: [],
      char: [],
      word: [],
      intro: [],
      introHeading: [],
    };
    this.emptyBlocks = [];
  }

  /**
   * Returns a processor string for identification
   */
  processor() {
    return "Proskomma JS for Translation Helps (based on UW-Proskomma)";
  }

  /**
   * Generate selector string in unfoldingWord format
   * @param {Object} docSetSelectors - Object with org, lang, and abbr properties
   * @returns {string} - Formatted as "org/lang_abbr"
   */
  selectorString(docSetSelectors) {
    return `${docSetSelectors.org}/${docSetSelectors.lang}_${docSetSelectors.abbr}`;
  }

  /**
   * Import documents with USFM preprocessing
   * Converts \s5 tags to \ts\* for compatibility
   */
  importDocuments(
    selectors,
    contentType,
    contentStrings,
    filterOptions,
    customTags,
    emptyBlocks,
    tags
  ) {
    // Preprocess USFM content:
    // 1. Convert \s5 to \ts\*
    // 2. Normalize \id line to only include book code (e.g., "\id TIT")
    if (contentType === "usfm") {
      contentStrings = contentStrings.map((cs) => {
        // Convert \s5 to \ts\*
        let processed = cs.replace(/\\s5/g, "\\ts\\*");
        // Normalize \id line: keep only "\id XXX"
        processed = processed.replace(/^\\id\s+([A-Z0-9]{3})[^\r\n]*/m, "\\id $1");
        return processed;
      });
    }

    return super.importDocuments(
      selectors,
      contentType,
      contentStrings,
      filterOptions || this.filters,
      customTags || this.customTags,
      emptyBlocks || this.emptyBlocks,
      tags
    );
  }

  /**
   * Import a single document (convenience method)
   */
  importDocument(
    selectors,
    contentType,
    contentString,
    filterOptions,
    customTags,
    emptyBlocks,
    tags
  ) {
    return this.importDocuments(
      selectors,
      contentType,
      [contentString],
      filterOptions,
      customTags,
      emptyBlocks,
      tags
    );
  }
}

export default CustomProskomma;
