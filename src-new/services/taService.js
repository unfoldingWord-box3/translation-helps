/**
 * taService.js
 * Service module for loading and caching Translation Academy (tA) articles.
 *
 * Responsible for:
 * - Fetching tA articles from rc:// URIs
 * - Parsing markdown content into structured data
 * - Caching articles for performance
 * - Handling 404s gracefully for missing articles
 */

const cache = {};

/**
 * Parses an rc:// URI to extract repository and file path information
 * @param {string} rcUri - RC URI like "rc://en/ta/man/translate/translate-names"
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
 * Converts rc:// URI to DCS folder URL for Translation Academy articles
 * @param {string} rcUri - RC URI like "rc://en/ta/man/translate/translate-names"
 * @param {string} [contextLanguage="en"] - Current language context for wildcard resolution
 * @returns {object} URLs for the three TA article files
 */
function rcUriToUrls(rcUri, contextLanguage = "en") {
  const { language, resource, path } = parseRcUri(rcUri, contextLanguage);
  const baseUrl = `https://git.door43.org/unfoldingWord/${language}_${resource}/raw/branch/master`;

  // For tA URIs, skip the "man" part in the path
  // rc://en/ta/man/translate/figs-abstractnouns -> translate/figs-abstractnouns
  const pathParts = path.split("/");
  let finalPath = path;

  if (resource === "ta" && pathParts[0] === "man") {
    finalPath = pathParts.slice(1).join("/");
  }

  const folderPath = `${baseUrl}/${finalPath}`;

  return {
    title: `${folderPath}/title.md`,
    subtitle: `${folderPath}/sub-title.md`,
    content: `${folderPath}/01.md`,
  };
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
    title: title || "Translation Academy Article",
    content,
    markdown,
  };
}

/**
 * Fetches content from a single URL with error handling
 * @param {string} url - URL to fetch
 * @returns {Promise<object>} Object with {content, error} or {content: string}
 */
async function fetchFileContent(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      return { content: "", notFound: true };
    }
    const content = await response.text();
    return { content };
  } catch (error) {
    console.warn(`Failed to fetch ${url}:`, error.message);
    return { content: "", networkError: error.message };
  }
}

/**
 * Processes markdown content to extract clean text
 * @param {string} markdown - Raw markdown content
 * @returns {string} Processed content
 */
function processMarkdownContent(markdown) {
  if (!markdown) return "";

  const lines = markdown.split("\n");
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

    // Include all content lines
    contentLines.push(lines[i]);
  }

  return contentLines.join("\n").trim();
}

/**
 * Fetches a single tA article from an rc:// URI
 * TA articles consist of three files: title.md, sub-title.md, and 01.md
 * @param {string} rcUri - RC URI pointing to a tA article
 * @param {string} [contextLanguage="en"] - Current language context for wildcard resolution
 * @returns {Promise<object>} Article object with title, content, and metadata
 */
