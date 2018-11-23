import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import {
  Note,
  NoteOutlined,
} from '@material-ui/icons';

export const BookComponent = ({classes, bookMetadata, selected}) =>
  <ListItem
    button
    selected={selected}
    className={classes.bookListItem}
    style={{
      paddingLeft: '1em',
      paddingRight: '0.7em',
    }}
  >
    <ListItemIcon className={classes.listItemIcon}>
      {
        selected ?
        <Note fontSize="small" /> :
        <NoteOutlined fontSize="small" />
      }
    </ListItemIcon>
    <ListItemText
      className={classes.listItemText}
      primary={bookMetadata.title}
    />
  </ListItem>

BookComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  bookMetadata: PropTypes.object.isRequired,
  selected: PropTypes.bool,
}

const styles = theme => ({
  bookListItem: {
  },
  listItemIcon: {
    marginRight: 0,
  },
  listItemText: {
    paddingLeft: '0.7em',
  },
});

export default withStyles(styles)(BookComponent);
