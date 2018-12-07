import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
} from '@material-ui/core';
import {
} from '@material-ui/icons';

import styles from './styles';

import ExpansionComponent from './ExpansionComponent';
import VerseObjectComponent from './VerseObjectComponent';
import TranslationHelps from '../TranslationHelps';

export const VerseComponent = ({
  classes,
  languageId,
  verseKey,
  bookVerseData,
  ugntVerseData,
  translationNotesVerseData,
  setReference,
}) => {
  const verseObjects =
  bookVerseData.verseObjects ?
  bookVerseData.verseObjects.map((verseObject, index) => {
    // const lastVerseObject = (index > 0) ? verseData.verseObjects[index - 1] : null;
    // const nextVerseObject = (index < verseData.verseObjects.length - 1) ? verseData.verseObjects[index + 1] : null;
    return (
      <VerseObjectComponent
        key={index}
        verseObject={verseObject}
        greekWords={[]}
      />
    );
  }) : <span />;

  let tabs = [];
  if (translationNotesVerseData) {
    const notesTab = {
      title: 'Notes',
      notes: translationNotesVerseData,
    };
    tabs.push(notesTab)
  };
  if (ugntVerseData) {
    const wordsTab = {
      title: 'Words',
      ugnt: ugntVerseData.verseObjects,
    };
    tabs.push(wordsTab);
  }

  const details = (tabs.length > 0) ?
    <TranslationHelps
      languageId={languageId}
      tabs={tabs}
      setReference={setReference}
    /> : null;

  // const element = document.getElementById(this.state.media);
  // element.scrollIntoView({behavior: 'smooth'});

  return (
    <ExpansionComponent
      key={'verse'+verseKey}
      summary={
        <span className={classes.verse}>
          <sup>{verseKey}</sup>
          {verseObjects}
        </span>
      }
      details={details}
    />
  );
};

VerseComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  verseKey: PropTypes.string.isRequired,
  bookVerseData: PropTypes.object.isRequired,
  translationNotesVerseData: PropTypes.array,
  languageId: PropTypes.string.isRequired,
  ugntVerseData: PropTypes.object,
  setReference: PropTypes.func.isRequired,
};

export default withStyles(styles, { withTheme: true })(VerseComponent);
