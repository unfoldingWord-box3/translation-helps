import { fetchResourceFile } from './dcsClient';
import { parseTsv } from '../utils/parseTsv';

const RESOURCE_ID = 'tq';
const LANGUAGE_ID = 'en';

/**
 * Retrieves tQ entries for a given verse reference.
 * @param bookId Bible book identifier (e.g., 'gen').
 * @param chapter Chapter number or string.
 * @param verse Verse number or string.
 * @returns Array of parsed tQ entries matching the verse.
 */
export async function getQuestionsForVerse(
  bookId: string,
  chapter: string | number,
  verse: string | number
): Promise<Record<string, string>[]> {
  const fileName = `${bookId}.tsv`;
  const text = await fetchResourceFile(LANGUAGE_ID, RESOURCE_ID, fileName);
  const entries = parseTsv(text);
  const ref = `${bookId}/${chapter}/${verse}`;
  return entries.filter(entry => entry.Reference === ref);
}

export default { getQuestionsForVerse };