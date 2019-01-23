
export const taggedWords = ({verseObjects}) => {
  if (!verseObjects) return [];
  const wordLinks = verseObjects
  .filter(verseObject => verseObject.tw)
  .map(verseObject => {
    let originalWords = [];
    if (verseObject.type === 'word') originalWords.push(verseObject);
    if (verseObject.children) originalWords = originalWords.concat(verseObject.children);
    let wordObject = {
      link: verseObject.tw,
      originalWords,
    };
    return wordObject;
  });
  return wordLinks;
};
