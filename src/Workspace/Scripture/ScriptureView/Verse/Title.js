import React from 'react';
import PropTypes from 'prop-types';
import {
  Chip,
  Typography,
} from '@material-ui/core';
import {
  LibraryBooksOutlined,
} from '@material-ui/icons';

export const Title = ({
  manifest: {
    dublin_core: {
      identifier,
      title,
    },
  },
}) => (
  <div style={{width: '100%', textAlign: 'right', marginBottom: '0.5em',}}>
    <Chip
      label={
        <Typography variant='caption'>
          <strong>{identifier.toUpperCase()}</strong> ({title})
        </Typography>
      }
      icon={
        <LibraryBooksOutlined fontSize='small' />
      }
      style={{height: '25px'}}
    />
  </div>
);

Title.propTypes = {
  manifest: PropTypes.object.isRequired,
};

export default Title;
