import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import { withStyles } from '@material-ui/core/styles';
import {
} from '@material-ui/core';
import {
} from '@material-ui/icons';

import styles from '../../styles';

import ExpansionPanelContainer from './ExpansionPanelContainer';
import ChapterComponent from './ChapterComponent';
import TranslationHelps from '../../TranslationHelps';
import AlignmentsTable from './AlignmentsTable';
import TranslationNotesTable from './TranslationNotesTable';

import * as helpers from '../helpers';

export const BookComponent = ({
  classes,
  context,
  setContext,
  context: {
    reference: {
      chapter,
    },
  },
  resources: {
    ult,
    ust,
    original,
    tn,
  },
  lemmaIndex,
}) => {
  let tnObject = helpers.pivotTranslationNotes(tn);
  let tabs = [];

  const intro = tnObject['front']['intro'][0]['occurrence_note'];
  const introDetails = intro.split('\n').splice(1).join('\n')
    .replace(/\[\[rc:\/\//g, 'http://').replace(/\]\]?/g, '');
  tabs.push({ title: 'Book Notes', text: introDetails});

  if (tn) {
    const content = (
      <TranslationNotesTable
        tn={tn}
      />
    );
    tabs.push({ title: 'Search Notes', content });
  }

  if (lemmaIndex && Object.keys(lemmaIndex).length > 0) {
    const content = (
      <AlignmentsTable
        lemmaIndex={lemmaIndex}
      />
    );
    tabs.push({ title: "Search Words", content });
  }

  const chapterComponent = (
    <ChapterComponent
      context={context}
      setContext={setContext}
      lemmaIndex={lemmaIndex}
      ultChapterData={ult[chapter]}
      ustChapterData={ust[chapter]}
      originalChapterData={original[chapter]}
      translationNotesChapterData={tnObject[chapter]}
    />
  );
  return (
    <div className={classes.root}>
      <ExpansionPanelContainer
        key={''+context.reference.bookId+'intro'}
        summary={
          <ReactMarkdown
            source={intro.split('\n')[0]}
            escapeHtml={false}
          />
        }
        details={
          <TranslationHelps
            context={context}
            setContext={setContext}
            tabs={tabs}
          />
        }
      />
      {chapterComponent}
    </div>
  );
};

BookComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  resources: PropTypes.object.isRequired,
  setContext: PropTypes.func.isRequired,
  context: PropTypes.object.isRequired,
  lemmaIndex: PropTypes.object,
};

export default withStyles(styles)(BookComponent);
