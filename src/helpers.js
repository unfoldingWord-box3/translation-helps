import localstorage from 'local-storage';
import * as chapterAndVerses from './components/Viewer/chaptersAndVerses';

export const validateContext = (context) => {
  const {resourceId, reference} = context;
  let valid;
  valid = (!resourceId && !reference); // valid if neither is set
  if (resourceId && reference) {
    const validReference = chapterAndVerses.validateReference({reference});
    valid = (resourceId && validReference);
  }
  return valid;
};

export const updateQueryFromContext = (context) => {
  let reference = context.reference || {};
  const _context = {...context, reference};
  const {
    username,
    uid,
    languageId,
    resourceId,
    reference: {
      bookId,
      chapter,
      verse,
    },
  } = _context;
  const _username = username ? `owner=${username}` : '';
  const _uid = uid ? `&uid=${uid}` : '';
  const _languageId = languageId ? `/${languageId}` : '';
  const _resourceId = resourceId ? `/${resourceId}` : '';
  const _bookId = bookId ? `/${bookId}` : '';
  const _chapter = chapter ? `/${chapter}` : '';
  const _verse = verse ? `/${verse}` : '';
  const rc = `&rc=${_languageId}${_resourceId}${_bookId}${_chapter}${_verse}`
  const path = window.location.pathname;
  const query = `${path}?${_username}${_uid}${rc}`;
  window.history.pushState(context, null, query);
};

export const contextFromQuery = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const username = urlParams.get('owner') || 'door43-catalog';
  const uid = urlParams.get('uid') || '4598';
  const rc = urlParams.get('rc') || ''
  const rcArray = rc.slice(1).split('/').filter(string => string);
  const [languageId, resourceId, bookId, chapter, verse] = rcArray;
  return {
    username,
    uid,
    languageId: languageId || 'en',
    resourceId: resourceId,
    reference: {
      bookId,
      chapter,
      verse,
    },
  }
};

export const save = ({key, value}) => {
 return localstorage.set(key, value);
};

export const load = ({key, defaultValue}) => {
  let value;
  try {
    value = localstorage.get(key);
  } catch(error) {
    value = defaultValue;
  }
  return value || defaultValue;
};
