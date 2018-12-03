import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
} from '@material-ui/core';
import {
} from '@material-ui/icons';

import styles from './styles';

import TranslationHelps from '../TranslationHelps';
import ExpansionComponent from './ExpansionComponent';
import VerseComponent from './VerseComponent';
import TextComponentWithRCLinks from '../TranslationHelps/TextComponentWithRCLinks';

export const ChapterComponent = ({classes, chapterKey, chapterData, translationNotesChapterData}) => {
  const verses = Object.keys(chapterData)
  .filter(verseKey => {
    const text = chapterData[verseKey].verseObjects.map(o => o.text).join('');
    return /\S+/g.test(text);
  })
  .map(verseKey =>
    <VerseComponent
      key={verseKey}
      verseKey={verseKey}
      verseData={chapterData[verseKey]}
      translationNotesVerseData={translationNotesChapterData[verseKey]}
    />
  );
  const intro = (translationNotesChapterData['intro'] && translationNotesChapterData['intro'][0]) ?
    translationNotesChapterData['intro'][0]['occurrence_note']
    .replace(/\[\[rc:\/\//g, 'http://').replace(/\]\]?/g, '')
    : '';
  const tabs = [{
    title: 'Chapter Notes',
    text: intro,
  }];
  const introPanel = (
    <ExpansionComponent
      key={'chapter'+chapterKey}
      summary={<h2>Chapter {chapterKey}</h2>}
      details={<TranslationHelps tabs={tabs} />}
    />
  );
  const panels = [introPanel].concat(verses);

  return panels;
};

ChapterComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  chapterKey: PropTypes.number.isRequired,
  chapterData: PropTypes.object.isRequired,
  translationNotesChapterData: PropTypes.object,
};

export default withStyles(styles)(ChapterComponent);
