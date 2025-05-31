import { describe, it, expect } from 'vitest';
import { groupByVerse } from './groupByVerse';

describe('groupByVerse', () => {
  it('groups rows by Reference', () => {
    const rows = [
      { Reference: 'gen/1/1', Note: 'a' },
      { Reference: 'gen/1/2', Note: 'b' },
      { Reference: 'gen/1/1', Note: 'c' },
    ];
    const grouped = groupByVerse(rows);
    expect(grouped).toEqual({
      'gen/1/1': [
        { Reference: 'gen/1/1', Note: 'a' },
        { Reference: 'gen/1/1', Note: 'c' },
      ],
      'gen/1/2': [{ Reference: 'gen/1/2', Note: 'b' }],
    });
  });
});