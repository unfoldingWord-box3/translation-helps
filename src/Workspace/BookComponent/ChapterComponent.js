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

export const ChapterComponent = ({
  classes,
  languageId,
  chapterKey,
  bookChapterData,
  ugntChapterData,
  translationNotesChapterData,
  setReference,
}) => {
  const verses = Object.keys(bookChapterData)
  .filter(verseKey => {
    const text = bookChapterData[verseKey].verseObjects.map(o => o.text).join('');
    return /\S+/g.test(text);
  })
  .map(verseKey =>
    <VerseComponent
      key={verseKey}
      verseKey={verseKey}
      languageId={languageId}
      bookVerseData={bookChapterData[verseKey]}
      ugntVerseData={ugntChapterData ? ugntChapterData[verseKey] : null}
      translationNotesVerseData={translationNotesChapterData[verseKey]}
      setReference={setReference}
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
      details={
        <TranslationHelps
          languageId={languageId}
          tabs={tabs}
          setReference={setReference}
        />
      }
    />
  );
  const panels = [introPanel].concat(verses);

  return panels;
};

ChapterComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  chapterKey: PropTypes.number.isRequired,
  bookChapterData: PropTypes.object.isRequired,
  translationNotesChapterData: PropTypes.object,
  languageId: PropTypes.string.isRequired,
  ugntChapterData: PropTypes.object,
  setReference: PropTypes.func.isRequired,
};

export default withStyles(styles)(ChapterComponent);
