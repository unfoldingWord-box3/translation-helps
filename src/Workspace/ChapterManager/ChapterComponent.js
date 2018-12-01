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
  BookmarkOutlined,
} from '@material-ui/icons';

export const ChapterComponent = ({classes, chapter, verses, reference, setReference}) =>
  <ListItem
    button
    selected={reference.chapter === chapter}
    className={classes.bookListItem}
    style={{
      paddingLeft: '2em',
      paddingRight: '0.7em',
    }}
    onClick={() => {
      setReference({
        book: reference.book,
        chapter: chapter,
      });
    }}
  >
    <ListItemIcon className={classes.listItemIcon}>
      {
        (reference.chapter === chapter) ?
        <Bookmark /> :
        <BookmarkOutlined />
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
  reference: PropTypes.object.isRequired,
  setReference: PropTypes.func.isRequired,
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
