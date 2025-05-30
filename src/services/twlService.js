/**
 * Service module for loading and querying Translation Words Links (TWL) data.
 *
 * Loads TWL .tsv files from the en_twl DCS repository, parses them, and exposes
 * an API to retrieve TWLinks for a given verse reference.
 */
const BASE_URL = 'https://git.door43.org/unfoldingWord/en_twl/raw/branch/master';

// In-memory cache for parsed TWL entries by bookId.
const cache = {};

/**
 * Parses a TSV string into an array of entry objects keyed by header row.
 * @param {string} text Raw TSV content.
 * @returns {Array<Object>} Parsed rows as objects.
 */
function parseTsv(text) {
  const lines = text.split(/\r?\n/).filter(line => line.trim() && !line.startsWith('#'));
  if (lines.length === 0) return [];
  const [headerLine, ...rows] = lines;
  const headers = headerLine.split('\t');
  return rows.map(line => {
    const cols = line.split('\t');
    const entry = {};
    headers.forEach((h, i) => {
      entry[h] = cols[i] || '';
    });
    return entry;
  });
}

/**
 * Retrieves the array of TWLink URIs for a given verse reference.
 * @param {string} bookId Bible book identifier (e.g., 'gen').
 * @param {string|number} chapter Chapter number.
 * @param {string|number} verse Verse number.
 * @returns {Promise<Array<string>>} Array of TWLink values (raw rc:// URIs).
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

export default {
  getLinksForVerse,
};