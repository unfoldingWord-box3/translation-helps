import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
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

import VerseComponent from './VerseComponent';

export const ChapterComponent = ({classes, chapterKey, chapterData, translationNotesChapterData}) => {
  const verses = Object.keys(chapterData).map(verseKey =>
    <VerseComponent
      key={verseKey}
      verseKey={verseKey}
      verseData={chapterData[verseKey]}
      translationNotesVerseData={translationNotesChapterData[verseKey]}
    />
  );
  const intro = translationNotesChapterData['intro'][0]['occurrence_note'];
  return (
    <div>
      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={
            <ExpandMore />
          }>
          <Typography className={classes.heading}>
            Chapter {chapterKey}
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Typography>
            <ReactMarkdown
              source={intro}
              escapeHtml={false}
            />
          </Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      {verses}
    </div>
  );
};

ChapterComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  chapterKey: PropTypes.string.isRequired,
  chapterData: PropTypes.object.isRequired,
  translationNotesChapterData: PropTypes.object,
};

const styles = theme => ({
  root: {
    width: '100%',
  },
});

export default withStyles(styles)(ChapterComponent);
