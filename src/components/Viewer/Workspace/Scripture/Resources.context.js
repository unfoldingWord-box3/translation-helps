import React, {
  createContext,
  useState
} from 'react';
import deepFreeze from 'deep-freeze';

import * as helpers from './helpers';

export const ResourcesContext = createContext();

export function ResourcesContextProvider({children}) {
  const [resources, setResources] = useState({});
  const [contextLoaded, setContextLoaded] = useState({});
  const [verseCountTableData, setVerseCountTableData] = useState();

  const populateResources = async ({
    manifests,
    context,
    context: {
      reference,
    },
  }) => {
    const {ult, ust, ulb, irv, obs} = resources;
    const referenceChanged = (
      (reference && !contextLoaded.reference) ||
      (reference && (reference.bookId !== contextLoaded.reference.bookId))
    );
    const emptyBookData = (!(ult || ust || ulb || irv || obs));
    const needToFetch = (emptyBookData || referenceChanged)
    const canFetch = (reference && reference.bookId && Object.keys(manifests).length > 0);
    if (canFetch && needToFetch) {
      let _resources = await helpers.fetchResources({manifests, context});
      _resources.tn = pivotTranslationNotes(_resources.tn);
      setResources(_resources);
      setContextLoaded(context);
    }
  };

  const pivotTranslationNotes = (tn) => {
    const rows = tn.data;
    const data = helpers.pivotTranslationNotes({tn: rows});
    const _tn = {...tn, data, rows};
    return _tn;
  }

  const populateVerseCountTableData = () => {
    let columns = ['bookId', 'chapter'];
    let data = [];
    let index = {};
    const {reference: {bookId}} = contextLoaded;
    const resourceIds = Object.keys(resources);
    resourceIds.forEach(resourceId => {
      const resource = resources[resourceId];
      if (resource.data && resource.manifest && /usfm/.test(resource.manifest.dublin_core.format)) {
        columns.push(resourceId);
        const chapterKeys = Object.keys(resource.data);
        chapterKeys.forEach(chapterKey => {
          index[chapterKey] = index[chapterKey] || {};
          const chapterData = resource.data[chapterKey];
          const verseCount = Object.keys(chapterData).length;
          index[chapterKey][resourceId] = verseCount;
        });
      }
    });
    const chapterKeys = Object.keys(index);
    chapterKeys.forEach(chapterKey => {
      const chapterIndex = index[chapterKey];
      const resourceIds = Object.keys(chapterIndex);
      let row = [bookId, chapterKey];
      resourceIds.forEach(resourceId => {
        const verseCount = chapterIndex[resourceId];
        row.push(verseCount);
      });
      data.push(row);
    });
    const _verseCountTableData = {columns, data};
    setVerseCountTableData(_verseCountTableData);
  };

  const _resources = deepFreeze(resources);

  const value = {
    resources: _resources,
    populateResources,
    contextLoaded,
    verseCountTableData,
    populateVerseCountTableData,
  };

  return (
    <ResourcesContext.Provider value={value}>
      {children}
    </ResourcesContext.Provider>
  );
};
