import { getLinksForVerse } from './twlService';

beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.resetAllMocks();
});

const sampleTsv = [
  'Reference\tOrigWords\tQuote\tOccurrence\tTWLink',
  'gen/1/1\t\tGod\t1\trc://en/tw/dict/bible/kt/create',
  'gen/1/2\t\tbeginning\t1\trc://en/tw/dict/bible/kt/begin',
].join('\n');

test('getLinksForVerse fetches and filters links correctly', async () => {
  fetch.mockResolvedValue({
    ok: true,
    text: () => Promise.resolve(sampleTsv),
  });
  const links = await getLinksForVerse('gen', '1', '1');
  expect(links).toEqual(['rc://en/tw/dict/bible/kt/create']);
  expect(fetch).toHaveBeenCalledTimes(1);
  expect(fetch).toHaveBeenCalledWith(
    'https://git.door43.org/unfoldingWord/en_twl/raw/branch/master/gen.tsv'
  );
});

test('getLinksForVerse returns empty array for no matches', async () => {
  fetch.mockResolvedValue({
    ok: true,
    text: () => Promise.resolve(sampleTsv),
  });
  const links = await getLinksForVerse('gen', '2', '1');
  expect(links).toEqual([]);
});

test('getLinksForVerse throws when response not ok', async () => {
  fetch.mockResolvedValue({
    ok: false,
    statusText: 'Not Found',
  });
  await expect(getLinksForVerse('gen', '1', '1')).rejects.toThrow(
    /Failed to load TWL file for gen: Not Found/
  );
});