import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import { withStyles } from '@material-ui/core/styles';
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
} from '@material-ui/core';
import {
  ExpandMore,
} from '@material-ui/icons';

import styles from './styles';

import ChapterComponent from './ChapterComponent';

export const BookComponent = ({classes, bookData, translationNotesData}) => {
  const chapters = Object.keys(bookData.chapters).map(chapterKey =>
    <ChapterComponent
      key={chapterKey}
      chapterKey={chapterKey}
      chapterData={bookData.chapters[chapterKey]}
      translationNotesChapterData={translationNotesData[chapterKey]}
    />
  );
  const intro = translationNotesData['front']['intro'][0]['occurrence_note'];
  return (
    <div className={classes.root}>
      <ExpansionPanel className={classes.column} key={Math.random()}>
        <ExpansionPanelSummary
          expandIcon={
            <ExpandMore />
          }>
          <ReactMarkdown
            source={intro.split('\n')[0]}
            escapeHtml={false}
          />
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <div>
            <ReactMarkdown
              source={intro.split('\n').splice(1).join('\n')}
              escapeHtml={false}
            />
          </div>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      {chapters}
    </div>
  );
};

BookComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  bookData: PropTypes.object.isRequired,
  translationNotesData: PropTypes.object,
};

export default withStyles(styles)(BookComponent);
