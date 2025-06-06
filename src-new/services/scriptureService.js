/**
 * scriptureService.js
 * Service for fetching and parsing scripture resources
 * Mirrors the functionality from the old src/components/Viewer/Workspace/Scripture/helpers.js
 */
import { fetchResourceFile } from "./dcsClient";
import { parseUSFM } from "../utils/usfmParser";

/**
 * Fetches raw USFM content for a scripture book
 * @param {object} params
 * @param {string} params.languageId - Language identifier (e.g., 'en')
 * @param {string} params.resourceId - Resource identifier (e.g., 'ult', 'ust')
 * @param {string} params.bookId - Book identifier (e.g., 'gen')
 * @param {object} params.manifest - Resource manifest
 * @param {string} params.organization - Organization identifier (e.g., 'unfoldingWord')
 * @returns {Promise<string>} Raw USFM content
 */
export async function fetchRawUSFM({
  languageId,
  resourceId,
  bookId,
  manifest,
  organization = "unfoldingWord",
}) {
  try {
    // Find the project for this book in the manifest
    const project = manifest.projects?.find((p) => p.identifier === bookId);
    if (!project) {
      console.warn(`Book ${bookId} not found in ${resourceId} manifest`);
      return null;
    }

    // Get the file path from the manifest
    const filePath = project.path?.replace("./", "");
    if (!filePath) {
      console.error(`No file path found for ${bookId} in ${resourceId} manifest`);
      return null;
    }

    // Fetch the raw USFM content
    const usfm = await fetchResourceFile(languageId, resourceId, filePath, organization);
    return usfm;
  } catch (error) {
    console.error(`Error fetching raw USFM for ${bookId} from ${resourceId}:`, error);
    return null;
  }
}

/**
 * Fetches and parses a scripture book
 * @param {object} params
 * @param {string} params.languageId - Language identifier (e.g., 'en')
 * @param {string} params.resourceId - Resource identifier (e.g., 'ult', 'ust')
 * @param {string} params.bookId - Book identifier (e.g., 'gen')
 * @param {object} params.manifest - Resource manifest
 * @param {string} params.organization - Organization identifier (e.g., 'unfoldingWord')
 * @returns {Promise<object>} Parsed chapters object
 */
export async function fetchBook({
  languageId,
  resourceId,
  bookId,
  manifest,
  organization = "unfoldingWord",
}) {
  try {
    // Find the project for this book in the manifest
    const project = manifest.projects?.find((p) => p.identifier === bookId);
    if (!project) {
      console.warn(`Book ${bookId} not found in ${resourceId} manifest`);
      return null;
    }

    // Get the file path from the manifest
    const filePath = project.path?.replace("./", "");
    if (!filePath) {
      console.error(`No file path found for ${bookId} in ${resourceId} manifest`);
      return null;
    }

    // Fetch the USFM content
    const usfm = await fetchResourceFile(languageId, resourceId, filePath, organization);

    // Parse USFM to JSON
    const json = parseUSFM(usfm);

    // Return chapters object
    return json?.chapters || null;
  } catch (error) {
    console.error(`Error fetching book ${bookId} from ${resourceId}:`, error);
    return null;
  }
}

/**
 * Fetches multiple scripture resources for a given reference
 * @param {object} params
 * @param {string} params.languageId - Language identifier
 * @param {object} params.reference - Reference object { bookId, chapter, verse }
 * @param {object} params.manifests - Object containing all loaded manifests
 * @param {string} params.organization - Organization identifier (e.g., 'unfoldingWord')
 * @returns {Promise<object>} Object with all fetched resources
 */
export async function fetchScriptureResources({
  languageId,
  reference,
  manifests,
  organization = "unfoldingWord",
}) {
  const { bookId } = reference;

  const resources = {
    ult: null,
    ust: null,
    ulb: null,
    udb: null,
    irv: null,
  };

  // Fetch all available scripture resources in parallel
  const resourceIds = Object.keys(resources);
  const promises = resourceIds.map(async (resourceId) => {
    if (manifests[resourceId]) {
      return fetchBook({
        languageId,
        resourceId,
        bookId,
        manifest: manifests[resourceId],
        organization,
      });
    }
    return null;
  });

  const results = await Promise.all(promises);

  // Map results back to resources object
  resourceIds.forEach((resourceId, index) => {
    if (results[index]) {
      resources[resourceId] = {
        manifest: manifests[resourceId],
        data: results[index],
      };
    }
  });

  return resources;
}

/**
 * Determines which testament a book belongs to
 * @param {string} bookId - Book identifier
 * @param {object} uhbManifest - UHB (Hebrew) manifest
 * @param {object} ugntManifest - UGNT (Greek) manifest
 * @returns {string|null} 'old' or 'new' or null
 */
export function whichTestament({ bookId, uhbManifest, ugntManifest }) {
  if (uhbManifest?.projects?.find((p) => p.identifier === bookId)) {
    return "old";
  }
  if (ugntManifest?.projects?.find((p) => p.identifier === bookId)) {
    return "new";
  }
  return null;
}

/**
 * Fetches the original language scripture (Hebrew or Greek)
 * @param {object} params
 * @param {string} params.languageId - Language identifier
 * @param {string} params.bookId - Book identifier
 * @param {object} params.uhbManifest - UHB manifest
 * @param {object} params.ugntManifest - UGNT manifest
 * @returns {Promise<object>} Parsed chapters object
 */
export async function fetchOriginalBook({ languageId, bookId, uhbManifest, ugntManifest }) {
  const testament = whichTestament({ bookId, uhbManifest, ugntManifest });

  if (testament === "old" && uhbManifest) {
    return fetchBook({
      languageId: "hbo", // Hebrew
      resourceId: "uhb",
      bookId,
      manifest: uhbManifest,
    });
  }

  if (testament === "new" && ugntManifest) {
    return fetchBook({
      languageId: "grc", // Greek
      resourceId: "ugnt",
      bookId,
      manifest: ugntManifest,
    });
  }

  return null;
}

/**
 * Gets a specific verse from parsed chapters data
 * @param {object} chapters - Parsed chapters object
 * @param {string|number} chapter - Chapter number
 * @param {string|number} verse - Verse number
 * @returns {object|null} Verse data or null
 */
export function getVerse(chapters, chapter, verse) {
  if (!chapters) return null;

  const chapterData = chapters[String(chapter)];
  if (!chapterData) return null;

  return chapterData[String(verse)] || null;
}
