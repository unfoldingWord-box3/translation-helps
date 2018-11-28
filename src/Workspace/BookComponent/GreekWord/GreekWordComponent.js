import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
} from '@material-ui/core';
import {
} from '@material-ui/icons';

export const GreekWordComponent = ({classes, verseObject, senses}) => {

  return (
    <div>
      <Typography><strong>{verseObject.content}</strong></Typography>
      <Typography><em>lemma:</em> {verseObject.lemma}</Typography>
      <Typography><em>strong:</em> {verseObject.strong}</Typography>
      {
        senses.map((sense, index) =>
          <div key={index}>
            {
              sense.gloss ?
              <Typography><em>Gloss:</em> {sense.gloss}</Typography>
              : ''
            }
            {
              sense.definition ?
              <Typography><em>Definition:</em> {sense.definition}</Typography>
              : ''
            }
          </div>
        )
      }
    </div>
  );
};

GreekWordComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  verseObject: PropTypes.object.isRequired,
  senses: PropTypes.array,
};

const styles = theme => ({
  root: {
    width: '100%',
  },
});

export default withStyles(styles)(GreekWordComponent);
