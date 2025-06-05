import { useTwlLinks } from '../twl/hooks';
import { useQueries } from '@tanstack/react-query';
import { fetchResourceFile } from '../../services/dcsClient';
import { parseRcUri } from '../../utils/rcUri';

/**
 * Hook to retrieve Translation Words (tW) articles for a verse via TWL links.
 * @param bookId Bible book identifier.
 * @param chapter Chapter number or string.
 * @param verse Verse number or string.
 */
export function useTranslationWords(
  bookId: string,
  chapter: string | number,
  verse: string | number
) {
  const linksQuery = useTwlLinks(bookId, chapter, verse);
  const articleQueries = useQueries({
    queries: (linksQuery.data || []).map(link => ({
      queryKey: ['tw', link],
      queryFn: async () => {
        const parsed = parseRcUri(link);
        if (!parsed) return '';
        const [, , ...path] = parsed.segments;
        const filePath = `${path.join('/')}.md`;
        return fetchResourceFile(parsed.segments[0], parsed.segments[1], filePath);
      },
    })),
  });
  const isLoading = linksQuery.isLoading || articleQueries.some(q => q.isLoading);
  const isError = linksQuery.isError || articleQueries.some(q => q.isError);
  const error = linksQuery.error || articleQueries.find(q => q.error)?.error;
  const data = articleQueries.map(q => q.data as string);
  return { data, isLoading, isError, error };
}