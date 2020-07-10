import React, { createContext, useState } from 'react';
import useEffect from 'use-deep-compare-effect';
import deepFreeze from 'deep-freeze';

import { updateQueryFromContext, contextFromQuery, validateContext } from './helpers';

export const ContextContext = createContext();

const defaultContext = {
  organization: 'door43-catalog',
  languageId: 'en',
};

export function ContextContextProvider({children}) {
  const queryContext = contextFromQuery();
  const _defaultContext = queryContext || defaultContext();

  const [context, setContext] = useState(_defaultContext);

  useEffect(() => {
    updateQueryFromContext(context);
    window.scrollTo(0,0);
  }, [context]);

  const updateContext = async (_context) => {
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
