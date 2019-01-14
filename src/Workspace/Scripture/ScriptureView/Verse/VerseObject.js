import React from 'react';
import PropTypes from 'prop-types';

import Milestone from './Milestone';
import Text from './Text';
import Word from './Word';

export const VerseObject = ({classes, verseObject}) => {
  const {type} = verseObject;
  let component;

  switch (type) {
    case 'text':
      component = <Text verseObject={verseObject} />;
      break;
    case 'milestone':
      component = <Milestone verseObject={verseObject} />;
      break;
    case 'word':
      component = <Word verseObject={verseObject} />;
      break;
    default:
      component = <div />;
      break;
  };

  return component;
};

VerseObject.propTypes = {
  verseObject: PropTypes.object.isRequired,
};

export default VerseObject;
