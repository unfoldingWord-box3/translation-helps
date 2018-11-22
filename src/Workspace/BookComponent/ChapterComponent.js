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

import styles from './styles';

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
  const introPanel = (
    <ExpansionPanel className={classes.column} key={Math.random()}>
      <ExpansionPanelSummary
        expandIcon={
          <ExpandMore />
        }>
        <h2>
          Chapter {chapterKey}
        </h2>
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
  );
  const panels = [introPanel].concat(verses);

  return panels;
};

ChapterComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  chapterKey: PropTypes.string.isRequired,
  chapterData: PropTypes.object.isRequired,
  translationNotesChapterData: PropTypes.object,
};

export default withStyles(styles)(ChapterComponent);
