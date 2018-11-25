import data from './chaptersAndVerses.json';

export const chaptersInBook = bookId => {
  const chapters = bookData(bookId).chapters;
  return chapters;
}

export const versesInChapter = (bookId, chapter) => {
  const verses = chaptersInBook([chapter - 1]);
  return verses;
}

export const bookData = bookId => {
  const _bookData = data.filter(row => row.id === bookId)[0];
  return _bookData;
}
