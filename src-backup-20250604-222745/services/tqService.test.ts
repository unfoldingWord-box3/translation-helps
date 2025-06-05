import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as dcsClient from './dcsClient';
import { getQuestionsForVerse } from './tqService';

beforeEach(() => {
  vi.spyOn(dcsClient, 'fetchResourceFile');
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('getQuestionsForVerse', () => {
  const sampleTsv = [
    'Reference\tQuestion',
    'gen/1/1\tWhy was...',
    'gen/1/2\tWhat did...',
  ].join('\n');

  it('fetches and filters questions correctly', async () => {
    (dcsClient.fetchResourceFile as unknown as vi.Mock).mockResolvedValue(sampleTsv);
    const questions = await getQuestionsForVerse('gen', 1, 1);
    expect(dcsClient.fetchResourceFile).toHaveBeenCalledWith('en', 'tq', 'gen.tsv');
    expect(questions).toEqual([{ Reference: 'gen/1/1', Question: 'Why was...' }]);
  });
});