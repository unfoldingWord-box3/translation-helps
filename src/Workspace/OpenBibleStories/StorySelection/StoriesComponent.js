import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  Paper,
  List,
} from '@material-ui/core';

import StoryComponent from './StoryComponent';

export const StoriesComponent = ({
  classes,
  stories,
  context,
  setContext,
  context: {
    reference,
  },
}) => {
  const components = Object.keys(stories).map(_storyKey => {
    const storyKey = parseInt(_storyKey);
    const frames = stories[storyKey];
    return (<StoryComponent
      key={storyKey}
      context={context}
      setContext={setContext}
      storyKey={storyKey}
      frames={frames}
    />);
  });

  return (
    <Paper className={classes.root}>
      <List
        className={classes.root}
        component="nav"
        dense
      >
        <div className={classes.list}>
          {components}
        </div>
      </List>
    </Paper>
  );
};

StoriesComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  context: PropTypes.object.isRequired,
  setContext: PropTypes.func.isRequired,
  stories: PropTypes.object.isRequired,
};

const styles = theme => ({
  root: {
    height: '100%',
    maxWidth: '40em',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  list: {
    height: '100%',
    overflowY: 'auto',
  },
});

export default withStyles(styles)(StoriesComponent);
