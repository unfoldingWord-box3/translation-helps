/**
 * tqService.js
 * Service module for loading Translation Questions (tQ) data.
 */

import { fetchResourceFile } from "./dcsClient";
import { parseTsv } from "../utils/parseTsv";

const RESOURCE_ID = "tq";

/**
 * Retrieves tQ entries for a given verse reference.
 * Handles both Reference format ("gen/1/1") and Chapter/Verse format.
 * @param {string} bookId
 * @param {string|number} chapter
 * @param {string|number} verse
 * @param {string} [organization="unfoldingWord"] Organization name
 * @param {string} [languageId="en"] Language code
 * @param {string} [customFilePath] - Optional custom file path from manifest
 * @returns {Promise<Array<Object>>}
 */
export async function getQuestionsForVerse(
  bookId,
  chapter,
  verse,
  organization = "unfoldingWord",
  languageId = "en",
  customFilePath = null
) {
  try {
    console.log(`Loading tQ for ${organization}/${languageId}_tq ${bookId} ${chapter}:${verse}`);

    // Use custom file path if provided, otherwise default to bookId.tsv
    const fileName = customFilePath || `${bookId}.tsv`;
    const text = await fetchResourceFile(languageId, RESOURCE_ID, fileName, organization);

    if (!text || text.trim() === "") {
      console.warn(`Empty tQ file content for ${fileName}`);
      return [];
    }

    const entries = parseTsv(text);
    console.log(`Parsed ${entries.length} tQ entries from ${fileName}`);

    // Debug: Log first few entries to understand data structure
    if (entries.length > 0) {
      console.log("Sample tQ entries:", JSON.stringify(entries.slice(0, 3), null, 2));
      console.log("Available fields:", JSON.stringify(Object.keys(entries[0] || {})));
      console.log("Looking for reference:", `${bookId}/${chapter}/${verse}`);
    }

    if (entries.length === 0) {
      return [];
    }

    // Try multiple filtering approaches for compatibility
    let filteredEntries = [];

    // Approach 1: Reference field format "bookId/chapter/verse" (e.g., "gen/1/1")
    const fullRef = `${bookId}/${chapter}/${verse}`;
    filteredEntries = entries.filter((entry) => entry.Reference === fullRef);

    // Approach 2: Reference field format "chapter:verse" (e.g., "1:1")
    if (filteredEntries.length === 0) {
      const shortRef = `${chapter}:${verse}`;
      filteredEntries = entries.filter((entry) => entry.Reference === shortRef);
      console.log(`Trying short reference format: ${shortRef}`);
    }

    // Approach 3: Separate Chapter/Verse fields
    if (filteredEntries.length === 0) {
      filteredEntries = entries.filter((entry) => {
        const entryChapter = String(entry.Chapter).trim();
        const entryVerse = String(entry.Verse).trim();
        const targetChapter = String(chapter).trim();
        const targetVerse = String(verse).trim();
        return entryChapter === targetChapter && entryVerse === targetVerse;
      });
      console.log(`Trying Chapter/Verse fields: ${chapter}/${verse}`);
    }

    console.log(`Found ${filteredEntries.length} tQ entries for ${bookId} ${chapter}:${verse}`);

    // Normalize the output format
    return filteredEntries
      .map((entry, index) => ({
        id: index,
        question: entry.Question || "",
        answer: entry.Response || entry.Answer || "",
        // Keep original fields for debugging
        _original: entry,
      }))
      .filter((q) => q.question);
  } catch (error) {
    console.error(
      `Error loading tQ for ${organization}/${languageId}_tq ${bookId} ${chapter}:${verse}:`,
      error
    );
    throw new Error(`Failed to load translation questions: ${error.message}`);
  }
}

export default { getQuestionsForVerse };
