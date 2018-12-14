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
  Bookmarks,
  BookmarksOutlined,
} from '@material-ui/icons';

import BookComponent from './BookComponent';

export const TestamentComponent = ({
  classes,
  testamentId,
  books,
  context,
  setContext,
  open,
  toggle
}) => {
  const bookComponents = books ?
    books.map((bookMetadata) =>
      <BookComponent
        key={bookMetadata.identifier}
        bookMetadata={bookMetadata}
        context={context}
        setContext={setContext}
      />
    ) : [];

  return (
    <div>
      <ListItem
        button
        selected={open}
        className={classes.fileList}
        style={{
          paddingLeft: '1em',
          paddingRight: '0.5em',
        }}
        onClick={toggle}
      >
        <ListItemIcon className={classes.listItemIcon}>
          {
            open ?
            <Bookmarks /> :
            <BookmarksOutlined />
          }
        </ListItemIcon>
        <ListItemText
          inset
          className={classes.listItemText}
          primary={testamentId}
          secondary={books.length + ' Books'}
        />
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List dense className={classes.list}>
          {bookComponents}
        </List>
      </Collapse>
    </div>
  );
}

TestamentComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  testamentId: PropTypes.string.isRequired,
  books: PropTypes.array.isRequired,
  context: PropTypes.object.isRequired,
  setContext: PropTypes.func.isRequired,
}
const styles = theme => ({
  list: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  listItemIcon: {
    marginRight: 0,
  },
  listItemText: {
    paddingLeft: '0.7em',
  },
});

export default withStyles(styles, { withTheme: true })(TestamentComponent);
