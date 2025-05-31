/**
 * useAppState - Context Coordination Layer
 *
 * This hook coordinates between the separated contexts (ReferenceContext, ManifestsContext, ResourcesContext)
 * and provides intelligent navigation, validation, and workflow logic from the original app.
 *
 * It preserves the architectural benefits of separated contexts while enabling original UX behaviors.
 */

import { useContext, useState, useEffect, useCallback, useMemo } from "react";
import { ReferenceContext } from "../context/ReferenceContext";
import { ManifestsContext } from "../context/ManifestsContext";
import { ResourcesContext } from "../context/ResourcesContext";

import {
  validateContext,
  shouldShowResources,
  shouldShowBooks,
  shouldShowChapters,
  shouldShowScripture,
} from "../utils/contextValidation";

import {
  updateQueryFromContext,
  contextFromQuery,
  save,
  load,
  mergeContext,
  getDefaultContext,
} from "../utils/contextHelpers";

import {
  getCurrentStep,
  getNextStep,
  getPreviousStep,
  canNavigateTo,
  getNavigationUpdates,
  isValidTransition,
  getBreadcrumbs,
} from "../utils/workflowHelpers";

/**
 * Main coordination hook that provides unified context management.
 * @returns {Object} Coordinated app state and methods
 */
export function useAppState() {
  // Access existing separated contexts
  const { reference, setReference, updateReference } = useContext(ReferenceContext);
  const { manifests } = useContext(ManifestsContext);
  const { resources, loadResource, isLoading } = useContext(ResourcesContext);

  // Additional coordination state
  const [resourceId, setResourceId] = useState(null);
  const [organization] = useState("door43-catalog");
  const [languageId] = useState("en");

  // Initialize from URL on mount
  useEffect(() => {
    const queryContext = contextFromQuery();
    if (queryContext.resourceId) {
      setResourceId(queryContext.resourceId);
    }
    if (
      queryContext.reference &&
      (queryContext.reference.bookId ||
        queryContext.reference.chapter ||
        queryContext.reference.verse)
    ) {
      setReference(queryContext.reference);
    }
  }, [setReference]);

  // Create unified context object (memoized to prevent infinite re-renders)
  const context = useMemo(
    () => ({
      organization,
      languageId,
      resourceId,
      reference,
    }),
    [organization, languageId, resourceId, reference]
  );

  // Save context to localStorage when it changes
  useEffect(() => {
    if (context.resourceId || (context.reference && context.reference.bookId)) {
      save({ key: "appContext", value: context });
    }
  }, [context]);

  // Update URL when context changes
  useEffect(() => {
    updateQueryFromContext(context);
    // Scroll to top on context changes (original behavior)
    window.scrollTo(0, 0);
  }, [context]);

  /**
   * Main context update function with validation and coordination logic.
   * Based on the original updateContext function from src/Context.context.js
   */
  const updateContext = useCallback(
    async (_context) => {
      // Allow navigation to Resources selection
      const emptyResourceId = !_context.reference || !_context.resourceId;
      let shouldSetContext = false;

      if (emptyResourceId) {
        shouldSetContext = true;
      }

      // Merge with current context
      const mergedContext = mergeContext(context, _context);

      // Validate the proposed context
      const validContext = validateContext(mergedContext);

      if (validContext) {
        shouldSetContext = true;
      }

      if (shouldSetContext) {
        // Update resourceId if provided
        if (_context.resourceId !== undefined) {
          setResourceId(_context.resourceId);
        }

        // Update reference if provided
        if (_context.reference) {
          setReference(_context.reference);
        }
      }
    },
    [context, setReference]
  );

  /**
   * Simplified update methods for common operations
   */
  const setResourceIdAndClear = useCallback(
    (newResourceId) => {
      setResourceId(newResourceId);
      setReference({
        bookId: null,
        chapter: null,
        verse: null,
      });
    },
    [setReference]
  );

  const setBookIdAndClear = useCallback(
    (bookId) => {
      setReference({
        bookId,
        chapter: null,
        verse: null,
      });
    },
    [setReference]
  );

  const setChapterAndClear = useCallback(
    (chapter) => {
      setReference({
        ...reference,
        chapter,
        verse: null,
      });
    },
    [setReference, reference]
  );

  const setVerse = useCallback(
    (verse) => {
      setReference({
        ...reference,
        verse,
      });
    },
    [setReference, reference]
  );

  /**
   * Navigation workflow methods
   */
  const navigateToStep = useCallback(
    (step) => {
      const updates = getNavigationUpdates(context, step);
      if (updates) {
        updateContext(updates);
      }
    },
    [context, updateContext]
  );

  const navigateBack = useCallback(() => {
    const currentStep = getCurrentStep(context);
    const previousStep = getPreviousStep(currentStep);
    if (previousStep) {
      navigateToStep(previousStep);
    }
  }, [context, navigateToStep]);

  const navigateForward = useCallback(() => {
    const currentStep = getCurrentStep(context);
    const nextStep = getNextStep(currentStep);
    if (nextStep && canNavigateTo(context, nextStep)) {
      navigateToStep(nextStep);
    }
  }, [context, navigateToStep]);

  /**
   * Clear all context (reset to initial state)
   */
  const clearContext = useCallback(() => {
    setResourceId(null);
    setReference({
      bookId: null,
      chapter: null,
      verse: null,
    });
  }, [setReference]);

  return {
    // Main context object (similar to original)
    context,

    // Individual context pieces for backward compatibility
    organization,
    languageId,
    resourceId,
    reference,
    manifests,
    resources,
    isLoading,

    // Update methods
    updateContext,
    setResourceIdAndClear,
    setBookIdAndClear,
    setChapterAndClear,
    setVerse,
    clearContext,

    // Validation methods
    validateContext: (ctx) => validateContext(ctx),

    // Navigation workflow methods
    getCurrentStep: () => getCurrentStep(context),
    canNavigateTo: (step) => canNavigateTo(context, step),
    navigateToStep,
    navigateBack,
    navigateForward,
    getBreadcrumbs: () => getBreadcrumbs(context),

    // State check methods (for conditional rendering)
    shouldShowResources: () => shouldShowResources(context),
    shouldShowBooks: () => shouldShowBooks(context),
    shouldShowChapters: () => shouldShowChapters(context),
    shouldShowScripture: () => shouldShowScripture(context),

    // Resource loading
    loadResource,

    // Default context for reference
    defaultContext: getDefaultContext(),
  };
}
