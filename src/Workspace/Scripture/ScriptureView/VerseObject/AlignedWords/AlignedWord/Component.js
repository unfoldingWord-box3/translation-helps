import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
} from '@material-ui/core';
import {
} from '@material-ui/icons';

export const Component = ({
  classes,
  verseObject,
  senses
}) => {

  return (
    <div>
      <Typography>
        <span><strong>{verseObject.text || verseObject.content}</strong> -</span>
        <span> <em>lemma:</em> {verseObject.lemma}</span>
        <span> <em>strong:</em> {verseObject.strong}</span>
        <br/>
        <span> <em>morph:</em> {verseObject.morph}</span>
      </Typography>
      {
        senses.map((sense, index) =>
          <Typography key={index}>
            <sup>{index + 1}</sup>
            {
              sense.gloss ?
              <span> <em>Gloss:</em> {sense.gloss}</span>
              : ''
            }
            {
              sense.definition ?
              <span> <em>Definition:</em> {sense.definition}</span>
              : ''
            }
          </Typography>
        )
      }
    </div>
  );
};

Component.propTypes = {
  classes: PropTypes.object.isRequired,
  verseObject: PropTypes.object.isRequired,
  senses: PropTypes.array,
};

const styles = theme => ({
  root: {
    width: '100%',
  },
});

export default withStyles(styles)(Component);
