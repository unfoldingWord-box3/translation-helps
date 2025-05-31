import { describe, it, expect } from 'vitest';
import { escapeTsvValue, buildTsv } from './tsvUtils';

describe('escapeTsvValue', () => {
  it('replaces tabs and newlines with spaces', () => {
    expect(escapeTsvValue('a\tb\nc')).toBe('a b c');
    expect(escapeTsvValue(null)).toBe('');
  });
});

describe('buildTsv', () => {
  const rows = [{ A: '1', B: '2' }, { A: 'x\ty', B: 'z\nw' }];
  it('builds TSV with escaped values', () => {
    const expected = 'A\tB\n1\t2\nx y\tz w';
    expect(buildTsv(rows)).toBe(expected);
  });
  it('returns empty string for empty rows', () => {
    expect(buildTsv([], ['A', 'B'])).toBe('');
  });
});