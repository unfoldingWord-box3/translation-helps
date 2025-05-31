/**
 * useManifest.js
 * Hook to fetch and parse DCS manifest.
 */

import { useState, useEffect } from 'react';
import { fetchManifest } from '../services/dcsClient';

/**
 * Loads manifest for a given resource.
 * @param {string} languageId
 * @param {string} resourceId
 * @returns {Object|null}
 */
export function useManifest(languageId, resourceId) {
  const [manifest, setManifest] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!languageId || !resourceId) return;
      const data = await fetchManifest(languageId, resourceId);
      if (!cancelled) {
        setManifest(data);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [languageId, resourceId]);

  return manifest;
}