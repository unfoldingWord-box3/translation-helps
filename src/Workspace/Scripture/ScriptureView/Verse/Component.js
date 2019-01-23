import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  Divider,
} from '@material-ui/core';

import styles from '../../../styles';

import ExpansionPanel from '../ExpansionPanel';
import TranslationHelps from '../../../TranslationHelps';
import Reference from './Reference';
import Title from './Title';

import * as originalHelpers from '../../../TranslationHelps/Original/helpers';

export const VerseComponent = ({
  classes,
  languageId,
  verseKey,
  resources: {
    ult,
    ust,
    original,
    tn,
  },
  context,
  setContext,
  context: {
    reference: {
      bookId,
      chapter,
    },
  },
}) => {

  let tabs = [];

  const scriptureComponent = (
    <div style={{paddingTop: '1em'}}>
      <Reference
        verseKey={verseKey}
        resource={ust}
        context={context}
      />
      <Divider variant="middle" />
      <Reference
        verseKey={verseKey}
        resource={original}
        context={context}
      />
    </div>
  );

  const scriptureTab = {
    title: 'Reference',
    content: scriptureComponent,
  }
  tabs.push(scriptureTab);

  if (original.data[chapter][verseKey]) {
    const {verseObjects} = original.data[chapter][verseKey];
    const wordObjects = originalHelpers.taggedWords(verseObjects);
    if (wordObjects.length > 0) {
      const wordsTab = {
        title: 'Words',
        original: wordObjects,
      };
      tabs.push(wordsTab);
    }
  }
  if (tn.data[chapter][verseKey]) {
    const notesTab = {
      title: 'Notes',
      notes: tn.data[chapter][verseKey],
    };
    tabs.push(notesTab)
  };

  const details = (
    <div>
      <div style={{paddingRight: '24px'}}>
        <Title
          manifest={ult.manifest}
        />
      </div>
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
  const id = `${bookId}_${chapter}_${verseKey}`;

  return (
    <ExpansionPanel
      summary={
        <div>
          <span id={id} style={{position: 'absolute', top: '-5em'}}></span>
          <div className={classes.verse}>
            <Reference
              verseKey={verseKey}
              resource={ult}
              context={context}
              noTitle
            />
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
  resources: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(VerseComponent);
