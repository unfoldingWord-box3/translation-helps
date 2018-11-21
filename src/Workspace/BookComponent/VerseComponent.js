import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
} from '@material-ui/core';
import {
} from '@material-ui/icons';

import VerseObjectComponent from './VerseObjectComponent';

export const VerseComponent = ({classes, verseKey, verseData, translationNotesVerseData}) => {
  const verseObjects =
  verseData.verseObjects ?
  verseData.verseObjects.map((verseObject, index) => {
    // const lastVerseObject = (index > 0) ? verseData.verseObjects[index - 1] : null;
    // const nextVerseObject = (index < verseData.verseObjects.length - 1) ? verseData.verseObjects[index + 1] : null;
    return (
      <VerseObjectComponent
        key={index}
        verseObject={verseObject}
      />
    );
  }) : <div />;
  const notes = translationNotesVerseData ?
    translationNotesVerseData.map((note, index) =>
    <div key={index}>
      <em>{note['gl_quote']}</em>: {note['occurrence_note']}
    </div>
  ) : "";
  return (
    <div>
      <sup>{verseKey}</sup>
      {verseObjects}
      <div>
        {notes}
      </div>
    </div>
  );
};

VerseComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  verseKey: PropTypes.string.isRequired,
  verseData: PropTypes.object.isRequired,
  translationNotesVerseData: PropTypes.array,
};

const styles = theme => ({
  root: {
    width: '100%',
  },
});

export default withStyles(styles)(VerseComponent);
