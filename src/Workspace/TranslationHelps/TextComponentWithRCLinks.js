import React from 'react';
import PropTypes from 'prop-types';
import remark from 'remark';
import remark2react from 'remark-react';
import {
} from '@material-ui/core';
import {
} from '@material-ui/icons';

import RCLinkContainer from './RCLinkContainer';

export const TextComponentWithRCLinks = ({classes, text, addTab}) => {
  const options = {
    remarkReactComponents: {
      a: (props) => <RCLinkContainer {...props} addTab={addTab} />,
      div: (props) => <div {...props} style={{width: '100%'}}/>,
    }
  };
  const component = remark()
  .use(remark2react, options)
  .processSync(text).contents;
  return component;
};

TextComponentWithRCLinks.propTypes = {
  text: PropTypes.string.isRequired,
  addTab: PropTypes.func.isRequired,
};

export default TextComponentWithRCLinks;
