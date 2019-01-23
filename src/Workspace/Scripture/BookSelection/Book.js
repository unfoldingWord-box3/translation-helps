import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import {
  Book,
  BookOutlined,
} from '@material-ui/icons';

import * as chaptersAndVerses from '../../../chaptersAndVerses';

export const Component = ({
  classes,
  bookMetadata,
  context,
  setContext,
  context: {
    reference,
  },
}) => {
  const bookId = bookMetadata.identifier;
  const chapterCount = chaptersAndVerses.chaptersInBook({bookId}).length;
  return (
    <ListItem
      button
      selected={reference.bookId === bookMetadata.identifier}
      className={classes.bookListItem}
      style={{
        paddingLeft: '2.2em',
        paddingRight: '0.7em',
      }}
      onClick={() => {
        context.reference = {
          bookId: bookId
        }
        setContext(context);
      }}
    >
      <ListItemIcon className={classes.listItemIcon}>
        {
          (reference.bookId === bookMetadata.identifier) ?
          <Book /> :
          <BookOutlined />
        }
      </ListItemIcon>
      <ListItemText
        className={classes.listItemText}
        primary={bookMetadata.title}
        secondary={chapterCount + ' Chapters' }
      />
    </ListItem>
  );
}

Component.propTypes = {
  classes: PropTypes.object.isRequired,
  bookMetadata: PropTypes.object.isRequired,
  context: PropTypes.object.isRequired,
  setContext: PropTypes.func.isRequired,
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

export default withStyles(styles, { withTheme: true })(Component);
