/**
 * twlService.js
 * Service module for loading and querying Translation Words Links (TWL) data.
 *
 * Responsible for:
 * - Fetching and caching TWL .tsv files from DCS
 * - Parsing TSV into entries
 * - Filtering and returning TWLink URIs for a given verse reference
 */
import { parseTsv } from '../utils/parseTsv';

const BASE_URL = 'https://git.door43.org/unfoldingWord/en_twl/raw/branch/master';
const cache = {};

/**
 * Retrieves the array of TWLink URIs for a given verse reference.
 * @param {string} bookId Bible book identifier (e.g., 'gen').
 * @param {string|number} chapter Chapter number.
 * @param {string|number} verse Verse number.
 * @returns {Promise<Array<string>>} Array of TWLink values (rc:// URIs).
 */
export async function getLinksForVerse(bookId, chapter, verse) {
  const ref = `${bookId}/${chapter}/${verse}`;
  let entries = cache[bookId];
  if (!entries) {
    const url = `${BASE_URL}/${bookId}.tsv`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to load TWL file for ${bookId}: ${response.statusText}`);
    }
    const text = await response.text();
    entries = parseTsv(text);
    cache[bookId] = entries;
  }
  return entries
    .filter(entry => entry.Reference === ref)
    .map(entry => entry.TWLink);
}

export default { getLinksForVerse };