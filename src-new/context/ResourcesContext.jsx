/**
 * ResourcesContext.js
 * Responsible for managing loading and storage of resource data across the app.
 */
import React, { createContext, useState, useEffect, useContext } from 'react';
import { ReferenceContext } from './ReferenceContext';
import { getLinksForVerse } from '../services/twlService';

export const ResourcesContext = createContext({ 
  resources: {},
  loadResource: () => {},
  isLoading: false 
});

/**
 * Provider that loads resource data based on the current reference.
 * @param {object} props
 * @param {React.ReactNode} props.children
 */
export function ResourcesProvider({ children }) {
  const [resources, setResources] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { reference } = useContext(ReferenceContext);

  const loadResource = async (resourceId) => {
    if (!resourceId || !reference?.bookId) return;
    
    setIsLoading(true);
    const { bookId, chapter, verse } = reference;
    
    try {
      if (resourceId === 'twl') {
        const links = await getLinksForVerse(bookId, chapter, verse);
        setResources(prev => ({
          ...prev,
          twl: { data: { links } },
        }));
      }
      // Add other resource types here (tN, tQ, tW)
    } catch (error) {
      console.error(`Failed to load resource ${resourceId}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-load TWL when reference changes
  useEffect(() => {
    if (reference?.bookId && reference?.chapter && reference?.verse) {
      loadResource('twl');
    }
  }, [reference]);

  return (
    <ResourcesContext.Provider value={{ resources, loadResource, isLoading }}>
      {children}
    </ResourcesContext.Provider>
  );
}