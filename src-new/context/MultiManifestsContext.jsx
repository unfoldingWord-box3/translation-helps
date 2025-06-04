/**
 * MultiManifestsContext.js
 * Context to provide DCS manifests for multiple resources.
 */

import React, { createContext, useState, useEffect, useContext, useRef } from "react";
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
  const currentLoadingRef = useRef(""); // Track current loading operation to prevent race conditions
  const { organization, languageId } = useContext(ReferenceContext);

  useEffect(() => {
    async function loadManifests() {
      if (!languageId || !organization) {
        setManifests({});
        setIsLoading(false);
        currentLoadingRef.current = "";
        return;
      }

      // Create a unique key for this loading operation to prevent race conditions
      const currentLoadingKey = `${organization}-${languageId}`;
      currentLoadingRef.current = currentLoadingKey;
      setIsLoading(true);

      console.log(`🔄 MultiManifestsContext: Starting load for ${currentLoadingKey}`);

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

      // Only update state if this is still the active loading operation (prevent race conditions)
      if (currentLoadingRef.current === currentLoadingKey) {
        results.forEach(({ resourceId, manifest }) => {
          if (manifest) {
            loadedManifests[resourceId] = manifest;
            console.log(`✅ Loaded manifest for ${resourceId}`);
          } else {
            console.warn(`❌ Failed to load manifest for ${resourceId}`);
          }
        });

        console.log(
          `✅ MultiManifestsContext: Completed load for ${currentLoadingKey}, loaded ${
            Object.keys(loadedManifests).length
          } manifests`
        );
        setManifests(loadedManifests);
        setIsLoading(false);
      } else {
        console.log(
          `🚫 MultiManifestsContext: Discarding stale load result for ${currentLoadingKey} (current: ${currentLoadingRef.current})`
        );
      }
    }

    loadManifests();
  }, [languageId, organization]);

  return (
    <ManifestsContext.Provider value={{ manifests, isLoading }}>
      {children}
    </ManifestsContext.Provider>
  );
}