export async function getArticle(rcUri, contextLanguage = "en") {
  if (!rcUri) {
    throw new Error("RC URI is required");
  }

  // Check cache first
  if (cache[rcUri]) {
    return cache[rcUri];
  }

  let urls;
  try {
    urls = rcUriToUrls(rcUri, contextLanguage);

    // Fetch all three files in parallel
    const [titleResult, subtitleResult, mainResult] = await Promise.all([
      fetchFileContent(urls.title),
      fetchFileContent(urls.subtitle),
      fetchFileContent(urls.content),
    ]);

    // Check for network errors first
    const networkErrors = [titleResult, subtitleResult, mainResult]
      .filter((result) => result.networkError)
      .map((result) => result.networkError);

    if (networkErrors.length > 0) {
      throw new Error(networkErrors[0]); // Throw the first network error
    }

    // Check if we got any content at all
    if (!titleResult.content && !subtitleResult.content && !mainResult.content) {
      // Cache the fact that this article doesn't exist
      const notFoundArticle = {
        rcUri,
        title: "Translation Academy Article Not Found",
        content: `The requested Translation Academy article could not be found: ${rcUri}\n\nThis article may not be available yet or the link may be incorrect.`,
        error: "not_found",
        urls,
      };
      cache[rcUri] = notFoundArticle;
      return notFoundArticle;
    }

    // Process the content
    const processedTitle = processMarkdownContent(titleResult.content);
    const processedSubtitle = processMarkdownContent(subtitleResult.content);
    const processedMain = processMarkdownContent(mainResult.content);

    // Extract title from title.md or fall back to subtitle or default
    let articleTitle = "Translation Academy Article";
    if (processedTitle) {
      // Remove # if present and clean up
      articleTitle = processedTitle
        .replace(/^#+\s*/, "")
        .split("\n")[0]
        .trim();
    } else if (processedSubtitle) {
      articleTitle = processedSubtitle
        .replace(/^#+\s*/, "")
        .split("\n")[0]
        .trim();
    }

    // Combine all content sections with proper markdown heading levels
    const contentSections = [];

    if (processedTitle) {
      // Ensure title.md content uses # top headings
      const titleWithProperHeadings = processedTitle
        .split("\n")
        .map((line) => {
          const trimmed = line.trim();
          // Convert any existing heading to # level, or make non-empty lines into # headings
          if (trimmed.match(/^#+\s/)) {
            return `# ${trimmed.replace(/^#+\s*/, "")}`;
          } else if (trimmed && !trimmed.startsWith("#")) {
            // Make non-empty, non-heading lines into # headings
            return `# ${trimmed}`;
          }
          return line;
        })
        .join("\n");
      contentSections.push(titleWithProperHeadings);
    }

    if (processedSubtitle) {
      // Ensure sub-title.md content uses ## second headings
      const subtitleWithProperHeadings = processedSubtitle
        .split("\n")
        .map((line) => {
          const trimmed = line.trim();
          // Convert any existing heading to ## level, or make non-empty lines into ## headings
          if (trimmed.match(/^#+\s/)) {
            return `## ${trimmed.replace(/^#+\s*/, "")}`;
          } else if (trimmed && !trimmed.startsWith("#")) {
            // Make non-empty, non-heading lines into ## headings
            return `## ${trimmed}`;
          }
          return line;
        })
        .join("\n");
      contentSections.push(subtitleWithProperHeadings);
    }

    if (processedMain) {
      // Keep main content (01.md) as raw markdown - no heading level changes
      contentSections.push(processedMain);
    }

    const combinedContent = contentSections.join("\n\n");

    const article = {
      rcUri,
      title: articleTitle,
      content: combinedContent,
      sections: {
        title: processedTitle,
        subtitle: processedSubtitle,
        main: processedMain,
      },
      urls,
      fetchedAt: new Date().toISOString(),
    };

    // Cache the article
    cache[rcUri] = article;
    return article;
  } catch (error) {
    console.error(`Error fetching tA article ${rcUri}:`, error);

    // Cache error to avoid repeated failed requests
    const errorArticle = {
      rcUri,
      title: "Error Loading Translation Academy Article",
      content: `Failed to load Translation Academy article: ${error.message}\n\nPlease try again later or check if the link is correct.`,
      error: error.message,
      urls: urls || "invalid-urls",
    };
    cache[rcUri] = errorArticle;
    return errorArticle;
  }
}

/**
 * Fetches multiple tA articles in parallel
 * @param {string[]} rcUris - Array of RC URIs
 * @returns {Promise<object[]>} Array of article objects
 */
export async function getArticlesForLinks(rcUris) {
  if (!Array.isArray(rcUris)) {
    return [];
  }

  const uniqueUris = [...new Set(rcUris.filter(Boolean))];

  if (uniqueUris.length === 0) {
    return [];
  }

  try {
    const articles = await Promise.all(uniqueUris.map((uri) => getArticle(uri)));

    return articles; // Return all articles, including errors, for TA since they're educational content
  } catch (error) {
    console.error("Error fetching multiple TA articles:", error);
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
