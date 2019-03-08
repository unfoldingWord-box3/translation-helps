
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

export const textFromVerseObject = ({verseObject, originalTexts=[], targetTexts=[]}) => {
  const {content, text, children} = verseObject;
  if (content) originalTexts.push(content);
  if (text) targetTexts.push(text);
  if (children) {
    children.forEach(_verseObject => {
      const {_originalTexts, _targetTexts} = textFromVerseObject({verseObject: _verseObject, originalTexts, targetTexts})
      originalTexts.concat(_originalTexts);
      targetTexts.concat(_targetTexts);
    });
  }
  return {
    originalTexts,
    targetTexts,
  };
};

export const flattenVerseObjects = ({verseObjects}) => {
  let flattenedVerseObjects = [];
  verseObjects.forEach(verseObject => {
    const _flattenedVerseObject = flattenVerseObject({verseObject});
    flattenedVerseObjects = flattenedVerseObjects.concat(_flattenedVerseObject);
  });
  return flattenedVerseObjects;
};

export const flattenVerseObject = ({verseObject, verseObjects=[]}) => {
  const {type, children} = verseObject;
  if (type === 'word') verseObjects.push(verseObject);
  if (children) {
    children.forEach(_verseObject => {
      const _verseObjects = flattenVerseObject({verseObject: _verseObject, verseObjects})
      verseObjects = verseObjects.concat(_verseObjects);
    });
  }
  return verseObjects;
};
