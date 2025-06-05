import React from 'react';
import PropTypes from 'prop-types';

import VerseObject from '../VerseObject';
import AlignedWords from './AlignedWords';

export const Milestone = ({
  classes,
  originalWords,
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
      let _originalWords = JSON.parse(JSON.stringify(originalWords));
      _originalWords.push(originalWord);
      if (children.length === 1 && children[0].type === 'milestone') {
        component = (
          <VerseObject
            verseObject={children[0]}
            originalWords={_originalWords}
          />
        );
      } else {
        component = (
          <AlignedWords
            originalWords={_originalWords}
            children={children}
          />
        );
      }
      break;
    default:
      component = (<div/>);
      break;
  }

  return component;
};

Milestone.propTypes = {
  verseObject: PropTypes.object.isRequired,
  originalWords: PropTypes.array,
};

export default Milestone;
