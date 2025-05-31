import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getNotesForVerse } from './tnService';
import * as dcsClient from './dcsClient';

beforeEach(() => {
  vi.spyOn(dcsClient, 'fetchResourceFile');
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('getNotesForVerse', () => {
  const sampleTsv = [
    'Reference\tNote',
    'gen/1/1\tFirst note',
    'gen/1/2\tSecond note',
  ].join('\n');

  it('fetches and filters notes correctly', async () => {
    dcsClient.fetchResourceFile.mockResolvedValue(sampleTsv);
    const notes = await getNotesForVerse('gen', '1', '1');
    expect(dcsClient.fetchResourceFile).toHaveBeenCalledWith('en', 'tn', 'gen.tsv');
    expect(notes).toEqual([{ Reference: 'gen/1/1', Note: 'First note' }]);
  });
});