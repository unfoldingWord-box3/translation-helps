/**
 * ReferenceContext.js
 * Context to track current book/chapter/verse reference.
 */

import React, { createContext, useState, useEffect } from 'react';
import { DEFAULT_REFERENCE } from '../utils/defaultReference';

export const ReferenceContext = createContext({
  reference: DEFAULT_REFERENCE,
  setReference: () => {},
  updateReference: () => {},
});

/**
 * Provider for ReferenceContext.
 * @param {{children: React.ReactNode}} props
 */
export function ReferenceProvider({ children }) {
  const [reference, setReference] = useState(DEFAULT_REFERENCE);

  // Load saved reference from localStorage on mount
  useEffect(() => {
    const savedRef = localStorage.getItem('currentReference');
    if (savedRef) {
      try {
        const parsed = JSON.parse(savedRef);
        if (parsed.bookId && parsed.chapter && parsed.verse) {
          setReference(parsed);
        }
      } catch (e) {
        console.error('Failed to parse saved reference:', e);
      }
    }
  }, []);

  // Save reference to localStorage when it changes
  useEffect(() => {
    if (reference.bookId && reference.chapter && reference.verse) {
      localStorage.setItem('currentReference', JSON.stringify(reference));
    }
  }, [reference]);

  // Helper function to update specific parts of reference
  const updateReference = (updates) => {
    setReference(prev => ({ ...prev, ...updates }));
  };

  return (
    <ReferenceContext.Provider value={{ reference, setReference, updateReference }}>
      {children}
    </ReferenceContext.Provider>
  );
}