import React, {
  createContext,
  useState
} from 'react';
import deepFreeze from 'deep-freeze';
import * as gitApi from './gitApi';

export const ManifestsContext = createContext();

export function ManifestsContextProvider({children}) {
  const [manifests, setManifests] = useState({});

  // load new manifests and update context if language or username changes
  const populateManifests = async ({context}) => {
    const _manifests = await gitApi.fetchResourceManifests(context);
    setManifests(_manifests);
    return _manifests;
  };

  // load new manifests and update context if language or username changes
  const refreshManifests = async ({context, oldContext}) => {
    let _manifests = {...manifests};
    const languageChanged = (oldContext.languageId !== context.languageId);
    const usernameChanged = (oldContext.username !== context.username);
    if (languageChanged || usernameChanged) {
      _manifests = await populateManifests({context});
    };
    return _manifests;
  };

  const _manifests = deepFreeze(manifests);

  const value = {
    manifests: _manifests,
    populateManifests,
    refreshManifests,
    setManifests,
  };

  return (
    <ManifestsContext.Provider value={value}>
      {children}
    </ManifestsContext.Provider>
  );
};
