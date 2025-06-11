/**
 * ReferenceContext.jsx
 * Context to track current organization, language, resource, and book/chapter/verse reference.
 */

import React, { createContext, useState, useEffect } from "react";
import { DEFAULT_REFERENCE } from "../utils/defaultReference";
import { updateQueryFromContext, contextFromQuery } from "../utils/contextHelpers";

export const ReferenceContext = createContext({
  organization: "unfoldingWord",
  languageId: "en",
  resourceId: "en_ult",
  reference: DEFAULT_REFERENCE,
  setOrganization: () => {},
  setLanguageId: () => {},
  setResourceId: () => {},
  setReference: () => {},
  updateReference: () => {},
  updateContext: () => {},
});

/**
 * Provider for ReferenceContext.
 * @param {{children: React.ReactNode}} props
 */
export function ReferenceProvider({ children }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [organization, setOrganization] = useState(null);
  const [languageId, setLanguageId] = useState(null);
  const [resourceId, setResourceId] = useState(null);
  const [reference, setReference] = useState(DEFAULT_REFERENCE);

  // Initialize context from URL on mount - URL is source of truth
  useEffect(() => {
    try {
      const urlContext = contextFromQuery();

      if (urlContext && urlContext.hasUrlParams) {
        // Case 2: URI parameters exist - use them exactly, NO defaults
        if (urlContext.organization) setOrganization(urlContext.organization);
        if (urlContext.languageId) setLanguageId(urlContext.languageId);
        if (urlContext.resourceId) setResourceId(urlContext.resourceId);
        if (urlContext.reference && urlContext.reference.bookId) {
          setReference(urlContext.reference);
        }
      } else {
        // Case 1: Fresh open with no URI parameters - use defaults ONLY
        setOrganization("unfoldingWord");
        setLanguageId("en");
        setResourceId("en_ult");
        setReference(DEFAULT_REFERENCE);
      }

      setIsInitialized(true);
    } catch (e) {
      console.error("Failed to parse URL context:", e);
      setIsInitialized(true);
    }
  }, []);

  // Update URL only after initialization and when context changes due to user action
  useEffect(() => {
    if (!isInitialized) return; // Don't update URL during initialization

    const context = {
      organization,
      languageId,
      resourceId,
      reference,
    };

    try {
      updateQueryFromContext(context);
    } catch (e) {
      console.error("Failed to update URL from context:", e);
    }
  }, [isInitialized, organization, languageId, resourceId, reference]);

  // Helper function to update specific parts of reference
  const updateReference = (updates) => {
    setReference((prev) => ({ ...prev, ...updates }));
  };

  // Helper function to update entire context with cascading reset logic
  const updateContext = (updates) => {
    // Handle cascading resets when higher-level items change
    if (updates.organization !== undefined && updates.organization !== organization) {
      // Organization changed - reset everything below (no defaults!)
      setOrganization(updates.organization);
      setLanguageId(updates.languageId || null); // Clear language unless explicitly provided
      setResourceId(null);
      setReference(DEFAULT_REFERENCE);
    } else if (updates.languageId !== undefined && updates.languageId !== languageId) {
      // Language changed - reset resource and reference
      setLanguageId(updates.languageId);
      setResourceId(null);
      setReference(DEFAULT_REFERENCE);
    } else if (updates.resourceId !== undefined && updates.resourceId !== resourceId) {
      // Resource changed - reset reference
      setResourceId(updates.resourceId);
      setReference(DEFAULT_REFERENCE);
    } else if (updates.reference) {
      // Only reference updated
      updateReference(updates.reference);
    }

    // Apply any other updates that don't trigger cascading
    if (
      updates.organization === organization &&
      updates.languageId === languageId &&
      updates.resourceId === resourceId
    ) {
      if (updates.reference) {
        updateReference(updates.reference);
      }
    }
  };

  return (
    <ReferenceContext.Provider
      value={{
        organization,
        languageId,
        resourceId,
        reference,
        setOrganization,
        setLanguageId,
        setResourceId,
        setReference,
        updateReference,
        updateContext,
      }}
    >
      {children}
    </ReferenceContext.Provider>
  );
}
