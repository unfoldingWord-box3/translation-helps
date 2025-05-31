/**
 * ReferenceContext.js
 * Context to track current book/chapter/verse reference.
 */

import React, { createContext, useState } from 'react';

export const ReferenceContext = createContext({
  reference: { bookId: '', chapter: '', verse: '' },
  setReference: () => {},
});

/**
 * Provider for ReferenceContext.
 * @param {{children: React.ReactNode}} props
 */
export function ReferenceProvider({ children }) {
  const [reference, setReference] = useState({ bookId: '', chapter: '', verse: '' });
  return (
    <ReferenceContext.Provider value={{ reference, setReference }}>
      {children}
    </ReferenceContext.Provider>
  );
}