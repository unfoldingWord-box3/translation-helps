import React, {
  createContext,
  useState
} from 'react';

import * as gitApi from './gitApi';
import * as helpers from './helpers';

export const ManifestsContext = createContext();

export function ManifestsContextProvider({children}) {
  const [manifests, setManifests] = useState({});

  // load new manifests and update context if language or username changes
  const populateManifests = async ({context}) => {
    const _manifests = await gitApi.fetchResourceManifests(context);
    return setManifests(_manifests);
  };

  // load new manifests and update context if language or username changes
  const refreshManifests = async ({context, oldContext}) => {
    const languageChanged = (oldContext.languageId !== context.languageId);
    const usernameChanged = (oldContext.username !== context.username);
    if (languageChanged || usernameChanged) {
      populateManifests({context});
    };
  };

  const _manifests = helpers.deepFreeze(manifests);

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
