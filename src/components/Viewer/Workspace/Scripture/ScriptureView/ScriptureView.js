import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import { withStyles } from '@material-ui/core/styles';

import styles from '../../styles';

import ExpansionPanel from './ExpansionPanel';
import Chapter from './Chapter';
import TranslationHelps from '../../TranslationHelps';
import AlignmentsTable from './AlignmentsTable';
import TranslationNotesTable from './TranslationNotesTable';
import VerseCountTable from './VerseCountTable';

import * as helpers from '../helpers';
import * as ScriptureHelpers from '../helpers';

import {ResourcesContext} from '../Resources.context';
import {LemmaIndexContextProvider} from './AlignmentsTable/LemmaIndex.context';

export const ScriptureView = ({
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
}) => {
  const {
    resources,
  } = useContext(ResourcesContext);

  let tabs = [];
  let tnObject = {};
  let intro;

  if (resources && resources.tn && resources.tn.data) {
    const { tn } = resources;
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

  const verseCountTable = (
    <VerseCountTable />
  );
  tabs.push({ title: "Verse Counts", content: verseCountTable });

  const alignmentsTable = (
    <LemmaIndexContextProvider>
      <AlignmentsTable />
    </LemmaIndexContextProvider>
  );
  tabs.push({ title: "Search Words", content: alignmentsTable });

  const tnManifest = resources.tn ? resources.tn.manifest : {};
  const _resources = {
    ...resources,
    tn: {
      manifest: tnManifest,
      data: tnObject,
    },
  };
  const chapterComponent = (
    <Chapter
      context={context}
      setContext={setContext}
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

ScriptureView.propTypes = {
  classes: PropTypes.object.isRequired,
  setContext: PropTypes.func.isRequired,
  context: PropTypes.object.isRequired,
};

export default withStyles(styles)(ScriptureView);
