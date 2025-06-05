import { TranslationQuestion } from '../types';

describe('tQ module scaffolding', () => {
  it('should have a TranslationQuestion type defined', () => {
    const example: TranslationQuestion = { reference: 'GEN 1:1', question: 'What does this verse mean?' };
    expect(example.reference).toBe('GEN 1:1');
  });
});