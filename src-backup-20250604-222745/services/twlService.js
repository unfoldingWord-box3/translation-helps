/**
 * Service module for loading and querying Translation Words Links (TWL) data.
 *
 * Loads TWL .tsv files from the en_twl DCS repository, parses them, and exposes
 * an API to retrieve TWLinks for a given verse reference.
 */

import { fetchResourceFile } from './dcsClient';
import { parseTsv } from '../utils/parseTsv';

const RESOURCE_ID = 'twl';
const LANGUAGE_ID = 'en';

// In-memory cache for parsed TWL entries by bookId.
const cache = {};

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
    const text = await fetchResourceFile(LANGUAGE_ID, RESOURCE_ID, `${bookId}.tsv`);
    entries = parseTsv(text);
    cache[bookId] = entries;
  }
  return entries.filter(entry => entry.Reference === ref).map(entry => entry.TWLink);
}

export default {
  getLinksForVerse,
};