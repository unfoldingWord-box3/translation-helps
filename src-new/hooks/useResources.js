/**
 * useResources.js
 * Hook for fetching and managing resource data by organization and language from DCS catalog API
 */

import { useState, useEffect } from "react";
import { fetchBibleResources } from "../services/catalogService.js";

/**
 * Hook for fetching available resources for a specific organization and language
 * @param {string} organization - The organization/owner name
 * @param {string} language - The language ID
 * @returns {Object} Object containing resources array, loading state, and error
 */
export function useResources(organization, language) {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadResources = async () => {
      if (!organization || !language) {
        setResources([]);
        setLoading(false);
        setError(null);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await fetchBibleResources(organization, language);

        if (isMounted) {
          setResources(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
          console.error(`Failed to load resources for ${organization}/${language}:`, err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadResources();

    return () => {
      isMounted = false;
    };
  }, [organization, language]);

  return {
    resources,
    loading,
    error,
  };
}

export default useResources;
