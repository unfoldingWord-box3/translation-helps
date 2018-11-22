import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
} from '@material-ui/core';
import {
} from '@material-ui/icons';

import BookComponent from './BookComponent';
// import TranslationNotes from './TranslationNotes';

export const Workspace = ({
  classes,
  bookData,
  translationNotesData,
}) => {
  const bookComponent = (
    bookData && translationNotesData ?
    <BookComponent
      bookData={bookData}
      translationNotesData={translationNotesData}
    />
    :
    <div />
  );
  return (
    <div className={classes.root}>
      {bookComponent}
    </div>
  );
}

Workspace.propTypes = {
  classes: PropTypes.object.isRequired,
  bookData: PropTypes.object,
  translationNotesData: PropTypes.object,
};

const styles = theme => ({
  root: {
    width: '100%',
  },
});

export default withStyles(styles)(Workspace);
