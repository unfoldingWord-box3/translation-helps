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

export const Component = ({
  classes,
  storyKey,
  frames,
  context,
  setContext,
  context: {
    reference,
  },
}) =>
  <ListItem
    button
    selected={reference.chapter === storyKey}
    className={classes.bookListItem}
    style={{
      paddingLeft: '2em',
      paddingRight: '0.7em',
    }}
    onClick={() => {
      context.reference = {
        bookId: reference.bookId,
        chapter: storyKey,
      };
      setContext(context);
    }}
  >
    <ListItemIcon className={classes.listItemIcon}>
      {
        (reference.chapter === storyKey) ?
        <Bookmark /> :
        <BookmarkBorder />
      }
    </ListItemIcon>
    <ListItemText
      className={classes.listItemText}
      primary={`Story ${frames[0].text.replace('#','').trim()}`}
      secondary={Object.keys(frames).length + ' Frames' }
    />
  </ListItem>

Component.propTypes = {
  classes: PropTypes.object.isRequired,
  context: PropTypes.object.isRequired,
  setContext: PropTypes.func.isRequired,
  storyKey: PropTypes.number.isRequired,
  frames: PropTypes.object.isRequired,
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

export default withStyles(styles)(Component);
