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

import styles from './styles';

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
  }) : <span />;
  const notes = translationNotesVerseData ?
    translationNotesVerseData.map((note, index) =>
    <p key={index}>
      <strong>{note['gl_quote']}</strong>: {note['occurrence_note']}
    </p>
  ) : "";
  return (
    <ExpansionPanel className={classes.column}>
      <ExpansionPanelSummary
        expandIcon={
          <ExpandMore />
        }>
        <Typography className={classes.verse}>
          <sup>{verseKey}</sup>
          {verseObjects}
        </Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <div>
          {notes}
        </div>
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

export default withStyles(styles)(VerseComponent);
