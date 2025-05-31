/**
 * usfmParser.js
 * Utility for parsing USFM content using usfm-js library
 */
import usfmjs from 'usfm-js';

/**
 * Parses USFM content and returns structured JSON
 * @param {string} usfm - Raw USFM content
 * @returns {object} Parsed USFM as JSON with chapters structure
 */
export function parseUSFM(usfm) {
  try {
    const json = usfmjs.toJSON(usfm);
    return json;
  } catch (error) {
    console.error('Error parsing USFM:', error);
    return null;
  }
}

/**
 * Extracts chapters from parsed USFM JSON
 * @param {object} parsedUSFM - Parsed USFM JSON object
 * @returns {object} Chapters object
 */
export function getChapters(parsedUSFM) {
  return parsedUSFM?.chapters || {};
}

/**
 * Gets a specific chapter from parsed USFM
 * @param {object} parsedUSFM - Parsed USFM JSON object
 * @param {string|number} chapterNumber - Chapter number to retrieve
 * @returns {object|null} Chapter data or null if not found
 */
export function getChapter(parsedUSFM, chapterNumber) {
  const chapters = getChapters(parsedUSFM);
  return chapters[String(chapterNumber)] || null;
}

/**
 * Extracts verses from a chapter with proper formatting
 * @param {object} chapter - Chapter object from parsed USFM
 * @returns {Array} Array of verse objects with number and text
 */
export function extractVersesFromChapter(chapter) {
  if (!chapter) return [];
  
  const verses = [];
  let currentVerse = null;
  let currentText = '';
  
  // Process all content in the chapter
  Object.entries(chapter).forEach(([key, value]) => {
    if (key === 'front') return; // Skip front matter
    
    if (key.match(/^\d+$/)) {
      // This is a verse number
      if (currentVerse !== null) {
        verses.push({
          verse: String(currentVerse),
          text: currentText.trim()
        });
      }
      currentVerse = key;
      currentText = '';
      
      // Process verse content
      if (value.verseObjects) {
        currentText = processVerseObjects(value.verseObjects);
      }
    }
  });
  
  // Add the last verse
  if (currentVerse !== null) {
    verses.push({
      verse: String(currentVerse),
      text: currentText.trim()
    });
  }
  
  return verses;
}

/**
 * Processes verse objects to extract text content
 * @param {Array} verseObjects - Array of verse objects from USFM parser
 * @returns {string} Concatenated text content
 */
function processVerseObjects(verseObjects) {
  let text = '';
  
  verseObjects.forEach(obj => {
    switch (obj.type) {
      case 'text':
        text += obj.text || '';
        break;
      case 'word':
        text += obj.text || obj.content || '';
        break;
      case 'milestone':
        // Milestones often contain aligned text in their children
        if (obj.children) {
          text += processVerseObjects(obj.children);
        }
        break;
      case 'quote':
        // Handle quotes
        if (obj.children) {
          text += processVerseObjects(obj.children);
        }
        break;
      default:
        // Handle other types as needed
        if (obj.text) {
          text += obj.text;
        } else if (obj.content) {
          text += obj.content;
        } else if (obj.children) {
          text += processVerseObjects(obj.children);
        }
    }
  });
  
  return text;
}

/**
 * Gets formatted text for a specific verse
 * @param {object} parsedUSFM - Parsed USFM JSON object
 * @param {string|number} chapterNumber - Chapter number
 * @param {string|number} verseNumber - Verse number
 * @returns {string|null} Verse text or null if not found
 */
export function getVerseText(parsedUSFM, chapterNumber, verseNumber) {
  const chapter = getChapter(parsedUSFM, chapterNumber);
  if (!chapter) return null;
  
  const verse = chapter[String(verseNumber)];
  if (!verse || !verse.verseObjects) return null;
  
  return processVerseObjects(verse.verseObjects).trim();
}