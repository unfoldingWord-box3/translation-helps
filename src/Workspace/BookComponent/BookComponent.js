import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import { withStyles } from '@material-ui/core/styles';
import {
} from '@material-ui/core';
import {
} from '@material-ui/icons';

import styles from './styles';

import ExpansionComponent from './ExpansionComponent';
import ChapterComponent from './ChapterComponent';
import TranslationHelps from '../TranslationHelps';

export const BookComponent = ({
  classes,
  languageId,
  reference,
  bookData,
  ugntData,
  translationNotesData,
  setReference,
}) => {
  const {chapter} = reference;
  const chapterComponent = (
    <ChapterComponent
      languageId={languageId}
      chapterKey={reference.chapter}
      bookChapterData={bookData.chapters[chapter]}
      ugntChapterData={ugntData ? ugntData.chapters[chapter] : null}
      translationNotesChapterData={translationNotesData[chapter]}
      setReference={setReference}
      reference={reference}
    />
  );
  const intro = translationNotesData['front']['intro'][0]['occurrence_note'];
  const introDetails = intro.split('\n').splice(1).join('\n')
    .replace(/\[\[rc:\/\//g, 'http://').replace(/\]\]?/g, '');
  const tabs = [{
    title: 'Book Notes',
    text: introDetails
  }];
  return (
    <div className={classes.root}>
      <ExpansionComponent
        key={''+reference.book+'intro'}
        summary={
          <ReactMarkdown
            source={intro.split('\n')[0]}
            escapeHtml={false}
          />
        }
        details={
          <TranslationHelps
            setReference={setReference}
            languageId={languageId}
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
  bookData: PropTypes.object.isRequired,
  translationNotesData: PropTypes.object,
  languageId: PropTypes.string.isRequired,
  ugntData: PropTypes.object,
  setReference: PropTypes.func.isRequired,
  reference: PropTypes.object.isRequired,
};

export default withStyles(styles)(BookComponent);
