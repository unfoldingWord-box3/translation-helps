import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
} from '@material-ui/core';
import {
} from '@material-ui/icons';

import VerseObjectComponent from './VerseObjectComponent';

export const MilestoneComponent = ({classes, verseObject}) => {
  const children = verseObject.children.map((child, index) =>
    <VerseObjectComponent key={index} verseObject={child} />
  );
  return children;
};

MilestoneComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  verseObject: PropTypes.object.isRequired,
};

const styles = theme => ({
  root: {
    width: '100%',
  },
});

export default withStyles(styles)(MilestoneComponent);
