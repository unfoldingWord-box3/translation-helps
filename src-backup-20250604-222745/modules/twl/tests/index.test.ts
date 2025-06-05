import { TwlLink } from '../types';

describe('TWL module scaffolding', () => {
  it('should have a TwlLink type defined', () => {
    const example: TwlLink = { reference: 'GEN 1:1', link: 'rc://*/twl/translate/en/overview' };
    expect(example.reference).toBe('GEN 1:1');
  });
});