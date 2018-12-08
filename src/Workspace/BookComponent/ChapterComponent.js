import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
} from '@material-ui/core';
import {
} from '@material-ui/icons';

import styles from './styles';

import TranslationHelps from '../TranslationHelps';
import ExpansionPanelContainer from './ExpansionPanelContainer';
import VerseComponent from './VerseComponent';

export const ChapterComponent = ({
  classes,
  languageId,
  chapterKey,
  bookChapterData,
  originalChapterData,
  translationNotesChapterData,
  setReference,
  reference,
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
      originalVerseData={originalChapterData ? originalChapterData[verseKey] : null}
      translationNotesVerseData={translationNotesChapterData[verseKey]}
      setReference={setReference}
      reference={reference}
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
    <ExpansionPanelContainer
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
  originalChapterData: PropTypes.object,
  setReference: PropTypes.func.isRequired,
  reference: PropTypes.object.isRequired,
};

export default withStyles(styles)(ChapterComponent);
