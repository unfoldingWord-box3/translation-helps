import React from 'react';
import PropTypes from 'prop-types';

import VerseObject from './VerseObject';
import OriginalWords from './OriginalWords';

export const Milestone = ({
  classes,
  verseObject: {
    tag,
    children,
    tw,
    strong,
    lemma,
    morph,
    occurrence,
    occurrences,
    content,
  },
}) => {
  let component;
  switch (tag) {
    case 'k':
      component = children.map((child, index) =>
        <VerseObject
          key={index}
          verseObject={child}
        />
      );
      break;
    case 'zaln':
      const originalWord = {
        strong,
        lemma,
        morph,
        occurrence,
        occurrences,
        content,
      };
      component = (
        <OriginalWords
          originalWords={[originalWord]}
          children={children}
        />
      );
      break;
    default:
      component = (<div/>);
      break;
  }

  return component;
};

Milestone.propTypes = {
  classes: PropTypes.object.isRequired,
  verseObject: PropTypes.object.isRequired,
  originalWords: PropTypes.array,
};

export default Milestone;
