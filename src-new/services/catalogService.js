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
 * @returns {Promise<Object[]>} Array of organization objects with metadata
 */
export async function fetchOrganizations() {
  const fallbackOrganizations = [
    {
      login: "unfoldingWord",
      full_name: "unfoldingWord",
      description: "Open Bible resources for every language",
      avatar_url: null,
      website: "https://unfoldingword.org",
    },
    {
      login: "door43-catalog",
      full_name: "Door43 Catalog",
      description: "Community-driven translation hub",
      avatar_url: null,
      website: "https://door43.org",
    },
    {
      login: "STR",
      full_name: "STR",
      description: "Scripture Translation Resources",
      avatar_url: null,
      website: null,
    },
    {
      login: "WA",
      full_name: "WA",
      description: "Wycliffe Associates",
      avatar_url: null,
      website: null,
    },
  ];

  try {
    const url = `${BASE_CATALOG_URL}/owners`;
    const data = await fetchWithCache(url, "organizations");

    if (data && data.data && Array.isArray(data.data) && data.data.length > 0) {
      // Extract full organization objects from API response
      const organizations = data.data
        .filter((org) => org && org.login)
        .map((org) => ({
          login: org.login,
          full_name: org.full_name || org.login,
          description: org.description || `Organization: ${org.full_name || org.login}`,
          avatar_url: org.avatar_url || null,
          website: org.website || null,
          location: org.location || null,
          repo_count: org.repo_count || 0,
          visibility: org.visibility || "public",
        }))
        .sort((a, b) => (a.full_name || a.login).localeCompare(b.full_name || b.login));

      return organizations.length > 0 ? organizations : fallbackOrganizations;
    }

    return fallbackOrganizations;
  } catch (error) {
    console.warn("Failed to fetch organizations from API, using fallback data:", error);
    return fallbackOrganizations;
  }
}

/**
 * Fetches available languages for a specific organization
 * @param {string} owner - The organization/owner name
 * @returns {Promise<Object[]>} Array of language objects with code, name, and metadata
 */
export async function fetchLanguages(owner) {
  if (!owner) {
    return [];
  }

  const fallbackLanguages = [
    { code: "en", name: "English", direction: "ltr" },
    { code: "es", name: "Spanish", direction: "ltr" },
    { code: "fr", name: "French", direction: "ltr" },
    { code: "pt", name: "Portuguese", direction: "ltr" },
    { code: "hi", name: "Hindi", direction: "ltr" },
    { code: "ar", name: "Arabic", direction: "rtl" },
    { code: "sw", name: "Swahili", direction: "ltr" },
    { code: "zh", name: "Chinese", direction: "ltr" },
    { code: "ru", name: "Russian", direction: "ltr" },
    { code: "de", name: "German", direction: "ltr" },
    { code: "it", name: "Italian", direction: "ltr" },
    { code: "ja", name: "Japanese", direction: "ltr" },
    { code: "ko", name: "Korean", direction: "ltr" },
    { code: "nl", name: "Dutch", direction: "ltr" },
    { code: "pl", name: "Polish", direction: "ltr" },
    { code: "tr", name: "Turkish", direction: "ltr" },
    { code: "vi", name: "Vietnamese", direction: "ltr" },
    { code: "th", name: "Thai", direction: "ltr" },
    { code: "id", name: "Indonesian", direction: "ltr" },
    { code: "ms", name: "Malay", direction: "ltr" },
  ];

  try {
    const url = `${BASE_CATALOG_URL}/languages?owner=${encodeURIComponent(owner)}`;
    const data = await fetchWithCache(url, `languages_${owner}`);

    if (data && data.data && Array.isArray(data.data) && data.data.length > 0) {
      // Extract language objects from API response
      const languages = data.data
        .filter((lang) => lang && lang.lc)
        .map((lang) => ({
          code: lang.lc,
          name: lang.ln || lang.lc,
          direction: lang.ld || "ltr",
          raw: lang,
        }))
        .sort((a, b) => (a.name || a.code).localeCompare(b.name || b.code));

      return languages.length > 0 ? languages : fallbackLanguages;
    }

    return fallbackLanguages;
  } catch (error) {
    console.warn(`Failed to fetch languages for ${owner} from API, using fallback data:`, error);
    return fallbackLanguages;
  }
}

