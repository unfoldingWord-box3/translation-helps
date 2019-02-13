import React, {Suspense, lazy} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  CircularProgress,
} from '@material-ui/core';

import Languages from './Languages/index';
import styles from '../styles';

const Resource = lazy(() => import('./Resource'));

export const Component = ({
  classes,
  context,
  setContext,
  manifests,
}) => {
  const resources = Object.keys(manifests)
  .filter(resourceId => {
    const resourceExists = ['ult','ulb','irv','obs'].includes(resourceId);
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
