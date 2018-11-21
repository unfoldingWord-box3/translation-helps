import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
} from '@material-ui/core';
import {
  Folder,
  FolderOpen,
  Note,
  NoteOutlined,
} from '@material-ui/icons';
import {
  ProgressBar,
} from 'react-bootstrap';

import Directory from './Directory';

export const File = ({classes, fileObject, depth, percentTranslated ,percentVerified}) => {

  const children = (
    <Collapse in={true} timeout="auto" unmountOnExit>
      <List dense className={classes.list}>
        <Directory
          fileTree={fileObject.children}
          selected={fileObject.selected}
          depth={depth + 1}
        />
      </List>
    </Collapse>
  )

  const directory = (
    <div>
      <ListItem
        button
        className={classes.fileList}
        style={{
          paddingLeft: depth + 'em',
          paddingRight: '0.5em',
        }}
      >
        <ListItemIcon className={classes.listItemIcon}>
          {
            fileObject.selected ? <Folder fontSize="small" /> : <FolderOpen fontSize="small" />
          }
        </ListItemIcon>
        <ListItemText
          inset
          className={classes.listItemText}
          primary={fileObject.name + '/'} />
      </ListItem>
      {fileObject.children ? children : null}
    </div>
  );

  const file = (
    <ListItem
      button
      selected={fileObject.selected}
      className={classes.fileList}
      style={{
        paddingLeft: depth + 'em',
        paddingRight: '0.7em',
      }}
    >
      <ListItemIcon className={classes.listItemIcon}>
        {
          fileObject.selected ? <Note fontSize="small" /> : <NoteOutlined fontSize="small" />
        }
      </ListItemIcon>
      <ListItemText
        className={classes.listItemText}
        primary={fileObject.name}
      />
      <ProgressBar className={classes.progressBar}>
        <ProgressBar
          className={classes.progressVerified}
          now={percentVerified}
        />
        <ProgressBar
          className={classes.progressTranslated}
          now={percentTranslated - percentVerified}
        />
      </ProgressBar>
    </ListItem>
  );

  const component = fileObject.type === 'directory' ? directory : file;

  return component;
}

File.propTypes = {
  classes: PropTypes.object.isRequired,
  fileObject: PropTypes.object.isRequired,
  depth: PropTypes.number.isRequired,
  percentTranslated: PropTypes.number,
  percentVerified: PropTypes.number,
}

const styles = theme => ({
  list: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  fileList: {
  },
  listItemIcon: {
    marginRight: 0,
  },
  listItemText: {
    paddingLeft: '0.7em',
  },
  progressBar: {
    width: '3em',
    height: '1em',
    backgroundColor: '#eee',
  },
  progressVerified: {
    height: '100%',
    backgroundColor: '#aaa',
    float: 'left',
  },
  progressTranslated: {
    height: '100%',
    backgroundColor: '#ccc',
    float: 'left',
  },
});

export default withStyles(styles)(File);
