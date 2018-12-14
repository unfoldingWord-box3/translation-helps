import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import {
  Bookmark,
  BookmarkBorder,
} from '@material-ui/icons';

export const ChapterComponent = ({
  classes,
  chapter,
  verses,
  context,
  setContext,
  context: {
    reference,
  },
}) =>
  <ListItem
    button
    selected={reference.chapter === chapter}
    className={classes.bookListItem}
    style={{
      paddingLeft: '2em',
      paddingRight: '0.7em',
    }}
    onClick={() => {
      context.reference = {
        bookId: reference.bookId,
        chapter,
      };
      setContext(context);
    }}
  >
    <ListItemIcon className={classes.listItemIcon}>
      {
        (reference.chapter === chapter) ?
        <Bookmark /> :
        <BookmarkBorder />
      }
    </ListItemIcon>
    <ListItemText
      className={classes.listItemText}
      primary={'Chapter ' + chapter}
      secondary={verses + ' Verses' }
    />
  </ListItem>

ChapterComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  context: PropTypes.object.isRequired,
  setContext: PropTypes.func.isRequired,
  chapter: PropTypes.number.isRequired,
  verses: PropTypes.number.isRequired,
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

export default withStyles(styles)(ChapterComponent);
