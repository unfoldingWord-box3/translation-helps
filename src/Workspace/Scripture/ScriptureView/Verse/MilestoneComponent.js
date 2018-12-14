import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
} from '@material-ui/core';
import {
} from '@material-ui/icons';

import VerseObjectComponent from './VerseObjectComponent';
import OriginalWordsContainer from './OriginalWordsContainer';

export const MilestoneComponent = ({classes, verseObject, originalWords}) => {
  originalWords.push(verseObject);
  const container = (verseObject.children[0].type === 'milestone') ?
    verseObject.children.map((child, index) =>
      <VerseObjectComponent
        key={index}
        verseObject={child}
        originalWords={originalWords}
      />
    ) :
    <OriginalWordsContainer
      originalWords={originalWords}
      children={verseObject.children}
    />;

  return container;
};

MilestoneComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  verseObject: PropTypes.object.isRequired,
  originalWords: PropTypes.array,
};

const styles = theme => ({
  root: {
    width: '100%',
  },
});

export default withStyles(styles, { withTheme: true })(MilestoneComponent);
