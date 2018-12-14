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
    original,
    tn,
  },
}) => {
  const chapterComponent = (
    <ChapterComponent
      context={context}
      setContext={setContext}
      bookChapterData={ult[chapter]}
      originalChapterData={original[chapter]}
      translationNotesChapterData={tn[chapter]}
    />
  );
  const intro = tn['front']['intro'][0]['occurrence_note'];
  const introDetails = intro.split('\n').splice(1).join('\n')
    .replace(/\[\[rc:\/\//g, 'http://').replace(/\]\]?/g, '');
  const tabs = [{
    title: 'Book Notes',
    text: introDetails
  }];
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
};

export default withStyles(styles)(BookComponent);
