import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
} from '@material-ui/core';
import {
} from '@material-ui/icons';

import styles from '../../../styles';
import Frame from '../Frame/';

export const Story = ({
  classes,
  storyKey,
  story,
  context,
  setContext,
  helps,
}) => {
  const frames = Object.keys(story).map((frameKey, index) => {
    const {image, text} = story[frameKey];
    return (
      <Frame
        key={frameKey}
        storyKey={storyKey}
        helps={index === 0 ? helps : {}}
        frameKey={frameKey}
        image={image}
        text={text}
        context={context}
        setContext={setContext}
      />
    );
  });
  return (
    <div className={classes.column}>
      {frames}
    </div>
  );
};

Story.propTypes = {
  classes: PropTypes.object.isRequired,
  storyKey: PropTypes.number.isRequired,
  story: PropTypes.object.isRequired,
  helps: PropTypes.object,
  context: PropTypes.object.isRequired,
  setContext: PropTypes.func.isRequired,
};

export default withStyles(styles)(Story);
