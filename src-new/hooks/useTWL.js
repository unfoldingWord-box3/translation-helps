/**
 * useTWL.js
 * Hook for loading and managing Translation Word Links data
 */

import { useState, useCallback } from 'react';
import { getLinksForVerse } from '../services/twlService';

export function useTWL() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadTWLData = useCallback(async (reference) => {
    if (!reference?.bookId || !reference?.chapter || !reference?.verse) {
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const links = await getLinksForVerse(
        reference.bookId,
        reference.chapter,
        reference.verse
      );

      // Transform the links into a more usable format
      if (links && links.length > 0) {
        return links.map(link => ({
          word: link.word || 'Unknown',
          definition: link.definition || '',
          links: link.articles || []
        }));
      }

      return [];
    } catch (err) {
      setError(err.message || 'Failed to load TWL data');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loadTWLData,
    loading,
    error
  };
}