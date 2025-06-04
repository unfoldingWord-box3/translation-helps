/**
 * twService.js
 * Service module for loading and caching Translation Words (tW) articles.
 *
 * Responsible for:
 * - Fetching tW articles from rc:// URIs
 * - Parsing markdown content into structured data
 * - Caching articles for performance
 * - Handling 404s gracefully for missing articles
 */

const cache = {};

/**
 * Parses an rc:// URI to extract repository and file path information
 * @param {string} rcUri - RC URI with format: rc://language/resource/path
 * @param {string} [contextLanguage="en"] - Current language context for wildcard resolution
 * @returns {object} Parsed URI components
 */
function parseRcUri(rcUri, contextLanguage = "en") {
  if (!rcUri || !rcUri.startsWith("rc://")) {
    throw new Error(`Invalid rc:// URI: ${rcUri}`);
  }

  // Handle wildcard language code by replacing * with contextLanguage
  let normalizedUri = rcUri;
  if (rcUri.startsWith("rc://*/")) {
    normalizedUri = rcUri.replace("rc://*/", `rc://${contextLanguage}/`);
  }

  // Remove rc:// prefix and split
  const parts = normalizedUri.replace("rc://", "").split("/");

  if (parts.length < 4) {
    throw new Error(`Invalid rc:// URI format: ${rcUri}`);
  }

  const [language, resource, ...pathParts] = parts;

  return {
    language,
    resource,
    path: pathParts.join("/"),
    fileName: pathParts[pathParts.length - 1] + ".md",
  };
}

/**
 * Converts rc:// URI to DCS raw file URL
 * @param {string} rcUri - RC URI like "rc://en/tw/dict/bible/kt/create"
 * @param {string} [contextLanguage="en"] - Current language context for wildcard resolution
 * @returns {string} DCS raw file URL
 */
function rcUriToUrl(rcUri, contextLanguage = "en", contextOrganization = "unfoldingWord") {
  const { language, resource, path } = parseRcUri(rcUri, contextLanguage);
  const baseUrl = `https://git.door43.org/${contextOrganization}/${language}_${resource}/raw/branch/master`;

  // For tW URIs, skip the "dict" part in the path
  // rc://en/tw/dict/bible/kt/create -> bible/kt/create.md
  const pathParts = path.split("/");
  let finalPath = path;

  if (resource === "tw" && pathParts[0] === "dict") {
    finalPath = pathParts.slice(1).join("/");
  }

  return `${baseUrl}/${finalPath}.md`;
}

/**
 * Parses markdown content to extract title and content
 * @param {string} markdown - Raw markdown content
 * @returns {object} Parsed article with title and content
 */
function parseMarkdown(markdown) {
  const lines = markdown.split("\n");
  let title = "";
  let content = "";
  let inFrontMatter = false;
  let contentLines = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Skip YAML front matter
    if (line === "---") {
      inFrontMatter = !inFrontMatter;
      continue;
    }

    if (inFrontMatter) {
      continue;
    }

    // Extract title from first # heading
    if (!title && line.startsWith("# ")) {
      title = line.replace("# ", "").trim();
      continue;
    }

    // Collect content lines
    contentLines.push(lines[i]);
  }

  content = contentLines.join("\n").trim();

  return {
    title: title || "Translation Word",
    content,
    markdown,
  };
}

/**
 * Fetches a single tW article from an rc:// URI
 * @param {string} rcUri - RC URI pointing to a tW article
 * @param {string} [contextLanguage="en"] - Current language context for wildcard resolution
 * @param {string} [contextOrganization="unfoldingWord"] - Current organization context
 * @returns {Promise<object>} Article object with title, content, and metadata
 */
export async function getArticle(
  rcUri,
  contextLanguage = "en",
  contextOrganization = "unfoldingWord"
) {
  if (!rcUri) {
    throw new Error("RC URI is required");
  }

  // Check cache first
  if (cache[rcUri]) {
    return cache[rcUri];
  }

  let url;
  try {
    url = rcUriToUrl(rcUri, contextLanguage, contextOrganization);
    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 404) {
        // Cache the fact that this article doesn't exist
        const notFoundArticle = {
          rcUri,
          title: "Article Not Found",
          content: `The requested article could not be found: ${rcUri}`,
          error: "not_found",
          url,
        };
        cache[rcUri] = notFoundArticle;
        return notFoundArticle;
      }
      throw new Error(`Failed to fetch article: ${response.statusText}`);
    }

    const markdown = await response.text();
    const parsed = parseMarkdown(markdown);

    const article = {
      rcUri,
      title: parsed.title,
      content: parsed.content,
      markdown: parsed.markdown,
      url,
      fetchedAt: new Date().toISOString(),
    };

    // Cache the article
    cache[rcUri] = article;
    return article;
  } catch (error) {
    console.error(`Error fetching tW article ${rcUri}:`, error);

    // Cache error to avoid repeated failed requests
    const errorArticle = {
      rcUri,
      title: "Error Loading Article",
      content: `Failed to load article: ${error.message}`,
      error: error.message,
      url: url || "invalid-url",
    };
    cache[rcUri] = errorArticle;
    return errorArticle;
  }
}

/**
 * Fetches multiple tW articles in parallel
 * @param {string[]} rcUris - Array of RC URIs
 * @param {string} [contextLanguage="en"] - Current language context for wildcard resolution
 * @param {string} [contextOrganization="unfoldingWord"] - Current organization context
 * @returns {Promise<object[]>} Array of article objects
 */
export async function getArticlesForLinks(
  rcUris,
  contextLanguage = "en",
  contextOrganization = "unfoldingWord"
) {
  if (!Array.isArray(rcUris)) {
    return [];
  }

  const uniqueUris = [...new Set(rcUris.filter(Boolean))];

  if (uniqueUris.length === 0) {
    return [];
  }

  try {
    const articles = await Promise.all(
      uniqueUris.map((uri) => getArticle(uri, contextLanguage, contextOrganization))
    );

    return articles.filter((article) => article && !article.error);
  } catch (error) {
    console.error("Error fetching multiple articles:", error);
    return [];
  }
}

/**
 * Clears the internal cache (for testing or forcing refresh)
 */
export function clearCache() {
  Object.keys(cache).forEach((key) => {
    delete cache[key];
  });
}

/**
 * Gets cache statistics for debugging
 * @returns {object} Cache statistics
 */
export function getCacheStats() {
  const entries = Object.values(cache);
  return {
    totalEntries: entries.length,
    successfulEntries: entries.filter((entry) => !entry.error).length,
    errorEntries: entries.filter((entry) => entry.error).length,
    notFoundEntries: entries.filter((entry) => entry.error === "not_found").length,
  };
}

export default {
  getArticle,
  getArticlesForLinks,
  clearCache,
  getCacheStats,
};
