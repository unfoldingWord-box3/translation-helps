import { useQuery } from '@tanstack/react-query';
import { getNotesForVerse } from '../../services/tnService';

/**
 * Hook to retrieve Translation Notes (tN) entries for a verse.
 * @param bookId Bible book identifier.
 * @param chapter Chapter number or string.
 * @param verse Verse number or string.
 */
export function useTranslationNotes(
  bookId: string,
  chapter: string | number,
  verse: string | number
) {
  return useQuery(
    ['tn', bookId, chapter, verse],
    () => getNotesForVerse(bookId, chapter, verse)
  );
}