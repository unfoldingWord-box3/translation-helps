import React from 'react';
import PropTypes from 'prop-types';

import Milestone from './Milestone';
import Text from './Text';
import Word from './Word';
import AlignedWords from './AlignedWords';

export const Component = ({
  classes,
  verseObject,
  originalWords=[],
}) => {
  const {type} = verseObject;
  let component;

  switch (type) {
    case 'text':
      component = <Text verseObject={verseObject} />;
      break;
    case 'quote':
      component = <blockquote><Text verseObject={verseObject} /></blockquote>;
      break;
    case 'milestone':
      component = (
        <Milestone
          verseObject={verseObject}
          originalWords={originalWords}
        />
      );
      break;
    case 'word':
      if (verseObject.strong) {
        component = (
          <AlignedWords
            children={[verseObject]}
            originalWords={[verseObject]}
          />
        );
      } else {
        component = <Word verseObject={verseObject} />;
      }
      break;
    case 'section':
      component = <span/>;
      break;
    case 'paragraph':
      component = <span/>;
      break;
    case 'footnote':
      component = <sup>*</sup>;
      break;
    default:
      debugger
      component = <span>...</span>;
      break;
  };

  return (
    <span data-verse-object={JSON.stringify(verseObject)}>
      {component}
      {verseObject.nextChar}
    </span>
  );
};

Component.propTypes = {
  verseObject: PropTypes.object.isRequired,
  originalWords: PropTypes.array,
};

export default Component;
