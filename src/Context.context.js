import React, {
  createContext,
  useState
} from 'react';
import deepFreeze from 'deep-freeze';

import { updateQueryFromContext, contextFromQuery } from './helpers';
import * as chapterAndVerses from './components/Viewer/chaptersAndVerses';

export const ContextContext = createContext();

export function ContextContextProvider({children}) {
  const defaultContext = () => {
    return {
      username: 'door43-catalog',
      languageId: 'en',
    }
  };
  const queryContext = contextFromQuery();
  const _defaultContext = queryContext || defaultContext();

  const [context, setContext] = useState(_defaultContext);

  const validateContext = (_context) => {
    const {resourceId, reference} = _context;
    let valid;
    valid = (!resourceId && !reference); // valid if neither is set
    if (resourceId && reference) {
      const validReference = chapterAndVerses.validateReference({reference});
      valid = (resourceId && validReference);
    }
    return valid;
  };

  const updateContext = async (_context, back=false) => {
    // allow navigation to Resources selection
    const emptyResourceId = (!_context.reference || !_context.resourceId);
    let shouldSetContext;
    if (emptyResourceId) shouldSetContext = true;
    // use 'obs' for bookId if is resourceId
    if (_context.resourceId === 'obs') {
      const reference = {..._context.reference, bookId: 'obs'}
      _context.reference = reference;
    }
    const validContext = validateContext(_context);
    // validate context
    if (validContext) shouldSetContext = true;
    if (shouldSetContext) {
      setContext(_context);
      updateQueryFromContext(_context);
      window.scrollTo(0,0);
    }
  };

  const _context = deepFreeze(context);

  const value = {
    context: _context,
    updateContext,
    defaultContext,
    validateContext,
  };

  return (
    <ContextContext.Provider value={value}>
      {children}
    </ContextContext.Provider>
  );
};
