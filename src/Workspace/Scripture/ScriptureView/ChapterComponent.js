import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
} from '@material-ui/core';
import {
} from '@material-ui/icons';

import styles from '../../styles';

import TranslationHelps from '../../TranslationHelps';
import ExpansionPanelContainer from './ExpansionPanelContainer';
import Verse from './Verse';

export const ChapterComponent = ({
  classes,
  context,
  context: {
    reference,
  },
  setContext,
  lemmaIndex,
  bookChapterData,
  originalChapterData,
  translationNotesChapterData,
}) => {
  const verses = Object.keys(bookChapterData)
  .filter(verseKey => {
    const text = bookChapterData[verseKey].verseObjects.map(o => o.text).join('');
    return /\S+/g.test(text);
  })
  .map(verseKey =>
    <Verse
      key={`${reference.chapter}-${verseKey}`}
      context={context}
      setContext={setContext}
      lemmaIndex={lemmaIndex}
      verseKey={verseKey}
      bookVerseData={bookChapterData[verseKey]}
      originalVerseData={originalChapterData ? originalChapterData[verseKey] : null}
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
    <ExpansionPanelContainer
      key={'chapter'+reference.chapter}
      summary={<h2>Chapter {reference.chapter}</h2>}
      details={
        <TranslationHelps
          context={context}
          setContext={setContext}
          tabs={tabs}
        />
      }
    />
  );
  const panels = [introPanel].concat(verses);

  return panels;
};

ChapterComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  context: PropTypes.object.isRequired,
  setContext: PropTypes.func.isRequired,
  lemmaIndex: PropTypes.object,
  bookChapterData: PropTypes.object.isRequired,
  translationNotesChapterData: PropTypes.object,
  originalChapterData: PropTypes.object,
};

export default withStyles(styles)(ChapterComponent);
