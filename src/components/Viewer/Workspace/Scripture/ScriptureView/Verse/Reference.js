import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import styles from '../../../styles';

import VerseObject from '../VerseObject';
import Title from './Title';

export const Reference = ({
  classes,
  verseKey,
  context: {
    reference: {
      chapter,
    },
  },
  resource: {
    manifest,
    manifest: {
      dublin_core:{
        language: {
          direction,
        },
      },
    },
    data,
  },
  noTitle,
}) => {

  let verse = <span />;
  if (data[chapter][verseKey] && data[chapter][verseKey].verseObjects) {
    verse = data[chapter][verseKey].verseObjects.map((verseObject, index) =>
      <VerseObject
        key={index}
        verseObject={verseObject}
      />
    );
  }

  let titleComponent = <span />;
  if (!noTitle) {
    titleComponent = (
      <Title
        manifest={manifest}
      />
    );
  }

  return (
    <div className={classes.verse}>
      <div style={{direction: direction}}>
        <sup>{verseKey} </sup>
        {verse}
      </div>
      {titleComponent}
    </div>
  );
};

Reference.propTypes = {
  classes: PropTypes.object.isRequired,
  verseKey: PropTypes.string.isRequired,
  resource: PropTypes.object.isRequired,
  context: PropTypes.object.isRequired,
  noTitle: PropTypes.bool,
};

export default withStyles(styles, { withTheme: true })(Reference);
