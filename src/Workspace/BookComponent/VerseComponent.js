import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
} from '@material-ui/core';
import {
} from '@material-ui/icons';

import styles from './styles';

import ExpansionPanelContainer from './ExpansionPanelContainer';
import VerseObjectComponent from './VerseObjectComponent';
import TranslationHelps from '../TranslationHelps';

import * as originalHelpers from '../TranslationHelps/Original/helpers';

export const VerseComponent = ({
  classes,
  languageId,
  verseKey,
  bookVerseData,
  originalVerseData,
  translationNotesVerseData,
  reference,
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
        originalWords={[]}
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
  const wordObjects = originalHelpers.taggedWords(originalVerseData.verseObjects);
  if (wordObjects.length > 0) {
    const wordsTab = {
      title: 'Words',
      original: wordObjects,
    };
    tabs.push(wordsTab);
  }

  const details = (tabs.length > 0) ?
    <TranslationHelps
      languageId={languageId}
      tabs={tabs}
      setReference={setReference}
    /> : null;

  const {book, chapter} = reference;
  const id = `${book}_${chapter}_${verseKey}`;

  return (
    <ExpansionPanelContainer
      summary={
        <p className={classes.verse}>
          <span id={id} style={{position: 'absolute', top: '-5em'}}></span>
          <sup>{verseKey}</sup>
          {verseObjects}
        </p>
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
  originalVerseData: PropTypes.object,
  setReference: PropTypes.func.isRequired,
  reference: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(VerseComponent);
