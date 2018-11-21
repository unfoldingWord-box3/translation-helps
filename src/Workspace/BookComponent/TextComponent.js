import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
} from '@material-ui/core';
import {
} from '@material-ui/icons';

export const TextComponent = ({classes, verseObject}) => {
  const isWord = verseObject.type === 'word';
  const isText = verseObject.type === 'text';
  return (
    <span>{isWord ? ' ': ''}{verseObject.text}</span>
  );
};

TextComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  verseObject: PropTypes.object.isRequired,
};

const styles = theme => ({
  root: {
    width: '100%',
  },
});

export default withStyles(styles)(TextComponent);
