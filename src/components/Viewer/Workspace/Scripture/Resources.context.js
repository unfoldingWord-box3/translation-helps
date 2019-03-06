import React, {
  createContext,
  useState
} from 'react';
import deepFreeze from 'deep-freeze';

import * as helpers from './helpers';

export const ResourcesContext = createContext();

export function ResourcesContextProvider({children}) {
  const [resources, setResources] = useState({});
  const [contextLoaded, setContextLoaded] = useState({});

  const populateResources = async ({
    manifests,
    context,
    context: {
      reference,
    },
  }) => {
    const {ult, ust, ulb, irv, obs} = resources;
    const referenceChanged = (
      (reference && !contextLoaded.reference) ||
      (reference && (reference.bookId !== contextLoaded.reference.bookId))
    );
    const emptyBookData = (!(ult || ust || ulb || irv || obs));
    const needToFetch = (emptyBookData || referenceChanged)
    const canFetch = (reference && reference.bookId && Object.keys(manifests).length > 0);
    if (canFetch && needToFetch) {
      const _resources = await helpers.fetchResources({manifests, context});
      setResources(_resources);
      setContextLoaded(context);
    }
  };

  const _resources = deepFreeze(resources);

  const value = {
    resources: _resources,
    populateResources,
    contextLoaded,
  };

  return (
    <ResourcesContext.Provider value={value}>
      {children}
    </ResourcesContext.Provider>
  );
};
