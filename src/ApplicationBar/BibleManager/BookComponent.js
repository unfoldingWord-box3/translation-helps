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

export const BookComponent = ({classes, bookMetadata, reference, setReference}) =>
  <ListItem
    button
    className={classes.bookListItem}
    style={{
      paddingLeft: '2em',
      paddingRight: '0.7em',
    }}
    onClick={() => {
      setReference({
        book: bookMetadata.identifier,
        chapter: 1,
        verse: 1,
      });
    }}
  >
    <ListItemIcon className={classes.listItemIcon}>
      {
        (reference.book === bookMetadata.identifier) ?
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
  reference: PropTypes.object.isRequired,
  setReference: PropTypes.func.isRequired,
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
