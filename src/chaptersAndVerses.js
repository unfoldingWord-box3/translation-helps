import data from './chaptersAndVerses.json';

export const chaptersInBook = bookId => {
try {
  if (!bookId || bookId === 'obs') return [...Array(50).keys()];;
  const chapters = bookData(bookId).chapters;
  return chapters;
} catch {debugger}
}

export const versesInChapter = (bookId, chapter) => {
  const verses = chaptersInBook([chapter - 1]);
  return verses;
}

export const bookData = bookId => {
  const _bookData = data.filter(row => row.id === bookId)[0];
  return _bookData;
}
