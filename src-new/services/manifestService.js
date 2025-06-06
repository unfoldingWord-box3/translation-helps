/**
 * manifestService.js
 * Service for fetching and parsing resource manifest files from DCS
 * Provides book availability information and localized metadata
 */

import { load as parseYaml } from "js-yaml";

/**
 * Fetch a resource manifest from DCS
 * @param {string} owner - The organization/owner name
 * @param {string} languageCode - The language code
 * @param {string} resourceId - The resource identifier
 * @returns {Promise<object>} Parsed manifest object
 */
export async function fetchResourceManifest(owner, languageCode, resourceId) {
  const url = `https://git.door43.org/${owner}/${languageCode}_${resourceId}/raw/branch/master/manifest.yaml`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch manifest: ${response.status} ${response.statusText}`);
    }

    const yamlText = await response.text();
    const manifest = parseYaml(yamlText);

    if (!manifest) {
      throw new Error("Invalid or empty manifest file");
    }

    return manifest;
  } catch (error) {
    console.warn(`Failed to fetch manifest for ${owner}/${languageCode}_${resourceId}:`, error);
    throw error;
  }
}

/**
 * Extract available books from a manifest
 * @param {object} manifest - The parsed manifest object
 * @returns {array} Array of book objects with metadata
 */
export function extractAvailableBooks(manifest) {
  if (!manifest || !manifest.projects) {
    return [];
  }

  return manifest.projects
    .map((project) => {
      // Handle different manifest structures
      const bookId = project.identifier || project.id;
      const title = project.title || project.name || bookId;

      // Extract chapter information
      let chapterCount = 0;
      if (project.chunks && Array.isArray(project.chunks)) {
        chapterCount = project.chunks.length;
      } else if (project.chapters && Array.isArray(project.chapters)) {
        chapterCount = project.chapters.length;
      } else if (typeof project.chapters === "number") {
        chapterCount = project.chapters;
      }

      return {
        id: bookId,
        title: title,
        chapters: chapterCount,
        categories: project.categories || [],
        sort: project.sort || 999,
        path: project.path || "",
        description: project.description || "",
      };
    })
    .filter((book) => book.id) // Remove invalid entries
    .sort((a, b) => a.sort - b.sort); // Sort by canonical order
}

/**
 * Get resource metadata from manifest
 * @param {object} manifest - The parsed manifest object
 * @returns {object} Resource metadata
 */
export function extractResourceMetadata(manifest) {
  if (!manifest) {
    return {};
  }

  return {
    title: manifest.title || manifest.dublin_core?.title || "",
    description: manifest.description || manifest.dublin_core?.description || "",
    language: manifest.language || manifest.dublin_core?.language || "",
    publisher: manifest.publisher || manifest.dublin_core?.publisher || "",
    creator: manifest.creator || manifest.dublin_core?.creator || "",
    contributor: manifest.contributor || manifest.dublin_core?.contributor || "",
    subject: manifest.subject || manifest.dublin_core?.subject || "",
    type: manifest.type || manifest.dublin_core?.type || "",
    format: manifest.format || manifest.dublin_core?.format || "",
    source: manifest.source || manifest.dublin_core?.source || "",
    relation: manifest.relation || manifest.dublin_core?.relation || "",
    coverage: manifest.coverage || manifest.dublin_core?.coverage || "",
    rights: manifest.rights || manifest.dublin_core?.rights || "",
    checking: manifest.checking || {},
    projects: manifest.projects?.length || 0,
  };
}

/**
 * Get localized book titles from manifest
 * @param {object} manifest - The parsed manifest object
 * @returns {object} Map of book IDs to localized titles
 */
export function getLocalizedBookTitles(manifest) {
  const titles = {};

  if (!manifest || !manifest.projects) {
    return titles;
  }

  manifest.projects.forEach((project) => {
    const bookId = project.identifier || project.id;
    const title = project.title || project.name;

    if (bookId && title) {
      titles[bookId] = title;
    }
  });

  return titles;
}

/**
 * Check if a book is available in the manifest
 * @param {object} manifest - The parsed manifest object
 * @param {string} bookId - The book identifier to check
 * @returns {boolean} True if book is available
 */
export function isBookAvailable(manifest, bookId) {
  if (!manifest || !manifest.projects) {
    return false;
  }

  return manifest.projects.some(
    (project) => project.identifier === bookId || project.id === bookId
  );
}

/**
 * Get chapter count for a specific book
 * @param {object} manifest - The parsed manifest object
 * @param {string} bookId - The book identifier
 * @returns {number} Number of chapters, or 0 if not found
 */
export function getBookChapterCount(manifest, bookId) {
  if (!manifest || !manifest.projects) {
    return 0;
  }

  const project = manifest.projects.find((p) => p.identifier === bookId || p.id === bookId);

  if (!project) {
    return 0;
  }

  if (project.chunks && Array.isArray(project.chunks)) {
    return project.chunks.length;
  } else if (project.chapters && Array.isArray(project.chapters)) {
    return project.chapters.length;
  } else if (typeof project.chapters === "number") {
    return project.chapters;
  }

  return 0;
}

/**
 * Cache for manifest data to avoid repeated fetches
 */
const manifestCache = new Map();

/**
 * Get manifest with caching
 * @param {string} owner - The organization/owner name
 * @param {string} languageCode - The language code
 * @param {string} resourceId - The resource identifier
 * @param {number} maxAge - Maximum cache age in milliseconds (default: 5 minutes)
 * @returns {Promise<object>} Cached or fetched manifest
 */
export async function getCachedManifest(owner, languageCode, resourceId, maxAge = 5 * 60 * 1000) {
  const cacheKey = `${owner}/${languageCode}_${resourceId}`;
  const cached = manifestCache.get(cacheKey);

  // Check if we have a valid cached version
  if (cached && Date.now() - cached.timestamp < maxAge) {
    return cached.manifest;
  }

  try {
    const manifest = await fetchResourceManifest(owner, languageCode, resourceId);

    // Cache the result
    manifestCache.set(cacheKey, {
      manifest,
      timestamp: Date.now(),
    });

    return manifest;
  } catch (error) {
    // If fetch fails but we have an expired cached version, return it
    if (cached) {
      console.warn("Using expired cached manifest due to fetch error");
      return cached.manifest;
    }
    throw error;
  }
}

/**
 * Clear the manifest cache (useful for testing or forced refresh)
 * @param {string} cacheKey - Optional specific key to clear, clears all if not provided
 */
export function clearManifestCache(cacheKey = null) {
  if (cacheKey) {
    manifestCache.delete(cacheKey);
  } else {
    manifestCache.clear();
  }
}

/**
 * Get cache statistics
 * @returns {object} Cache statistics
 */
export function getManifestCacheStats() {
  return {
    size: manifestCache.size,
    keys: Array.from(manifestCache.keys()),
    totalMemory: JSON.stringify(Object.fromEntries(manifestCache)).length,
  };
}

/**
 * Batch fetch multiple manifests
 * @param {array} requests - Array of {owner, languageCode, resourceId} objects
 * @param {object} options - Options for parallel fetching
 * @returns {Promise<array>} Array of results with manifest data or errors
 */
export async function batchFetchManifests(requests, options = {}) {
  const { maxConcurrent = 5, timeout = 10000 } = options;

  const results = [];

  // Process in batches to avoid overwhelming the server
  for (let i = 0; i < requests.length; i += maxConcurrent) {
    const batch = requests.slice(i, i + maxConcurrent);

    const batchPromises = batch.map(async (request) => {
      try {
        const manifest = await Promise.race([
          getCachedManifest(request.owner, request.languageCode, request.resourceId),
          new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), timeout)),
        ]);

        return {
          ...request,
          manifest,
          success: true,
        };
      } catch (error) {
        return {
          ...request,
          error: error.message,
          success: false,
        };
      }
    });

    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
  }

  return results;
}

/**
 * Validate manifest structure
 * @param {object} manifest - The manifest to validate
 * @returns {object} Validation result with errors and warnings
 */
export function validateManifest(manifest) {
  const errors = [];
  const warnings = [];

  if (!manifest) {
    errors.push("Manifest is null or undefined");
    return { valid: false, errors, warnings };
  }

  if (typeof manifest !== "object") {
    errors.push("Manifest must be an object");
    return { valid: false, errors, warnings };
  }

  // Check required fields
  if (!manifest.title && !manifest.dublin_core?.title) {
    warnings.push("Missing title field");
  }

  if (!manifest.language && !manifest.dublin_core?.language) {
    warnings.push("Missing language field");
  }

  if (!manifest.projects || !Array.isArray(manifest.projects)) {
    errors.push("Missing or invalid projects array");
  } else {
    // Validate projects
    manifest.projects.forEach((project, index) => {
      if (!project.identifier && !project.id) {
        errors.push(`Project ${index} missing identifier`);
      }

      if (!project.title && !project.name) {
        warnings.push(`Project ${index} missing title`);
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

export default {
  fetchResourceManifest,
  getCachedManifest,
  extractAvailableBooks,
  extractResourceMetadata,
  getLocalizedBookTitles,
  isBookAvailable,
  getBookChapterCount,
  clearManifestCache,
  getManifestCacheStats,
  batchFetchManifests,
  validateManifest,
};
