import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as yaml from 'yaml';
import { fetchManifest, fetchResourceFile } from './dcsClient';

beforeEach(() => {
  global.fetch = vi.fn();
  vi.spyOn(yaml, 'parse');
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('dcsClient', () => {
  it('fetches and parses manifest.yaml correctly', async () => {
    const sampleYaml = 'key: value';
    (fetch as unknown as vi.Mock).mockResolvedValue({ ok: true, text: () => Promise.resolve(sampleYaml) });
    (yaml.parse as unknown as vi.Mock).mockReturnValue({ key: 'value' });

    const manifest = await fetchManifest('en', 'tn');
    expect(yaml.parse).toHaveBeenCalledWith(sampleYaml);
    expect(manifest).toEqual({ key: 'value' });
    expect(fetch).toHaveBeenCalledWith(
      'https://git.door43.org/unfoldingWord/en_tn/raw/branch/master/manifest.yaml'
    );
  });

  it('throws when manifest fetch fails', async () => {
    (fetch as unknown as vi.Mock).mockResolvedValue({ ok: false, statusText: 'Not Found' });
    await expect(fetchManifest('en', 'tn')).rejects.toThrow(
      /Failed to load manifest for en_tn: Not Found/
    );
  });

  it('fetches resource file correctly', async () => {
    (fetch as unknown as vi.Mock).mockResolvedValue({ ok: true, text: () => Promise.resolve('data') });
    const data = await fetchResourceFile('en', 'tn', 'gen.tsv');
    expect(data).toBe('data');
    expect(fetch).toHaveBeenCalledWith(
      'https://git.door43.org/unfoldingWord/en_tn/raw/branch/master/gen.tsv'
    );
  });

  it('throws when resource file fetch fails', async () => {
    (fetch as unknown as vi.Mock).mockResolvedValue({ ok: false, statusText: 'Error' });
    await expect(fetchResourceFile('en', 'tn', 'gen.tsv')).rejects.toThrow(
      /Failed to load gen.tsv for en_tn: Error/
    );
  });
});