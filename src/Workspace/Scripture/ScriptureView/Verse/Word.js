import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
} from '@material-ui/core';
import {
} from '@material-ui/icons';

export const OriginalWordComponent = ({
  classes,
  verseObject,
}) => {

  return (
    <span>
      {' '}{verseObject.text || verseObject.content}
    </span>
  );
};

OriginalWordComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  verseObject: PropTypes.object.isRequired,
};

const styles = theme => ({
  root: {
    width: '100%',
  },
});

export default withStyles(styles)(OriginalWordComponent);
