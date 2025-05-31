/**
 * Context coordination utilities for URL handling and context persistence.
 * Based on the original helpers.js updateQueryFromContext and contextFromQuery functions.
 */

/**
 * Updates the browser URL to reflect the current context state.
 * @param {Object} context - The context to serialize to URL
 * @param {string} context.organization - The organization (owner)
 * @param {string} context.languageId - The language ID
 * @param {string} context.resourceId - The resource ID
 * @param {Object} context.reference - The reference object
 */
export function updateQueryFromContext(context) {
  const reference = context.reference || {};
  const _context = { ...context, reference };

  const {
    organization,
    languageId,
    resourceId,
    reference: { bookId, chapter, verse },
  } = _context;

  const _organization = organization ? `owner=${organization}` : "";
  const _languageId = languageId ? `/${languageId}` : "";
  const _resourceId = resourceId ? `/${resourceId}` : "";
  const _bookId = bookId ? `/${bookId}` : "";
  const _chapter = chapter ? `/${chapter}` : "";
  const _verse = verse ? `/${verse}` : "";

  const rc = `&rc=${_languageId}${_resourceId}${_bookId}${_chapter}${_verse}`;
  const path = window.location.pathname;
  const query = `${path}?${_organization}${rc}`;

  window.history.pushState(context, null, query);
}

/**
 * Parses the current URL to extract context information.
 * @returns {Object} The context parsed from URL parameters
 */
export function contextFromQuery() {
  const urlParams = new URLSearchParams(window.location.search);
  const organization = urlParams.get("owner") || "door43-catalog";
  const rc = urlParams.get("rc") || "";
  const rcArray = rc
    .slice(1)
    .split("/")
    .filter((string) => string);
  const [languageId, resourceId, bookId, chapter, verse] = rcArray;

  return {
    organization,
    languageId: languageId || "en",
    resourceId: resourceId,
    reference: {
      bookId,
      chapter,
      verse,
    },
  };
}

/**
 * Saves context to localStorage.
 * @param {string} key - The storage key
 * @param {any} value - The value to save
 */
export function save({ key, value }) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error("Failed to save to localStorage:", error);
    return false;
  }
}

/**
 * Loads context from localStorage.
 * @param {string} key - The storage key
 * @param {any} defaultValue - The default value if key not found
 * @returns {any} The loaded value or default
 */
export function load({ key, defaultValue }) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : defaultValue;
  } catch (error) {
    console.error("Failed to load from localStorage:", error);
    return defaultValue;
  }
}

/**
 * Merges context updates with the current context.
 * Handles special cases like OBS resourceId.
 * @param {Object} currentContext - The current context
 * @param {Object} updates - The updates to apply
 * @returns {Object} The merged context
 */
export function mergeContext(currentContext, updates) {
  let mergedContext = { ...currentContext, ...updates };

  // Special case: use 'obs' for bookId if resourceId is 'obs'
  if (updates.resourceId === "obs") {
    const reference = { ...mergedContext.reference, bookId: "obs" };
    mergedContext = { ...mergedContext, reference };
  }

  return mergedContext;
}

/**
 * Gets the default context structure.
 * @returns {Object} The default context
 */
export function getDefaultContext() {
  return {
    organization: "door43-catalog",
    languageId: "en",
    resourceId: null,
    reference: {
      bookId: null,
      chapter: null,
      verse: null,
    },
  };
}
