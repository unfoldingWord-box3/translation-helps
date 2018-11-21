import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Typography,
} from '@material-ui/core';
import {
  ExpandMore,
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
    <ExpansionPanel>
      <ExpansionPanelSummary
        expandIcon={
          <ExpandMore />
        }>
        <Typography className={classes.heading}>
          <sup>{verseKey}</sup>
          {verseObjects}
        </Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <Typography>
          {notes}
        </Typography>
      </ExpansionPanelDetails>
    </ExpansionPanel>
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
