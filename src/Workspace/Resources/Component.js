import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Resource from './Resource';
import styles from '../styles';

export const Component = ({
  classes,
  context,
  setContext,
  manifests,
}) => {
  const resources = Object.keys(manifests)
  .filter(resourceId => ['ult','obs'].includes(resourceId));

  return (
    <div className={classes.column}>
      {resources.map(resourceId => (
        <Resource
          key={resourceId}
          context={context}
          setContext={setContext}
          manifest={manifests[resourceId]}
        />
      ))}
    </div>
  );
};

Component.propTypes = {
  context: PropTypes.object.isRequired,
  setContext: PropTypes.func.isRequired,
  manifests: PropTypes.object.isRequired,
};

export default withStyles(styles)(Component);
