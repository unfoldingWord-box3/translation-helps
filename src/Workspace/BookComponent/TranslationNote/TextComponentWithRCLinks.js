import React from 'react';
import PropTypes from 'prop-types';
import remark from 'remark';
import remark2react from 'remark-react';
import {
} from '@material-ui/core';
import {
} from '@material-ui/icons';

import RCLinkContainer from './RCLinkContainer';

export const TextComponentWithRCLinks = ({classes, text}) => {
  const options = {
    remarkReactComponents: {
      a: RCLinkContainer,
    }
  };
  const component = remark()
  .use(remark2react, options)
  .processSync(text).contents;
  return component;
};

TextComponentWithRCLinks.propTypes = {
  classes: PropTypes.object.isRequired,
  text: PropTypes.string.isRequired,
};

export default TextComponentWithRCLinks;
