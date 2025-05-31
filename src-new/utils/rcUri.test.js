import { describe, it, expect } from 'vitest';
import { parseRcUri } from './rcUri';

describe('parseRcUri', () => {
  it('parses valid rcUri into segments', () => {
    const uri = 'rc://en/tw/dict/bible/kt/create';
    expect(parseRcUri(uri)).toEqual({
      segments: ['en', 'tw', 'dict', 'bible', 'kt', 'create'],
    });
  });
  it('returns null for invalid uri', () => {
    expect(parseRcUri('http://example.com')).toBeNull();
    expect(parseRcUri(null)).toBeNull();
  });
});