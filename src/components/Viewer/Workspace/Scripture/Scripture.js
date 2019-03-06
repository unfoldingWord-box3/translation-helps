import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  CircularProgress,
} from '@material-ui/core';
import {
} from '@material-ui/icons';

import BookSelection from './BookSelection';
import ChapterSelection from './ChapterSelection';
import ScriptureView from './ScriptureView';

import {ResourcesContext} from './Resources.context';

export const Scripture = ({
  classes,
  manifests,
  context,
  setContext,
  context: {
    reference
  },
  lemmaIndex,
}) => {
  const {populateResources, contextLoaded} = useContext(ResourcesContext);
  populateResources({manifests, context});

  const bookSelection = (
    <BookSelection
      context={context}
      setContext={setContext}
      manifests={manifests}
    />
  );
  const chapterSelection = (
    <ChapterSelection
      context={context}
      setContext={setContext}
      manifests={manifests}
    />
  );
  const scriptureView = (
    <ScriptureView
      context={context}
      setContext={setContext}
    />
  );
  const loadingComponent = (
    <CircularProgress className={classes.progress} color="secondary" disableShrink />
  );

  let component = loadingComponent;
  const shouldShowBookSelection = (!reference || !reference.bookId);
  const shouldShowChapterSelection = (reference && reference.bookId && !reference.chapter);
  const shouldShowScriptureView = (contextLoaded.reference && contextLoaded.reference.bookId);

  if (shouldShowBookSelection) component = bookSelection;
  else if (shouldShowChapterSelection) component = chapterSelection;
  else if (shouldShowScriptureView) component = scriptureView;
  return (
    <div className={classes.root}>
      {component}
    </div>
  );
}

Scripture.propTypes = {
  classes: PropTypes.object.isRequired,
  context: PropTypes.object.isRequired,
  setContext: PropTypes.func.isRequired,
  manifests: PropTypes.object,
};

const styles = theme => ({
  root: {
    width: '100%',
  },
  progress: {
    margin: 'auto',
    display: 'block',
  },
});

export default withStyles(styles)(Scripture);
