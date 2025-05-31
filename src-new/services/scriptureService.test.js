import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchBook, fetchScriptureResources, whichTestament, fetchOriginalBook } from './scriptureService';
import * as dcsClient from './dcsClient';
import * as usfmParser from '../utils/usfmParser';

// Mock dependencies
vi.mock('./dcsClient');
vi.mock('../utils/usfmParser');

describe('scriptureService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchBook', () => {
    it('fetches and parses a book successfully', async () => {
      const mockManifest = {
        projects: [
          { identifier: 'gen', path: './01-GEN.usfm' }
        ]
      };
      
      const mockUSFM = '\\c 1\\n\\v 1 In the beginning...';
      const mockParsedUSFM = {
        chapters: {
          '1': { '1': { verseObjects: [{ type: 'text', text: 'In the beginning...' }] } }
        }
      };
      
      dcsClient.fetchResourceFile.mockResolvedValue(mockUSFM);
      usfmParser.parseUSFM.mockReturnValue(mockParsedUSFM);
      
      const result = await fetchBook({
        languageId: 'en',
        resourceId: 'ult',
        bookId: 'gen',
        manifest: mockManifest
      });
      
      expect(dcsClient.fetchResourceFile).toHaveBeenCalledWith('en', 'ult', '01-GEN.usfm');
      expect(usfmParser.parseUSFM).toHaveBeenCalledWith(mockUSFM);
      expect(result).toEqual(mockParsedUSFM.chapters);
    });

    it('returns null when book is not found in manifest', async () => {
      const mockManifest = {
        projects: [
          { identifier: 'exo', path: './02-EXO.usfm' }
        ]
      };
      
      const result = await fetchBook({
        languageId: 'en',
        resourceId: 'ult',
        bookId: 'gen',
        manifest: mockManifest
      });
      
      expect(result).toBeNull();
      expect(dcsClient.fetchResourceFile).not.toHaveBeenCalled();
    });

    it('handles errors gracefully', async () => {
      const mockManifest = {
        projects: [
          { identifier: 'gen', path: './01-GEN.usfm' }
        ]
      };
      
      dcsClient.fetchResourceFile.mockRejectedValue(new Error('Network error'));
      
      const result = await fetchBook({
        languageId: 'en',
        resourceId: 'ult',
        bookId: 'gen',
        manifest: mockManifest
      });
      
      expect(result).toBeNull();
    });
  });

  describe('whichTestament', () => {
    it('returns "old" for Old Testament books', () => {
      const uhbManifest = {
        projects: [{ identifier: 'gen' }, { identifier: 'exo' }]
      };
      const ugntManifest = {
        projects: [{ identifier: 'mat' }, { identifier: 'mrk' }]
      };
      
      const result = whichTestament({ bookId: 'gen', uhbManifest, ugntManifest });
      expect(result).toBe('old');
    });

    it('returns "new" for New Testament books', () => {
      const uhbManifest = {
        projects: [{ identifier: 'gen' }, { identifier: 'exo' }]
      };
      const ugntManifest = {
        projects: [{ identifier: 'mat' }, { identifier: 'mrk' }]
      };
      
      const result = whichTestament({ bookId: 'mat', uhbManifest, ugntManifest });
      expect(result).toBe('new');
    });

    it('returns null for unknown books', () => {
      const uhbManifest = {
        projects: [{ identifier: 'gen' }]
      };
      const ugntManifest = {
        projects: [{ identifier: 'mat' }]
      };
      
      const result = whichTestament({ bookId: 'unknown', uhbManifest, ugntManifest });
      expect(result).toBeNull();
    });
  });

  describe('fetchScriptureResources', () => {
    it('fetches multiple resources in parallel', async () => {
      const mockManifests = {
        ult: { projects: [{ identifier: 'gen', path: './01-GEN.usfm' }] },
        ust: { projects: [{ identifier: 'gen', path: './01-GEN.usfm' }] },
        ulb: null,
        udb: null,
        irv: null
      };
      
      const mockUSFM = '\\c 1\\n\\v 1 In the beginning...';
      const mockParsedUSFM = {
        chapters: {
          '1': { '1': { verseObjects: [{ type: 'text', text: 'In the beginning...' }] } }
        }
      };
      
      dcsClient.fetchResourceFile.mockResolvedValue(mockUSFM);
      usfmParser.parseUSFM.mockReturnValue(mockParsedUSFM);
      
      const result = await fetchScriptureResources({
        languageId: 'en',
        reference: { bookId: 'gen', chapter: '1', verse: '1' },
        manifests: mockManifests
      });
      
      expect(result.ult).toEqual({ manifest: mockManifests.ult, data: mockParsedUSFM.chapters });
      expect(result.ust).toEqual({ manifest: mockManifests.ust, data: mockParsedUSFM.chapters });
      expect(result.ulb).toBeNull();
      expect(result.udb).toBeNull();
      expect(result.irv).toBeNull();
    });
  });
});