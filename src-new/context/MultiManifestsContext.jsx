/**
 * MultiManifestsContext.js
 * Context to provide DCS manifests for multiple resources.
 */

import React, { createContext, useState, useEffect, useContext } from "react";
import { fetchManifest } from "../services/dcsClient";
import { ReferenceContext } from "./ReferenceContext";
import { fetchBibleResources } from "../services/catalogService";

export const ManifestsContext = createContext({ manifests: {}, isLoading: false });

// Base resource IDs that are always loaded (Translation Notes, Questions, Words, etc.)
const BASE_RESOURCE_IDS = ["tn", "tq", "tw", "twl"];

/**
 * Provider that fetches and provides manifests for multiple resources.
 * Automatically subscribes to organization and languageId from ReferenceContext.
 * Dynamically loads manifests for all available Bible resources.
 */
export function MultiManifestsProvider({ children }) {
  const [manifests, setManifests] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const { organization, languageId } = useContext(ReferenceContext);

  useEffect(() => {
    async function loadManifests() {
      if (!languageId || !organization) {
        setManifests({});
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setManifests({}); // Clear previous manifests when context changes

      const loadedManifests = {};
      let allResourceIds = [...BASE_RESOURCE_IDS];

      try {
        // Fetch available Bible resources dynamically
        const bibleResources = await fetchBibleResources(organization, languageId);
        const bibleResourceIds = bibleResources
          .map((resource) => {
            // Strip language prefix to get base resource ID (e.g., "en_ult" -> "ult")
            if (resource.id && languageId && resource.id.startsWith(`${languageId}_`)) {
              return resource.id.substring(languageId.length + 1);
            }
            return resource.id;
          })
          .filter(Boolean);

        console.log("📚 Available Bible resource IDs:", bibleResourceIds);
        allResourceIds = [...BASE_RESOURCE_IDS, ...bibleResourceIds];

        // Remove duplicates
        allResourceIds = [...new Set(allResourceIds)];
        console.log("📋 Loading manifests for resources:", allResourceIds);
      } catch (error) {
        console.warn("⚠️ Failed to fetch Bible resources, using base resources only:", error);
        // Fallback to base resources + common Bible resources
        allResourceIds = [...BASE_RESOURCE_IDS, "ult", "ust", "t4t"];
      }

      // Load manifests for all resources in parallel
      const promises = allResourceIds.map(async (resourceId) => {
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
          console.log(`✅ Loaded manifest for ${resourceId}`);
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
