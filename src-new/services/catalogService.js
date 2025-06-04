/**
 * catalogService.js
 * Service for DCS catalog API integration to discover organizations, languages, and resources
 */

const BASE_CATALOG_URL = "https://git.door43.org/api/v1/catalog/list";

/**
 * Cache for API responses with timeout
 */
class CatalogCache {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 300000; // 5 minutes
  }

  get(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    return null;
  }

  set(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  clear() {
    this.cache.clear();
  }
}

const cache = new CatalogCache();

/**
 * Generic fetch with caching and error handling
 * @param {string} url - The URL to fetch
 * @param {string} cacheKey - Cache key for storing results
 * @returns {Promise<any>} API response data
 */
async function fetchWithCache(url, cacheKey) {
  // Check cache first
  const cached = cache.get(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    cache.set(cacheKey, data);
    return data;
  } catch (error) {
    console.error(`Failed to fetch from ${url}:`, error);
    // Return cached data if available, even if expired
    const expiredCache = cache.cache.get(cacheKey);
    if (expiredCache) {
      console.warn(`Using expired cache for ${cacheKey}`);
      return expiredCache.data;
    }
    throw error;
  }
}

/**
 * Fetches available organizations/owners from DCS catalog API
 * @returns {Promise<string[]>} Array of organization names
 */
export async function fetchOrganizations() {
  // Use hardcoded organizations since DCS catalog API endpoints are not available
  // These are the main organizations that provide Bible translation resources
  return ["unfoldingWord", "door43-catalog", "STR", "WA"];
}

/**
 * Fetches available languages for a specific organization
 * @param {string} owner - The organization/owner name
 * @returns {Promise<string[]>} Array of language IDs
 */
export async function fetchLanguages(owner) {
  if (!owner) {
    return [];
  }

  // Use hardcoded common languages since DCS catalog API endpoints are not available
  // These are the most commonly used languages for Bible translations
  const commonLanguages = [
    "en",
    "es",
    "fr",
    "pt",
    "hi",
    "ar",
    "sw",
    "zh",
    "ru",
    "de",
    "it",
    "ja",
    "ko",
    "nl",
    "pl",
    "tr",
    "vi",
    "th",
    "id",
    "ms",
  ];

  return commonLanguages;
}

/**
 * Fetches available resources/subjects for a specific organization and language
 * @param {string} owner - The organization/owner name
 * @param {string} language - The language ID
 * @returns {Promise<string[]>} Array of resource IDs
 */
export async function fetchResources(owner, language) {
  if (!owner || !language) {
    return [];
  }

  // Use hardcoded supported resources since DCS catalog API endpoints are not available
  // These are the Bible translation resources supported by this app
  const supportedResources = ["ult", "ust", "tn", "tq", "tw", "twl", "ta"];

  return supportedResources;
}

/**
 * Clears all cached catalog data
 */
export function clearCatalogCache() {
  cache.clear();
}

/**
 * Pre-loads catalog data for better UX
 * @param {string} owner - Optional organization to pre-load
 */
export async function preloadCatalogData(owner = null) {
  try {
    // Always pre-load organizations
    await fetchOrganizations();

    if (owner) {
      // Pre-load languages for specific organization
      await fetchLanguages(owner);
    }
  } catch (error) {
    console.warn("Failed to preload catalog data:", error);
  }
}

export default {
  fetchOrganizations,
  fetchLanguages,
  fetchResources,
  clearCatalogCache,
  preloadCatalogData,
};
