import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
} from '@material-ui/core';
import {
} from '@material-ui/icons';

import BookComponent from './BookComponent';
import BibleManager from './BibleManager';
import ChapterManager from './ChapterManager';

export const Workspace = ({
  classes,
  bookData,
  translationNotesData,
  username,
  languageId,
  manifests,
  reference,
  setReference,
}) => {
  const bibleManager = (
    <BibleManager
      manifests={manifests}
      reference={reference}
      setReference={setReference}
    />
  );
  const chapterManager = (
    <ChapterManager
      reference={reference}
      setReference={setReference}
    />
  );
  const bookComponent = (
    <BookComponent
      reference={reference}
      bookData={bookData}
      translationNotesData={translationNotesData}
    />
  );
  let component = (!reference.book) ? bibleManager : chapterManager;
  component = (bookData && translationNotesData && reference.chapter) ? bookComponent : component;

  return (
    <div className={classes.root}>
      {component}
    </div>
  );
}

Workspace.propTypes = {
  classes: PropTypes.object.isRequired,
  username: PropTypes.string.isRequired,
  languageId: PropTypes.string.isRequired,
  reference: PropTypes.object.isRequired,
  setReference: PropTypes.func.isRequired,
  manifests: PropTypes.object,
  translationNotesData: PropTypes.object,
  bookData: PropTypes.object,
};

const styles = theme => ({
  root: {
    width: '100%',
  },
});

export default withStyles(styles)(Workspace);
