import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  Divider,
} from '@material-ui/core';
import {
} from '@material-ui/icons';

import styles from '../../../styles';

import ExpansionPanelContainer from '../ExpansionPanelContainer';
import VerseObject from '../VerseObject';
import TranslationHelps from '../../../TranslationHelps';

import * as originalHelpers from '../../../TranslationHelps/Original/helpers';
import * as chaptersAndVerses from '../../../../chaptersAndVerses';

export const VerseComponent = ({
  classes,
  languageId,
  verseKey,
  lemmaIndex,
  bookVerseData,
  originalVerseData,
  translationNotesVerseData,
  context,
  setContext,
  context: {
    resourceId,
    reference,
  },
}) => {
  const gatewayVerse =
  bookVerseData.verseObjects ?
  bookVerseData.verseObjects.map((verseObject, index) => {
    return (
      <VerseObject
        key={index}
        verseObject={verseObject}
      />
    );
  }) : <span />;

  let tabs = [];
  let originalVerseComponent = <span />;
  if (originalVerseData && originalVerseData.verseObjects) {
    const originalVerse = originalVerseData.verseObjects.map((verseObject, index) => {
      return (
        <VerseObject
          key={index}
          verseObject={verseObject}
        />
      );
    });
    const testament = chaptersAndVerses.testament(reference.bookId);
    originalVerseComponent = (
      <div className={classes.originalVerse} style={{direction: (testament === 'old') ? 'rtl' : 'ltr'}}>
        <sup>{verseKey} </sup>
        {originalVerse}
      </div>
    );

    const wordObjects = originalHelpers.taggedWords(originalVerseData.verseObjects);
    if (wordObjects.length > 0) {
      const wordsTab = {
        title: 'Words',
        original: wordObjects,
      };
      tabs.push(wordsTab);
    }
  }
  if (translationNotesVerseData) {
    const notesTab = {
      title: 'Notes',
      notes: translationNotesVerseData,
    };
    tabs.push(notesTab)
  };

  const details = (
    <div>
      <Divider variant="middle" />
      {originalVerseComponent}
      {
        (tabs.length > 0) ?
        <TranslationHelps
          context={context}
          setContext={setContext}
          tabs={tabs}
        /> : null
      }
    </div>
  )
  const {bookId, chapter} = reference;
  const id = `${bookId}_${chapter}_${verseKey}`;

  return (
    <ExpansionPanelContainer
      summary={
        <div>
          <div className={classes.verse}>
            <span id={id} style={{position: 'absolute', top: '-5em'}}></span>
            <sup>{verseKey} </sup>
            {gatewayVerse}
          </div>
        </div>
      }
      details={details}
    />
  );
};

VerseComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  context: PropTypes.object.isRequired,
  setContext: PropTypes.func.isRequired,
  verseKey: PropTypes.string.isRequired,
  lemmaIndex: PropTypes.object,
  bookVerseData: PropTypes.object.isRequired,
  translationNotesVerseData: PropTypes.array,
  originalVerseData: PropTypes.object,
};

export default withStyles(styles, { withTheme: true })(VerseComponent);
