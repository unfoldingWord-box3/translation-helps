import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
} from '@material-ui/core';
import {
} from '@material-ui/icons';

import MilestoneComponent from './MilestoneComponent';
import TextComponent from './TextComponent';

export const VerseObjectComponent = ({classes, verseObject, originalWords}) => {
  let type = 'text';
  // if (verseObject.lemma) type = 'original';
  if (verseObject.type === 'milestone' && verseObject.lemma) type = 'milestone';

  let component;
  if (type === 'text') {
    component = (
      <TextComponent
        verseObject={verseObject}
      />
    );
  }
  if (type === 'milestone') {
    component = (
      <MilestoneComponent
        verseObject={verseObject}
        originalWords={originalWords}
      />
    );
  }

  return component;
};

VerseObjectComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  verseObject: PropTypes.object.isRequired,
  originalWords: PropTypes.array,
};

const styles = theme => ({
  root: {
    width: '100%',
  },
});

export default withStyles(styles)(VerseObjectComponent);
