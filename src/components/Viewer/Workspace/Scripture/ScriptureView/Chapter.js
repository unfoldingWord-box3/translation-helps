import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import styles from '../../styles';

import TranslationHelps from '../../TranslationHelps';
import ExpansionPanel from './ExpansionPanel';
import Verse from './Verse';

import {ResourcesContext} from '../Resources.context';

export const Chapter = ({
  classes,
  context,
  context: {
    resourceId,
    reference,
    reference: {
      chapter,
    }
  },
  setContext,
}) => {
  const {
    resources,
    resources: {
      tn,
    },
  } = useContext(ResourcesContext);

  const resource = resources[resourceId];
  const verses = Object.keys(resource.data[chapter])
  // .filter(verseKey => {
  //   return /\d+/g.test(verseKey); // don't show front/intro
  // })
  .map(verseKey =>
    <Verse
      key={`${reference.chapter}-${verseKey}`}
      context={context}
      setContext={setContext}
      verseKey={verseKey}
    />
  );
  let intro;
  let tabs = [];
  if (!!tn.data && tn.data[chapter]) {
    intro = (tn.data[chapter]['intro'] && tn.data[chapter]['intro'][0]) ?
    tn.data[chapter]['intro'][0]['occurrence_note']
    .replace(/\[\[rc:\/\//g, 'http://').replace(/\]\]?/g, '')
    : '';
    tabs = [{
      title: tn.manifest.dublin_core.title,
      text: intro,
    }];
  }
  const introPanel = (
    <ExpansionPanel
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

Chapter.propTypes = {
  classes: PropTypes.object.isRequired,
  context: PropTypes.object.isRequired,
  setContext: PropTypes.func.isRequired,
};

export default withStyles(styles)(Chapter);
