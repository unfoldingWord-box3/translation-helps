import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import { withStyles } from '@material-ui/core/styles';

import styles from '../../styles';

import ExpansionPanel from './ExpansionPanel';
import Chapter from './Chapter';
import TranslationHelps from '../../TranslationHelps';
import AlignmentsTable from './AlignmentsTable';
import TranslationNotesTable from './TranslationNotesTable';

import * as helpers from '../helpers';
import * as ScriptureHelpers from '../helpers';

export const Component = ({
  classes,
  context,
  setContext,
  context: {
    resourceId,
    reference: {
      bookId,
      chapter,
    },
  },
  resources,
  resources: {
    original,
    tn,
  },
  lemmaIndex,
}) => {
  let tabs = [];
  let tnObject = {};
  let intro;

  if (!!tn.data) {
    tnObject = helpers.pivotTranslationNotes({tn: tn.data});

    intro = tnObject['front']['intro'][0]['occurrence_note'];
    const introDetails = intro.split('\n').splice(1).join('\n')
    .replace(/\[\[rc:\/\//g, 'http://').replace(/\]\]?/g, '');
    tabs.push({ title: 'Book Notes', text: introDetails});

    if (!!tn) {
      const content = (
        <TranslationNotesTable
          tn={tn.data}
        />
      );
      tabs.push({ title: 'Search Notes', content });
    }
  }

  if (lemmaIndex && Object.keys(lemmaIndex).length > 0) {
    const content = (
      <AlignmentsTable
        lemmaIndex={lemmaIndex}
      />
    );
    tabs.push({ title: "Search Words", content });
  }
  const _resources = {
    ...resources,
    tn: {
      manifest: tn.manifest,
      data: tnObject,
    },
  };
  const chapterComponent = (
    <Chapter
      context={context}
      setContext={setContext}
      lemmaIndex={lemmaIndex}
      resources={_resources}
      translationNotesChapterData={tnObject[chapter]}
    />
  );
  const resource = resources[resourceId];
  const {projects} = resource.manifest;
  const project = ScriptureHelpers.projectByBookId({projects, bookId});
  const bookName = project ? project.title : '';
  return (
    <div className={classes.root}>
      <ExpansionPanel
        key={''+context.reference.bookId+'intro'}
        summary={
          <ReactMarkdown
            source={`# ${bookName}`}
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

Component.propTypes = {
  classes: PropTypes.object.isRequired,
  resources: PropTypes.object.isRequired,
  setContext: PropTypes.func.isRequired,
  context: PropTypes.object.isRequired,
  lemmaIndex: PropTypes.object,
};

export default withStyles(styles)(Component);
