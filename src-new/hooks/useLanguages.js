/**
 * useLanguages.js
 * Hook for fetching and managing language data by organization from DCS catalog API
 */

import { useState, useEffect } from "react";
import { fetchLanguages } from "../services/catalogService.js";

/**
 * Hook for fetching available languages for a specific organization
 * @param {string} organization - The organization/owner name
 * @returns {Object} Object containing languages array, loading state, and error
 */
export function useLanguages(organization) {
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadLanguages = async () => {
      if (!organization) {
        setLanguages([]);
        setLoading(false);
        setError(null);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const data = await fetchLanguages(organization);

        if (isMounted) {
          setLanguages(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
          console.error(`Failed to load languages for ${organization}:`, err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadLanguages();

    return () => {
      isMounted = false;
    };
  }, [organization]);

  return {
    languages,
    loading,
    error,
  };
}

export default useLanguages;
