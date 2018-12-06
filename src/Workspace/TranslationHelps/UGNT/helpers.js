
export const taggedWords = (verseObjects) => {
  const wordLinks = verseObjects
  .filter(verseObject => verseObject.tw)
  .map(verseObject => {
    let greekWords = [];
    if (verseObject.type === 'word') greekWords.push(verseObject);
    if (verseObject.children) greekWords = greekWords.concat(verseObject.children);
    let wordObject = {
      link: verseObject.tw,
      greekWords,
    };
    return wordObject;
  });
  return wordLinks;
};
