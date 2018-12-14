import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  CircularProgress,
} from '@material-ui/core';
import {
} from '@material-ui/icons';

import StorySelection from './StorySelection';
import OpenBibleStoriesView from './OpenBibleStoriesView';

export const OpenBibleStoriesComponent = ({
  classes,
  context,
  context: {
    reference
  },
  setContext,
  stories,
}) => {

  const loadingComponent = (
    <CircularProgress className={classes.progress} color="secondary" disableShrink />
  );

  let component = loadingComponent;
  const shouldShowStorySelection = (stories && !reference.chapter);
  const shouldShowOpenBibleStoriesView = (stories && reference.chapter);

  if (shouldShowStorySelection) {
    const storySelection = (
      <StorySelection
        context={context}
        setContext={setContext}
        stories={stories}
      />
    );
    component = storySelection;
  }
  else if (shouldShowOpenBibleStoriesView) {
    const openBibleStoriesView = (
      <OpenBibleStoriesView
        context={context}
        setContext={setContext}
        storyKey={reference.chapter}
        story={stories[reference.chapter]}
      />
    );
    component = openBibleStoriesView;
  }

  return (
    <div className={classes.root}>
      {component}
    </div>
  );
}

OpenBibleStoriesComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  context: PropTypes.object.isRequired,
  setContext: PropTypes.func.isRequired,
  stories: PropTypes.object,
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

export default withStyles(styles)(OpenBibleStoriesComponent);
