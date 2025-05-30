import { TranslationWord } from '../types';

describe('tW module scaffolding', () => {
  it('should have a TranslationWord type defined', () => {
    const example: TranslationWord = { reference: 'GEN 1:1', word: 'God', definition: 'Creator of the heavens and the earth' };
    expect(example.reference).toBe('GEN 1:1');
  });
});