/**
 * twlService.js
 * Service module for loading and querying Translation Words Links (TWL) data.
 *
 * Responsible for:
 * - Fetching and caching TWL .tsv files from DCS using manifest
 * - Parsing TSV into entries
 * - Filtering and returning TWLink URIs for a given verse reference
 */
import { parseTsv } from "../utils/parseTsv";
import { fetchResourceFile } from "./dcsClient";

const cache = {};

/**
 * Retrieves the array of TWLink URIs for a given verse reference.
 * @param {string} bookId Bible book identifier (e.g., 'gen').
 * @param {string|number} chapter Chapter number.
 * @param {string|number} verse Verse number.
 * @param {object} twlManifest TWL manifest containing project information.
 * @returns {Promise<Array<string>>} Array of TWLink values (rc:// URIs).
 */
export async function getLinksForVerse(bookId, chapter, verse, twlManifest) {
  if (!twlManifest) {
    throw new Error("TWL manifest is required");
  }

  const ref = `${chapter}:${verse}`;
  let entries = cache[bookId];

  if (!entries) {
    try {
      // Find the project for this book in the manifest
      const project = twlManifest.projects?.find((p) => p.identifier === bookId);
      if (!project) {
        throw new Error(`Book ${bookId} not found in TWL manifest`);
      }

      // Get the TSV file path from the manifest
      const filePath = project.path?.replace("./", "");
      if (!filePath) {
        throw new Error(`No file path found for ${bookId} in TWL manifest`);
      }

      // Fetch the TSV content using dcsClient
      const tsvContent = await fetchResourceFile("en", "twl", filePath);

      // Parse the TSV data
      entries = parseTsv(tsvContent);
      cache[bookId] = entries;
    } catch (error) {
      console.error(`Error loading TWL for book ${bookId}:`, error);
      throw error;
    }
  }

  // Filter entries for this verse and get unique TWLinks to avoid duplicates
  const links = entries
    .filter((entry) => entry.Reference === ref)
    .map((entry) => entry.TWLink)
    .filter(Boolean); // Remove any null/undefined links

  // Remove duplicates at the TWL level
  return [...new Set(links)];
}

export default { getLinksForVerse };

/**
 * Clears the internal TWL cache (for testing or reloading purposes).
 */
export function clearCache() {
  Object.keys(cache).forEach((key) => {
    delete cache[key];
  });
}
