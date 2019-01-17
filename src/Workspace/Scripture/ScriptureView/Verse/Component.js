import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  Divider,
  Typography,
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
  ultVerseData,
  ustVerseData,
  originalVerseData,
  translationNotesVerseData,
  context,
  setContext,
  context: {
    resourceId,
    reference,
  },
}) => {

  const ultVerse =
  ultVerseData.verseObjects ?
  ultVerseData.verseObjects.map((verseObject, index) => {
    return (
      <VerseObject
        key={index}
        verseObject={verseObject}
      />
    );
  }) : <span />;

  let tabs = [];

  let ustVerseComponent = <span />;
  if (ustVerseData && ustVerseData.verseObjects) {
    const ustVerse = ustVerseData.verseObjects.map((verseObject, index) => {
      return (
        <VerseObject
          key={index}
          verseObject={verseObject}
        />
      );
    });
    ustVerseComponent = (
      <div className={classes.tabVerse}>
        <sup>{verseKey} </sup>
        {ustVerse}
      </div>
    );
  }

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
      <div className={classes.tabVerse} style={{direction: (testament === 'old') ? 'rtl' : 'ltr'}}>
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

  const titleComponentNT = (
    <Typography variant="caption" align="right" gutterBottom>
      <strong>UGNT</strong> (unfoldingWord Greek New Testament)
    </Typography>
  );
  const titleComponentOT = (
    <Typography variant="caption" align="right" gutterBottom>
      <strong>UHB</strong> (unfoldingWord Hebrew Bible)
    </Typography>
  );
  const titleComponentOriginal = chaptersAndVerses.testament(reference.bookId) === 'old' ? titleComponentOT : titleComponentNT;

  const scriptureComponent = (
    <div>
      {ustVerseComponent}
      <Typography variant="caption" align="right" gutterBottom>
        <strong>UST</strong> (unfoldingWord Simplified Text)
      </Typography>
      <Divider variant="middle" />
      {originalVerseComponent}
      {titleComponentOriginal}
    </div>
  );

  const scriptureTab = {
    title: 'Reference',
    content: scriptureComponent,
  }
  tabs.unshift(scriptureTab);

  const details = (
    <div>
      <Typography variant="caption" align="right" style={{padding: '0 24px 12px 0'}} gutterBottom>
        <strong>ULT</strong> (unfoldingWord Literal Text)
      </Typography>
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
            {ultVerse}
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
  ultVerseData: PropTypes.object.isRequired,
  ustVerseData: PropTypes.object,
  translationNotesVerseData: PropTypes.array,
  originalVerseData: PropTypes.object,
};

export default withStyles(styles, { withTheme: true })(VerseComponent);
