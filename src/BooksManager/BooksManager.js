import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  List,
  ListItem,
} from '@material-ui/core';

import Directory from './Directory';

export const FileManager = ({classes, fileTree}) =>
  <div className={classes.files}>
    <List
      className={classes.files}
      component="nav"
      dense
    >
      <div className={classes.fileList}>
        <Directory fileTree={fileTree} depth={1} />
        <ListItem />
        <ListItem />
        <ListItem />
        <ListItem />
        <ListItem />
      </div>
    </List>
  </div>

FileManager.propTypes = {
  fileTree: PropTypes.array.isRequired,
  classes: PropTypes.object.isRequired,
};

const styles = theme => ({
  files: {
    height: '100%',
  },
  fileList: {
    height: '100%',
    overflowY: 'auto',
  },
});

export default withStyles(styles)(FileManager);
