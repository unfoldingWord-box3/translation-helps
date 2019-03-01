import React, {useState, useContext} from 'react';
import PropTypes from 'prop-types';

import Workspace from './Workspace';

import {
  ManifestsContextProvider,
  ManifestsContext,
} from './Manifests.context';

function Viewer({
  classes,
  context,
  setContext,
  history,
}) {
  const [oldContext, setOldContext] = useState(context);
  const {manifests, populateManifests, refreshManifests} = useContext(ManifestsContext);
  if (Object.keys(manifests).length === 0) {
    populateManifests({context});
  }
  if (JSON.stringify(context) !== JSON.stringify(oldContext)) {
    refreshManifests({context, oldContext});
    setOldContext(context);
  }

  return (
    <Workspace
      context={context}
      setContext={setContext}
      history={history}
      manifests={manifests}
    />
  );
};

function ViewerWrapper (props) {
  return (
    <ManifestsContextProvider>
      <Viewer {...props} />
    </ManifestsContextProvider>
  );
};

ViewerWrapper.propTypes = {
  context: PropTypes.object.isRequired,
  setContext: PropTypes.func.isRequired,
  history: PropTypes.array,
};

export default ViewerWrapper;
