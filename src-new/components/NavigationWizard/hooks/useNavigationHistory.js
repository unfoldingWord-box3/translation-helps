/**
 * useNavigationHistory.js
 * Hook for managing navigation history and recent selections
 */

import { useState, useEffect, useCallback } from "react";

const HISTORY_KEY = "translationHelps_navigationHistory";
const MAX_HISTORY_ITEMS = 10;

export function useNavigationHistory() {
  const [recentSelections, setRecentSelections] = useState([]);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(HISTORY_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setRecentSelections(Array.isArray(parsed) ? parsed : []);
      }
    } catch (error) {
      console.warn("Failed to load navigation history:", error);
      setRecentSelections([]);
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(recentSelections));
    } catch (error) {
      console.warn("Failed to save navigation history:", error);
    }
  }, [recentSelections]);

  const saveSelection = useCallback((selection) => {
    if (!selection || !selection.organization || !selection.languageId || !selection.resourceId) {
      return; // Don't save incomplete selections
    }

    setRecentSelections((prev) => {
      // Remove any existing identical selection
      const filtered = prev.filter(
        (item) =>
          !(
            item.organization === selection.organization &&
            item.languageId === selection.languageId &&
            item.resourceId === selection.resourceId &&
            item.bookId === selection.bookId &&
            item.chapter === selection.chapter &&
            item.verse === selection.verse
          )
      );

      // Add new selection at the beginning
      const updated = [selection, ...filtered];

      // Keep only the most recent items
      return updated.slice(0, MAX_HISTORY_ITEMS);
    });
  }, []);

  const clearHistory = useCallback(() => {
    setRecentSelections([]);
  }, []);

  const getRecentBooks = useCallback(() => {
    const books = recentSelections
      .filter((item) => item.bookId)
      .map((item) => ({
        id: item.bookId,
        organization: item.organization,
        languageId: item.languageId,
        resourceId: item.resourceId,
        timestamp: item.timestamp,
      }));

    // Remove duplicates by bookId
    const uniqueBooks = books.filter(
      (book, index, self) => self.findIndex((b) => b.id === book.id) === index
    );

    return uniqueBooks.slice(0, 5); // Return top 5
  }, [recentSelections]);

  const getRecentLanguages = useCallback(() => {
    const languages = recentSelections
      .filter((item) => item.languageId)
      .map((item) => ({
        id: item.languageId,
        organization: item.organization,
        timestamp: item.timestamp,
      }));

    // Remove duplicates by languageId
    const uniqueLanguages = languages.filter(
      (lang, index, self) => self.findIndex((l) => l.id === lang.id) === index
    );

    return uniqueLanguages.slice(0, 5); // Return top 5
  }, [recentSelections]);

  const getRecentOrganizations = useCallback(() => {
    const organizations = recentSelections
      .filter((item) => item.organization)
      .map((item) => ({
        id: item.organization,
        timestamp: item.timestamp,
      }));

    // Remove duplicates by organization
    const uniqueOrgs = organizations.filter(
      (org, index, self) => self.findIndex((o) => o.id === org.id) === index
    );

    return uniqueOrgs.slice(0, 3); // Return top 3
  }, [recentSelections]);

  return {
    recentSelections,
    saveSelection,
    clearHistory,
    getRecentBooks,
    getRecentLanguages,
    getRecentOrganizations,
    getRecentSelections: () => recentSelections,
  };
}
