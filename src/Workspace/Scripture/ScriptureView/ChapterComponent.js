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
    reference: {
      chapter,
    }
  },
  setContext,
  lemmaIndex,
  resources,
  resources: {
    ult,
    tn,
  }
}) => {
  const verses = Object.keys(ult.data[chapter])
  .filter(verseKey => {
    return /\d+/g.test(verseKey); // don't show front/intro
  })
  .map(verseKey =>
    <Verse
      key={`${reference.chapter}-${verseKey}`}
      context={context}
      setContext={setContext}
      lemmaIndex={lemmaIndex}
      verseKey={verseKey}
      resources={resources}
    />
  );
  const intro = (tn.data[chapter]['intro'] && tn.data[chapter]['intro'][0]) ?
    tn.data[chapter]['intro'][0]['occurrence_note']
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
  resources: PropTypes.object.isRequired,
};

export default withStyles(styles)(ChapterComponent);
