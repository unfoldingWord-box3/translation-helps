import React, {Suspense, lazy} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  CircularProgress,
} from '@material-ui/core';

import Download from './Download';
import Languages from './Languages';
import styles from '../styles';

const Resource = lazy(() => Promise.resolve().then(() => require('./Resource')));

export const Component = ({
  classes,
  context,
  context: {
    username,
    languageId,
  },
  setContext,
  manifests,
}) => {
  const resources = Object.keys(manifests)
  .filter(resourceId => {
    const resourceExists = ['ult','ust','ulb','udb','irv','obs'].includes(resourceId);
    const manifest = manifests[resourceId];
    let language;
    if (manifest) language = manifest.dublin_core.language.identifier;
    const languageMatch = language === context.languageId;
    return resourceExists && manifest && languageMatch;
  });
  const loadingComponent = (
    <CircularProgress className={classes.progress} color="secondary" disableShrink />
  );

  return (
    <div className={classes.column}>
      <Languages
        context={context}
        setContext={setContext}
      />
      <Download context={context} />
      <Suspense fallback={loadingComponent}>
        {resources.map(resourceId => (
          <Resource
            key={resourceId}
            context={context}
            setContext={setContext}
            manifest={manifests[resourceId]}
          />
        ))}
      </Suspense>
    </div>
  );
};

Component.propTypes = {
  context: PropTypes.object.isRequired,
  setContext: PropTypes.func.isRequired,
  manifests: PropTypes.object.isRequired,
};

export default withStyles(styles)(Component);
