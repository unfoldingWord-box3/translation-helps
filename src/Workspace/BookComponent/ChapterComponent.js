import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import { withStyles } from '@material-ui/core/styles';
import {
} from '@material-ui/core';
import {
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
      <h1>Chapter {chapterKey}</h1>
      <div>
        <ReactMarkdown
          source={intro}
          escapeHtml={false}
        />
      </div>
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
