import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  Paper,
  List,
} from '@material-ui/core';

import Chapter from './Chapter';

import * as chaptersAndVerses from '../../../chaptersAndVerses';

export const Component = ({
  classes,
  bookData,
  context,
  setContext,
  context: {
    reference,
    reference: {
      bookId,
    },
  },
}) => {
  const chapters = chaptersAndVerses.chaptersInBook({bookId})
  .map((verses, index) =>
    <Chapter
      key={index}
      chapter={index+1}
      verses={verses}
      context={context}
      setContext={setContext}
    />
  );

  return (
    <Paper className={classes.root}>
      <List
        className={classes.root}
        component="nav"
        dense
      >
        <div className={classes.list}>
          {chapters}
        </div>
      </List>
    </Paper>
  );
};

Component.propTypes = {
  classes: PropTypes.object.isRequired,
  context: PropTypes.object.isRequired,
  setContext: PropTypes.func.isRequired,
};

const styles = theme => ({
  root: {
    height: '100%',
    maxWidth: '40em',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  list: {
    height: '100%',
    overflowY: 'auto',
  },
});

export default withStyles(styles)(Component);
