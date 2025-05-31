/**
 * Workflow helpers for navigation and progressive disclosure logic.
 * These utilities help coordinate the navigation flow between different app states.
 */

import {
  validateContext,
  shouldShowResources,
  shouldShowBooks,
  shouldShowChapters,
  shouldShowScripture,
} from "./contextValidation";

/**
 * Determines the current navigation step based on context.
 * @param {Object} context - The current context
 * @returns {string} The current step: 'resources', 'books', 'chapters', or 'scripture'
 */
export function getCurrentStep(context) {
  if (shouldShowResources(context)) return "resources";
  if (shouldShowBooks(context)) return "books";
  if (shouldShowChapters(context)) return "chapters";
  if (shouldShowScripture(context)) return "scripture";
  return "resources"; // fallback
}

/**
 * Gets the next step in the navigation workflow.
 * @param {string} currentStep - The current step
 * @returns {string|null} The next step, or null if at the end
 */
export function getNextStep(currentStep) {
  const steps = ["resources", "books", "chapters", "scripture"];
  const currentIndex = steps.indexOf(currentStep);
  return currentIndex >= 0 && currentIndex < steps.length - 1 ? steps[currentIndex + 1] : null;
}

/**
 * Gets the previous step in the navigation workflow.
 * @param {string} currentStep - The current step
 * @returns {string|null} The previous step, or null if at the beginning
 */
export function getPreviousStep(currentStep) {
  const steps = ["resources", "books", "chapters", "scripture"];
  const currentIndex = steps.indexOf(currentStep);
  return currentIndex > 0 ? steps[currentIndex - 1] : null;
}

/**
 * Determines if navigation to a specific step is allowed from current context.
 * @param {Object} context - The current context
 * @param {string} targetStep - The step to navigate to
 * @returns {boolean} True if navigation is allowed
 */
export function canNavigateTo(context, targetStep) {
  const currentStep = getCurrentStep(context);
  const steps = ["resources", "books", "chapters", "scripture"];
  const currentIndex = steps.indexOf(currentStep);
  const targetIndex = steps.indexOf(targetStep);

  // Can always go backwards
  if (targetIndex <= currentIndex) return true;

  // Can only go forward if current context allows it
  switch (targetStep) {
    case "books":
      return !!context.resourceId;
    case "chapters":
      return !!context.resourceId && !!context.reference?.bookId;
    case "scripture":
      return !!context.resourceId && !!context.reference?.bookId && !!context.reference?.chapter;
    default:
      return true;
  }
}

/**
 * Creates context updates to navigate to a specific step.
 * @param {Object} currentContext - The current context
 * @param {string} targetStep - The step to navigate to
 * @returns {Object} Context updates needed for navigation
 */
export function getNavigationUpdates(currentContext, targetStep) {
  const updates = {};

  switch (targetStep) {
    case "resources":
      // Clear everything to show resource selection
      updates.resourceId = null;
      updates.reference = {
        bookId: null,
        chapter: null,
        verse: null,
      };
      break;

    case "books":
      // Keep resourceId, clear reference to show book selection
      if (!currentContext.resourceId) {
        // Need to select a resource first
        return null;
      }
      updates.reference = {
        bookId: null,
        chapter: null,
        verse: null,
      };
      break;

    case "chapters":
      // Keep resourceId and bookId, clear chapter/verse to show chapter selection
      if (!currentContext.resourceId || !currentContext.reference?.bookId) {
        return null;
      }
      updates.reference = {
        ...currentContext.reference,
        chapter: null,
        verse: null,
      };
      break;

    case "scripture":
      // Need all context to show scripture - this is handled by component state
      if (
        !currentContext.resourceId ||
        !currentContext.reference?.bookId ||
        !currentContext.reference?.chapter
      ) {
        return null;
      }
      // No updates needed - context is already sufficient
      break;

    default:
      return null;
  }

  return updates;
}

/**
 * Validates if a context transition is valid.
 * @param {Object} fromContext - The current context
 * @param {Object} toContext - The target context
 * @returns {boolean} True if transition is valid
 */
export function isValidTransition(fromContext, toContext) {
  // Both contexts must be individually valid
  if (!validateContext(fromContext) || !validateContext(toContext)) {
    return false;
  }

  const fromStep = getCurrentStep(fromContext);
  const toStep = getCurrentStep(toContext);

  // Allow navigation to any previous step
  if (canNavigateTo(fromContext, toStep)) {
    return true;
  }

  // For forward navigation, ensure we're not skipping required steps
  const steps = ["resources", "books", "chapters", "scripture"];
  const fromIndex = steps.indexOf(fromStep);
  const toIndex = steps.indexOf(toStep);

  // Can only move forward one step at a time
  return toIndex <= fromIndex + 1;
}

/**
 * Gets breadcrumb navigation items based on current context.
 * @param {Object} context - The current context
 * @returns {Array} Array of breadcrumb objects with name, step, and active status
 */
export function getBreadcrumbs(context) {
  const currentStep = getCurrentStep(context);
  const breadcrumbs = [];

  // Resources step
  breadcrumbs.push({
    name: "Resources",
    step: "resources",
    active: currentStep === "resources",
    enabled: true,
  });

  // Books step (if resource selected)
  if (context.resourceId) {
    breadcrumbs.push({
      name: context.resourceId.toUpperCase(),
      step: "books",
      active: currentStep === "books",
      enabled: true,
    });
  }

  // Chapters step (if book selected)
  if (context.resourceId && context.reference?.bookId) {
    breadcrumbs.push({
      name: context.reference.bookId.toUpperCase(),
      step: "chapters",
      active: currentStep === "chapters",
      enabled: true,
    });
  }

  // Scripture step (if chapter selected)
  if (context.resourceId && context.reference?.bookId && context.reference?.chapter) {
    breadcrumbs.push({
      name: `Chapter ${context.reference.chapter}`,
      step: "scripture",
      active: currentStep === "scripture",
      enabled: true,
    });
  }

  return breadcrumbs;
}