/**
 * Fetches available resources/subjects for a specific organization and language
 * @param {string} owner - The organization/owner name
 * @param {string|Object} language - The language ID (string) or language object with code property
 * @returns {Promise<string[]>} Array of resource IDs
 */
export async function fetchResources(owner, language) {
  if (!owner || !language) {
    return [];
  }

  // Extract language code from string or object
  const languageCode = typeof language === "string" ? language : language.code;
  if (!languageCode) {
    return [];
  }

  const fallbackResources = ["ult", "ust", "tn", "tq", "tw", "twl", "ta"];

  try {
    const url = `${BASE_CATALOG_URL}/subjects?owner=${encodeURIComponent(
      owner
    )}&lang=${encodeURIComponent(languageCode)}`;
    const data = await fetchWithCache(url, `resources_${owner}_${languageCode}`);

    if (data && data.data && Array.isArray(data.data) && data.data.length > 0) {
      // Extract resource identifiers from API response
      const resources = data.data
        .filter((resource) => resource && typeof resource === "string")
        .sort();

      return resources.length > 0 ? resources : fallbackResources;
    }

    return fallbackResources;
  } catch (error) {
    console.warn(
      `Failed to fetch resources for ${owner}/${language} from API, using fallback data:`,
      error
    );
    return fallbackResources;
  }
}

/**
 * Fetches available Bible resources for a specific organization and language
 * @param {string} owner - The organization/owner name
 * @param {string|Object} language - The language ID or language object
 * @returns {Promise<Object[]>} Array of Bible repository objects
 */
export async function fetchBibleResources(owner, language) {
  if (!owner || !language) {
    return [];
  }

  const languageCode = typeof language === "string" ? language : language.code;
  if (!languageCode) {
    return [];
  }

  const fallbackResources = [
    {
      id: "ult",
      name: "ult",
      fullName: "unfoldingWord/en_ult",
      description: "unfoldingWord Literal Text",
      subject: "Aligned Bible",
      repoUrl: "https://git.door43.org/unfoldingWord/en_ult",
      avatarUrl: null,
      owner: null,
    },
    {
      id: "ust",
      name: "ust",
      fullName: "unfoldingWord/en_ust",
      description: "unfoldingWord Simplified Text",
      subject: "Aligned Bible",
      repoUrl: "https://git.door43.org/unfoldingWord/en_ust",
      avatarUrl: null,
      owner: null,
    },
  ];

  try {
    const searchParams = new URLSearchParams({
      owner: owner,
      lang: languageCode,
      subject: "Bible,Aligned Bible", // Filter for Bible subjects only
      limit: "50",
    });

    const url = `https://git.door43.org/api/v1/repos/search?${searchParams}`;
    const data = await fetchWithCache(url, `bible_resources_${owner}_${languageCode}`);

    if (data && data.data && Array.isArray(data.data) && data.data.length > 0) {
      // Filter and format Bible resources
      const resources = data.data
        .filter(
          (repo) =>
            repo && repo.name && (repo.subject === "Bible" || repo.subject === "Aligned Bible")
        )
        .map((repo) => ({
          id: repo.name,
          name: repo.name,
          fullName: repo.full_name,
          description: repo.description || repo.name,
          subject: repo.subject,
          repoUrl: repo.html_url || repo.repo_url,
          avatarUrl: repo.avatar_url || null, // Repository avatar
          owner: repo.owner || null, // Owner information
        }))
        .sort((a, b) => a.name.localeCompare(b.name));

      return resources.length > 0 ? resources : fallbackResources;
    }

    return fallbackResources;
  } catch (error) {
    console.warn(`Failed to fetch Bible resources for ${owner}/${languageCode}:`, error);
    return fallbackResources;
  }
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
  fetchBibleResources,
  clearCatalogCache,
  preloadCatalogData,
};
