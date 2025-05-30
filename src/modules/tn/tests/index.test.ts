import { TranslationNote } from '../types';

describe('tN module scaffolding', () => {
  it('should have a TranslationNote type defined', () => {
    const example: TranslationNote = { reference: 'GEN 1:1', note: 'In the beginning...' };
    expect(example.reference).toBe('GEN 1:1');
  });
});