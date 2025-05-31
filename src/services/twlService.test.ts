import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as dcsClient from './dcsClient';
import { getLinksForVerse } from './twlService';

beforeEach(() => {
  vi.spyOn(dcsClient, 'fetchResourceFile');
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('getLinksForVerse', () => {
  const sampleTsv = [
    'Reference\tTWLink',
    'gen/1/1\trc://en/tw/dict/bible/kt/create',
    'gen/1/2\trc://en/tw/dict/bible/kt/begin',
  ].join('\n');

  it('fetches and filters links correctly', async () => {
    (dcsClient.fetchResourceFile as unknown as vi.Mock).mockResolvedValue(sampleTsv);
    const links = await getLinksForVerse('gen', '1', '1');
    expect(dcsClient.fetchResourceFile).toHaveBeenCalledWith('en', 'twl', 'gen.tsv');
    expect(links).toEqual(['rc://en/tw/dict/bible/kt/create']);
  });

  it('returns empty array for no matches', async () => {
    (dcsClient.fetchResourceFile as unknown as vi.Mock).mockResolvedValue(sampleTsv);
    const links = await getLinksForVerse('gen', '2', '1');
    expect(links).toEqual([]);
  });

  it('caches data to avoid refetching', async () => {
    (dcsClient.fetchResourceFile as unknown as vi.Mock).mockResolvedValue(sampleTsv);
    await getLinksForVerse('gen', '1', '1');
    await getLinksForVerse('gen', '1', '2');
    expect(dcsClient.fetchResourceFile).toHaveBeenCalledTimes(1);
  });

  it('throws when fetchResourceFile rejects', async () => {
    (dcsClient.fetchResourceFile as unknown as vi.Mock).mockRejectedValue(new Error('fail'));
    await expect(getLinksForVerse('gen', '1', '1')).rejects.toThrow('fail');
  });
});