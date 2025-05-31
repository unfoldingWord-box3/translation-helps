/**
 * Context validation utilities for the coordination layer.
 * Based on the original validateContext logic from src/helpers.js
 */

/**
 * Validates if a context state is valid for navigation.
 * @param {Object} context - The context to validate
 * @param {string} context.resourceId - The resource ID
 * @param {Object} context.reference - The reference object
 * @param {string} context.reference.bookId - The book ID
 * @param {string} context.reference.chapter - The chapter
 * @param {string} context.reference.verse - The verse
 * @returns {boolean} True if context is valid
 */
export function validateContext(context) {
  const { resourceId, reference } = context;

  // Valid if neither resourceId nor reference is set (showing resource selection)
  if (!resourceId && !reference) {
    return true;
  }

  // Valid if only resourceId is set (showing book selection)
  if (resourceId && !reference) {
    return true;
  }

  // If both are set, validate the reference structure
  if (resourceId && reference) {
    const validReference = validateReference({ reference });
    return resourceId && validReference;
  }

  return false;
}

/**
 * Validates a reference object structure.
 * @param {Object} params
 * @param {Object} params.reference - The reference to validate
 * @returns {boolean} True if reference is valid
 */
export function validateReference({ reference }) {
  if (!reference) return false;

  const { bookId, chapter, verse } = reference;

  // Must have at least bookId
  if (!bookId) return false;

  // If chapter is set, it must be valid
  if (chapter) {
    const chapterNum = parseInt(chapter, 10);
    if (isNaN(chapterNum) || chapterNum < 1) return false;
  }

  // If verse is set, it must be valid and chapter must also be set
  if (verse) {
    if (!chapter) return false;
    const verseNum = parseInt(verse, 10);
    if (isNaN(verseNum) || verseNum < 1) return false;
  }

  return true;
}

/**
 * Determines if context should show resource selection.
 * @param {Object} context - The context to check
 * @returns {boolean} True if should show resources
 */
export function shouldShowResources(context) {
  return !context.resourceId;
}

/**
 * Determines if context should show book selection.
 * @param {Object} context - The context to check
 * @returns {boolean} True if should show books
 */
export function shouldShowBooks(context) {
  return !!(context.resourceId && !context.reference?.bookId);
}

/**
 * Determines if context should show chapter selection.
 * @param {Object} context - The context to check
 * @returns {boolean} True if should show chapters
 */
export function shouldShowChapters(context) {
  return !!(context.reference?.bookId && !context.reference?.chapter);
}

/**
 * Determines if context should show scripture/verse content.
 * @param {Object} context - The context to check
 * @returns {boolean} True if should show scripture
 */
export function shouldShowScripture(context) {
  return !!(context.reference?.bookId && context.reference?.chapter);
}
