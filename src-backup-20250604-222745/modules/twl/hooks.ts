import { useQuery } from '@tanstack/react-query';
import { getLinksForVerse } from '../../services/twlService';

/**
 * Hook to retrieve Translation Words Links (TWL) URIs for a verse.
 * @param bookId Bible book identifier.
 * @param chapter Chapter number or string.
 * @param verse Verse number or string.
 */
export function useTwlLinks(
  bookId: string,
  chapter: string | number,
  verse: string | number
) {
  return useQuery(
    ['twl', bookId, chapter, verse],
    () => getLinksForVerse(bookId, chapter, verse)
  );
}