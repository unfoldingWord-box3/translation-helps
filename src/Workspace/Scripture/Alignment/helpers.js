
export const index = ({data}) => {
  if (!data) return {};
  console.time('indexing');
  let lemmaIndex = {};
  const chapterKeys = Object.keys(data);
  chapterKeys.forEach(chapterKey => {
    const chapter = data[chapterKey];
    const verseKeys = Object.keys(chapter);
    verseKeys.forEach(verseKey => {
      const verse = chapter[verseKey];
      const {verseObjects} = verse;
      verseObjects.forEach(verseObject => {
        const originalWords = getWords({verseObject});
        originalWords.forEach(originalWord => {
          const {lemma, strong} = originalWord;
          const entry = {
            reference: {chapter: chapterKey, verse: verseKey},
            alignment: verseObject,
            strong,
          };
          if (!lemmaIndex[lemma]) lemmaIndex[lemma] = [];
          lemmaIndex[lemma].push(entry);
        })
      });
    });
  });
  console.timeEnd('indexing');
  return lemmaIndex;
};

export const getWords = ({verseObject, originalWords=[]}) => {
  if (verseObject.type === 'milestone') {
    let originalWord = JSON.parse(JSON.stringify(verseObject));
    delete originalWord.children;
    originalWords.push(originalWord);
    const {children} = verseObject;
    children.forEach(_verseObject => {
      getWords({verseObject: _verseObject, originalWords});
    });
  }
  return originalWords;
};
