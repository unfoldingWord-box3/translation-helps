import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
} from '@material-ui/core';
import {
} from '@material-ui/icons';

import MilestoneComponent from './MilestoneComponent';
import TextComponent from './TextComponent';

export const VerseObjectComponent = ({classes, verseObject, greekWords}) => {
  const component = verseObject.type === 'milestone' ?
    <MilestoneComponent
      verseObject={verseObject}
      greekWords={greekWords}
    /> :
    <TextComponent
      verseObject={verseObject}
    />;
  return component;
};

VerseObjectComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  verseObject: PropTypes.object.isRequired,
  greekWords: PropTypes.array,
};

const styles = theme => ({
  root: {
    width: '100%',
  },
});

export default withStyles(styles)(VerseObjectComponent);
