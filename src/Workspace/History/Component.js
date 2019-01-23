import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  Paper,
  List,
} from '@material-ui/core';

import Context from './Context';

export const Component = ({
  classes,
  setContext,
  manifests,
  contexts,
}) => {
  let contextComponents = [];
  if (contexts) {
    contextComponents = contexts
    .map((context, index) => (
      <Context
      key={index + JSON.stringify(context)}
      context={context}
      setContext={setContext}
      manifest={manifests[context.resourceId]}
      />
    ));
  }
  return (
    <Paper className={classes.root}>
      <List
        className={classes.root}
        component="nav"
        dense
      >
        <div className={classes.list}>
          {contextComponents}
        </div>
      </List>
    </Paper>
  );
};

Component.propTypes = {
  contexts: PropTypes.array,
  setContext: PropTypes.func.isRequired,
  manifests: PropTypes.object.isRequired,
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
