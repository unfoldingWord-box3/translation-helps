/**
 * ManifestsContext.js
 * Context to provide DCS manifests for resources.
 */

import React, { createContext } from 'react';
import { useManifest } from '../hooks/useManifest';

export const ManifestsContext = createContext({ manifests: {} });

/**
 * Provider that fetches and provides manifest for a resource.
 * @param {{children: React.ReactNode, languageId: string, resourceId: string}} props
 */
export function ManifestsProvider({ children, languageId, resourceId }) {
  const manifest = useManifest(languageId, resourceId);
  const manifests = resourceId ? { [resourceId]: manifest } : {};
  return (
    <ManifestsContext.Provider value={{ manifests }}>
      {children}
    </ManifestsContext.Provider>
  );
}