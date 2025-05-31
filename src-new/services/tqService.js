/**
 * tqService.js
 * Service module for loading Translation Questions (tQ) data.
 */

import { fetchResourceFile } from './dcsClient';
import { parseTsv } from '../utils/parseTsv';

const RESOURCE_ID = 'tq';
const LANGUAGE_ID = 'en';

/**
 * Retrieves tQ entries for a given verse reference.
 * @param {string} bookId
 * @param {string|number} chapter
 * @param {string|number} verse
 * @returns {Promise<Array<Object>>}
 */
export async function getQuestionsForVerse(bookId, chapter, verse) {
  const fileName = `${bookId}.tsv`;
  const text = await fetchResourceFile(LANGUAGE_ID, RESOURCE_ID, fileName);
  const entries = parseTsv(text);
  const ref = `${bookId}/${chapter}/${verse}`;
  return entries.filter(entry => entry.Reference === ref);
}

export default { getQuestionsForVerse };