/**
 * ResourcesContext.js
 * Responsible for managing loading and storage of resource data across the app.
 */
import React, { createContext, useState, useEffect } from 'react';
import { getLinksForVerse } from '../services/twlService';

export const ResourcesContext = createContext({ resources: {} });

/**
 * Provider that loads resource data based on the current reference and resourceId.
 * @param {object} props
 * @param {string} props.resourceId - Resource identifier (e.g., 'twl').
 * @param {object} props.reference - Current reference { bookId, chapter, verse }.
 */
export function ResourcesProvider({ children, resourceId, reference }) {
  const [resources, setResources] = useState({});

  useEffect(() => {
    async function loadResource() {
      if (!resourceId || !reference?.bookId) return;
      const { bookId, chapter, verse } = reference;
      if (resourceId === 'twl') {
        const links = await getLinksForVerse(bookId, chapter, verse);
        setResources(prev => ({
          ...prev,
          twl: { data: { links } },
        }));
      }
    }
    loadResource();
  }, [resourceId, reference]);

  return (
    <ResourcesContext.Provider value={{ resources }}>
      {children}
    </ResourcesContext.Provider>
  );
}