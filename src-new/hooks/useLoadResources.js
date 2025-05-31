/**
 * useLoadResources.js
 * Hook to fetch and cache TSV-based resource sets.
 */

import { useState, useEffect } from 'react';
import { fetchResourceFile } from '../services/dcsClient';
import { parseTsv } from '../utils/parseTsv';

/**
 * Loads and parses a TSV resource for a given book.
 * @param {string} languageId
 * @param {string} resourceId
 * @param {string} bookId
 * @returns {Array<Object>}
 */
export function useLoadResources(languageId, resourceId, bookId) {
  const [data, setData] = useState([]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!languageId || !resourceId || !bookId) return;
      const text = await fetchResourceFile(languageId, resourceId, `${bookId}.tsv`);
      if (!cancelled) {
        setData(parseTsv(text));
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [languageId, resourceId, bookId]);

  return data;
}