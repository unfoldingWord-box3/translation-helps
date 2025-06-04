/**
 * MultiManifestsContext.js
 * Context to provide DCS manifests for multiple resources.
 */

import React, { createContext, useState, useEffect } from "react";
import { fetchManifest } from "../services/dcsClient";

export const ManifestsContext = createContext({ manifests: {}, isLoading: false });

const RESOURCE_IDS = ["ult", "tn", "tq", "tw", "twl"];

/**
 * Provider that fetches and provides manifests for multiple resources.
 * @param {{children: React.ReactNode, languageId: string, organization: string}} props
 */
export function MultiManifestsProvider({ children, languageId, organization }) {
  const [manifests, setManifests] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadManifests() {
      if (!languageId || !organization) return;

      setIsLoading(true);
      const loadedManifests = {};

      // Load manifests for all resources in parallel
      const promises = RESOURCE_IDS.map(async (resourceId) => {
        try {
          const manifest = await fetchManifest(languageId, resourceId, organization);
          return { resourceId, manifest };
        } catch (error) {
          console.error(`Failed to load manifest for ${resourceId}:`, error);
          return { resourceId, manifest: null };
        }
      });

      const results = await Promise.all(promises);

      results.forEach(({ resourceId, manifest }) => {
        if (manifest) {
          loadedManifests[resourceId] = manifest;
        }
      });

      setManifests(loadedManifests);
      setIsLoading(false);
    }

    loadManifests();
  }, [languageId, organization]);

  return (
    <ManifestsContext.Provider value={{ manifests, isLoading }}>
      {children}
    </ManifestsContext.Provider>
  );
}
