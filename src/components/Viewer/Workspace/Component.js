import React, {Suspense, lazy} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  CircularProgress,
} from '@material-ui/core';
import {
} from '@material-ui/icons';

const History = lazy(() => import('./History'));
const Resources = lazy(() => import('./Resources'));
const OpenBibleStories = lazy(() => import('./OpenBibleStories'));
const Scripture = lazy(() => import('./Scripture'));

export const Component = ({
  classes,
  manifests,
  history,
  context,
  setContext,
  title,
}) => {
  const historyComponent = (
    <History
      context={context}
      setContext={setContext}
      manifests={manifests}
      contexts={history}
    />
  );
  const resources = (
    <Resources
      context={context}
      setContext={setContext}
      manifests={manifests}
    />
  );
  const scripture = (
    <Scripture
      context={context}
      setContext={setContext}
      manifests={manifests}
    />
  );
  const openBibleStories = (
    <OpenBibleStories
      context={context}
      setContext={setContext}
      manifests={manifests}
    />
  );
  const loadingComponent = (
    <CircularProgress className={classes.progress} color="secondary" disableShrink />
  );

  let component = loadingComponent;
  const shouldShowHistory = (context.view === 'history');
  if (Object.keys(manifests).length > 0) {
    const shouldShowResources = (!context.resourceId);
    const shouldShowScripture = (['ult','ust','ulb','udb','irv'].includes(context.resourceId));
    const shouldShowOpenBibleStories = (context.resourceId === 'obs');

    if (shouldShowHistory) component = historyComponent;
    else if (shouldShowResources) component = resources;
    else if (shouldShowScripture) component = scripture;
    else if (shouldShowOpenBibleStories) component = openBibleStories;
  }

  return (
    <div className={classes.root}>
      <Suspense fallback={loadingComponent}>
        {component}
      </Suspense>
    </div>
  );
}

Component.propTypes = {
  classes: PropTypes.object.isRequired,
  context: PropTypes.object.isRequired,
  setContext: PropTypes.func.isRequired,
  history: PropTypes.array,
  manifests: PropTypes.object,
};

const styles = theme => ({
  root: {
    width: '100%',
  },
  progress: {
    margin: 'auto',
    display: 'block',
  },
});

export default withStyles(styles)(Component);
