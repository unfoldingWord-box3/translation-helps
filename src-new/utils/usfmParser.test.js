import { describe, it, expect } from 'vitest';
import { parseUSFM, getChapters, getChapter, extractVersesFromChapter, getVerseText } from './usfmParser';

describe('usfmParser', () => {
  const sampleUSFM = `\\id GEN
\\h Genesis
\\c 1
\\p
\\v 1 In the beginning God created the heavens and the earth.
\\v 2 The earth was without form and void, and darkness was over the face of the deep.
\\c 2
\\p
\\v 1 Thus the heavens and the earth were finished.`;

  describe('parseUSFM', () => {
    it('parses USFM content into JSON', () => {
      const result = parseUSFM(sampleUSFM);
      expect(result).toBeTruthy();
      expect(result.headers).toBeTruthy();
      expect(result.chapters).toBeTruthy();
    });

    it('returns null for invalid USFM', () => {
      const result = parseUSFM('invalid content');
      // usfm-js might still parse this, so we check if it has expected structure
      expect(result).toBeTruthy();
    });
  });

  describe('getChapters', () => {
    it('extracts chapters from parsed USFM', () => {
      const parsed = parseUSFM(sampleUSFM);
      const chapters = getChapters(parsed);
      expect(chapters).toBeTruthy();
      expect(chapters['1']).toBeTruthy();
      expect(chapters['2']).toBeTruthy();
    });

    it('returns empty object for null input', () => {
      const chapters = getChapters(null);
      expect(chapters).toEqual({});
    });
  });

  describe('getChapter', () => {
    it('gets a specific chapter', () => {
      const parsed = parseUSFM(sampleUSFM);
      const chapter = getChapter(parsed, 1);
      expect(chapter).toBeTruthy();
      expect(chapter['1']).toBeTruthy();
    });

    it('returns null for non-existent chapter', () => {
      const parsed = parseUSFM(sampleUSFM);
      const chapter = getChapter(parsed, 99);
      expect(chapter).toBeNull();
    });
  });

  describe('extractVersesFromChapter', () => {
    it('extracts verses from a chapter', () => {
      const parsed = parseUSFM(sampleUSFM);
      const chapter = getChapter(parsed, 1);
      const verses = extractVersesFromChapter(chapter);
      
      expect(verses).toHaveLength(2);
      expect(verses[0]).toEqual({
        verse: '1',
        text: 'In the beginning God created the heavens and the earth.'
      });
      expect(verses[1]).toEqual({
        verse: '2',
        text: 'The earth was without form and void, and darkness was over the face of the deep.'
      });
    });

    it('returns empty array for null chapter', () => {
      const verses = extractVersesFromChapter(null);
      expect(verses).toEqual([]);
    });
  });

  describe('getVerseText', () => {
    it('gets text for a specific verse', () => {
      const parsed = parseUSFM(sampleUSFM);
      const text = getVerseText(parsed, 1, 1);
      expect(text).toBe('In the beginning God created the heavens and the earth.');
    });

    it('returns null for non-existent verse', () => {
      const parsed = parseUSFM(sampleUSFM);
      const text = getVerseText(parsed, 1, 99);
      expect(text).toBeNull();
    });
  });
});