/**
 * tnService.js
 * Service module for loading Translation Notes (tN) data.
 */

import { fetchResourceFile } from './dcsClient';
import { parseTsv } from '../utils/parseTsv';

const RESOURCE_ID = 'tn';
const LANGUAGE_ID = 'en';

/**
 * Retrieves tN entries for a given verse reference.
 * @param {string} bookId
 * @param {string|number} chapter
 * @param {string|number} verse
 * @returns {Promise<Array<Object>>}
 */
export async function getNotesForVerse(bookId, chapter, verse) {
  const fileName = `${bookId}.tsv`;
  const text = await fetchResourceFile(LANGUAGE_ID, RESOURCE_ID, fileName);
  const entries = parseTsv(text);
  const ref = `${bookId}/${chapter}/${verse}`;
  return entries.filter(entry => entry.Reference === ref);
}

export default { getNotesForVerse };