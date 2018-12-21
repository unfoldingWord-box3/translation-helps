
export const textFromVerseObject = (verseObject, originalTexts=[], targetTexts=[]) => {
  const {content, text, children} = verseObject;
  if (content) originalTexts.push(content);
  if (text) targetTexts.push(text);
  if (children) {
    children.forEach(_verseObject => {
      const {_originalTexts, _targetTexts} = textFromVerseObject(_verseObject, originalTexts, targetTexts)
      originalTexts.concat(_originalTexts);
      targetTexts.concat(_targetTexts);
    });
  }
  return {
    originalTexts,
    targetTexts,
  };
};

export const flattenVerseObjects = (verseObjects) => {
  let flattenedVerseObjects = [];
  verseObjects.forEach(verseObject => {
    const _flattenedVerseObject = flattenVerseObject(verseObject);
    flattenedVerseObjects = flattenedVerseObjects.concat(_flattenedVerseObject);
  });
  return flattenedVerseObjects;
};

export const flattenVerseObject = (verseObject, verseObjects=[]) => {
  const {type, children} = verseObject;
  if (type === 'word') verseObjects.push(verseObject);
  if (children) {
    children.forEach(_verseObject => {
      const _verseObjects = flattenVerseObject(_verseObject, verseObjects)
      verseObjects = verseObjects.concat(_verseObjects);
    });
  }
  return verseObjects;
};
