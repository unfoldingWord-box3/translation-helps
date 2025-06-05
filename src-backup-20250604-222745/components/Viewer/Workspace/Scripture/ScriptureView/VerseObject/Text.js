import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

export const Text = ({classes, verseObject}) => {
  return (
    <span>
      {verseObject.text}
    </span>
  );
};

Text.propTypes = {
  classes: PropTypes.object.isRequired,
  verseObject: PropTypes.object.isRequired,
};

const styles = theme => ({
  root: {
    width: '100%',
  },
});

export default withStyles(styles)(Text);
