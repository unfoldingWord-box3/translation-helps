import React from 'react';
import PropTypes from 'prop-types';
import {
  Typography,
} from '@material-ui/core';

export const Title = ({
  manifest: {
    dublin_core: {
      identifier,
      title,
    },
  },
}) => (
  <Typography variant="caption" align="right" gutterBottom>
    <strong>{identifier.toUpperCase()}</strong> {title}
  </Typography>
);

Title.propTypes = {
  manifest: PropTypes.object.isRequired,
};

export default Title;
