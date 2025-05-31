import { useQuery } from '@tanstack/react-query';
import { getQuestionsForVerse } from '../../services/tqService';

/**
 * Hook to retrieve Translation Questions (tQ) entries for a verse.
 * @param bookId Bible book identifier.
 * @param chapter Chapter number or string.
 * @param verse Verse number or string.
 */
export function useTranslationQuestions(
  bookId: string,
  chapter: string | number,
  verse: string | number
) {
  return useQuery(
    ['tq', bookId, chapter, verse],
    () => getQuestionsForVerse(bookId, chapter, verse)
  );
}