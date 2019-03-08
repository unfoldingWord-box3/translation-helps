import React, {
  createContext,
  useState
} from 'react';
import deepFreeze from 'deep-freeze';

import * as helpers from './helpers';

export const LemmaIndexContext = createContext();

export function LemmaIndexContextProvider({children}) {
  const [lemmaIndex, setLemmaIndex] = useState();

  const populateLemmaIndex = ({data}) => {
    const _lemmaIndex = helpers.index({data});
    setLemmaIndex(_lemmaIndex);
  }

  const _lemmaIndex = lemmaIndex ? deepFreeze(lemmaIndex) : undefined;

  const value = {
    lemmaIndex: _lemmaIndex,
    populateLemmaIndex,
  };

  return (
    <LemmaIndexContext.Provider value={value}>
      {children}
    </LemmaIndexContext.Provider>
  );
};
