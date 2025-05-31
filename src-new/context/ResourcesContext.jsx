/**
 * ResourcesContext.js
 * Responsible for managing loading and storage of resource data across the app.
 */
import React, { createContext, useState } from 'react';

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

  const loadResource = async (resourceId, data) => {
    if (!resourceId) return;
    
    setIsLoading(true);
    
    try {
      // This is now just a placeholder for storing resource data
      // Each component will handle its own loading using manifests
      setResources(prev => ({
        ...prev,
        [resourceId]: { data },
      }));
    } catch (error) {
      console.error(`Failed to store resource ${resourceId}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ResourcesContext.Provider value={{ resources, loadResource, isLoading }}>
      {children}
    </ResourcesContext.Provider>
  );
}