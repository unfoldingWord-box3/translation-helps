import data from './chaptersAndVerses.json';

export const chaptersInBook = ({bookId}) => {
  try {
    if (!bookId || bookId === 'obs') return [...Array(50).keys()];;
    const chapters = bookData({bookId}).chapters;
    return chapters;
  } catch {
    return null;
  }
};

export const versesInChapter = ({bookId, chapter}) => {
  const verses = chaptersInBook({bookId})[chapter - 1];
  return verses;
};

export const bookData = ({bookId}) => {
  const _bookData = data.filter(row => row.id === bookId)[0];
  return _bookData;
};

export const testament = ({bookId}) => {
  const _testament = bookData({bookId}).testament;
  return _testament;
};

export const validateBookId = (reference) => {
  let valid;
  if (reference.bookId === 'obs') {
    valid = true;
  } else if (reference.bookId && !!bookData(reference)) {
    valid = true;
  }
  return valid;
}

export const validateChapter = (reference) => {
  const dependencies = ( validateBookId(reference) );
  const chapters = chaptersInBook(reference);
  const valid = (dependencies && !!chapters[reference.chapter - 1]);
  return valid;
}

export const validateVerse = (reference) => {
  const dependencies = (validateBookId(reference) && validateChapter(reference));
  const chapters = chaptersInBook(reference);
  const verseCount = chapters[reference.chapter];
  const inRange = (verseCount && reference.verse <= verseCount);
  return (dependencies && inRange);
};

export const validateReference = ({reference}) => {
  let valid = false;
  const {bookId, chapter, verse} = reference;
  const blankReference = (!bookId && !chapter && !verse);
  const validBookId = validateBookId(reference);
  const validChapter = validateChapter(reference);
  const validVerse = validateVerse(reference);
  if (blankReference) {
    valid = true;
  } else if (validBookId && !chapter && !verse) {
    valid = true;
  } else if (validBookId && validChapter && !verse) {
    valid = true;
  } else if (validBookId && validChapter && validVerse) {
    valid = true;
  }
  return valid;
};
