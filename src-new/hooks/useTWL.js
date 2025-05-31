/**
 * useTWL.js
 * Hook for loading and managing Translation Word Links data
 */

import { useState, useCallback } from "react";
import { getLinksForVerse } from "../services/twlService";
import { getArticlesForLinks } from "../services/twService";

export function useTWL() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [twlLinks, setTwlLinks] = useState([]);

  const loadTWLData = useCallback(async (reference) => {
    if (!reference?.bookId || !reference?.chapter || !reference?.verse) {
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      // Step 1: Get TWL links (rc:// URIs) for this verse
      const links = await getLinksForVerse(reference.bookId, reference.chapter, reference.verse);

      setTwlLinks(links);

      if (links && links.length > 0) {
        // Step 2: Fetch actual tW articles for the links
        const articles = await getArticlesForLinks(links);

        // Step 3: Return structured data with both links and articles
        return {
          links,
          articles,
          count: articles.length,
          hasData: articles.length > 0,
        };
      }

      return {
        links: [],
        articles: [],
        count: 0,
        hasData: false,
      };
    } catch (err) {
      setError(err.message || "Failed to load TWL data");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Convenience method to get just the links without articles
  const loadTWLLinks = useCallback(async (reference) => {
    if (!reference?.bookId || !reference?.chapter || !reference?.verse) {
      return [];
    }

    setLoading(true);
    setError(null);

    try {
      const links = await getLinksForVerse(reference.bookId, reference.chapter, reference.verse);

      setTwlLinks(links);
      return links || [];
    } catch (err) {
      setError(err.message || "Failed to load TWL links");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loadTWLData,
    loadTWLLinks,
    loading,
    error,
    twlLinks,
  };
}
