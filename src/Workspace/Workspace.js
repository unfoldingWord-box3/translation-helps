import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  CircularProgress,
} from '@material-ui/core';
import {
} from '@material-ui/icons';

import BookComponent from './BookComponent';
import BibleManager from './BibleManager';
import ChapterManager from './ChapterManager';

export const Workspace = ({
  classes,
  bookData,
  ugntData,
  translationNotesData,
  username,
  languageId,
  manifests,
  reference,
  setReference,
  referenceLoaded,
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
      languageId={languageId}
      reference={reference}
      bookData={bookData}
      ugntData={ugntData}
      translationNotesData={translationNotesData}
      setReference={setReference}
    />
  );
  const loadingComponent = (
    <CircularProgress className={classes.progress} color="secondary" disableShrink />
  );

  const canShowBibleManager = (!reference.book);
  const canShowChapterManager = (!reference.chapter);
  const referenceIsLoaded = (referenceLoaded && referenceLoaded.book === reference.book);
  const canShowBookComponent = (referenceIsLoaded && !!bookData && !!translationNotesData);

  let component = loadingComponent;
  if (canShowBibleManager) component = bibleManager;
  else if (canShowChapterManager) component = chapterManager;
  else if (canShowBookComponent) component = bookComponent;

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
  ugntData: PropTypes.object,
  bookData: PropTypes.object,
  translationNotesData: PropTypes.object,
  referenceLoaded: PropTypes.object.isRequired,
};

const styles = theme => ({
  root: {
    width: '100%',
  },
  progress: {
    margin: 'auto',
    display: 'block',
  },
});

export default withStyles(styles)(Workspace);
