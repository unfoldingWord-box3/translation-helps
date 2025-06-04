/**
 * useOrganizations.js
 * Hook for fetching and managing organization data from DCS catalog API
 */

import { useState, useEffect } from "react";
import { fetchOrganizations } from "../services/catalogService.js";

/**
 * Hook for fetching available organizations from DCS catalog API
 * @returns {Object} Object containing organizations array, loading state, and error
 */
export function useOrganizations() {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadOrganizations = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchOrganizations();

        if (isMounted) {
          setOrganizations(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
          console.error("Failed to load organizations:", err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadOrganizations();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    organizations,
    loading,
    error,
  };
}

export default useOrganizations;
