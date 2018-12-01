import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
  Divider,
} from '@material-ui/core';
import {
} from '@material-ui/icons';

import TextComponentWithRCLinks from './TextComponentWithRCLinks';

export const TranslationNoteComponent = ({classes, note}) => {
  const occurrence_note = note.occurrence_note.replace(/\[\[rc:\/\//g, 'http://').replace(/\]\]?/g, '');
  const noteComponent = <TextComponentWithRCLinks text={occurrence_note} />;
  return (
    <div className={classes.root}>
      <Divider />
      <p className={classes.note}>
        <strong>{note.gl_quote}</strong> {noteComponent}
      </p>
    </div>
  );
};

TranslationNoteComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  note: PropTypes.object.isRequired,
};

const styles = theme => ({
  root: {
    width: '100%',
  },
  note: {
    marginTop: '0.5em',
    marginBottom: '0.5em',
  },
});

export default withStyles(styles)(TranslationNoteComponent);
