import localstorage from 'local-storage';

export const updateQueryFromContext = (context) => {
  let reference = context.reference || {};
  const _context = {...context, reference};
  const {
    username,
    languageId,
    resourceId,
    reference: {
      bookId,
      chapter,
      verse,
    },
  } = _context;
  const _username = username ? `owner=${username}` : '';
  const _languageId = languageId ? `/${languageId}` : '';
  const _resourceId = resourceId ? `/${resourceId}` : '';
  const _bookId = bookId ? `/${bookId}` : '';
  const _chapter = chapter ? `/${chapter}` : '';
  const _verse = verse ? `/${verse}` : '';
  const rc = `&rc=${_languageId}${_resourceId}${_bookId}${_chapter}${_verse}`
  const path = window.location.pathname;
  const query = `${path}?${_username}${rc}`;
  window.history.pushState(context, null, query);
};

export const contextFromQuery = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const username = urlParams.get('owner') || 'unfoldingword';
  const rc = urlParams.get('rc') || ''
  const rcArray = rc.slice(1).split('/').filter(string => string);
  const [languageId, resourceId, bookId, chapter, verse] = rcArray;
  return {
    username: username,
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

export const deepFreeze = (object) => {
  Object.keys(object).forEach(key => {
    const value = object[key];
    if (value && typeof value === "object") deepFreeze(value);
  });
  return Object.freeze(object);
};
