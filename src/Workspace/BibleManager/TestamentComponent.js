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

export const TestamentComponent = ({classes, testamentId, books, reference, setReference}) => {
  const selected = testamentId === 'New Testament';
  const bookComponents = books ?
    books.map((bookMetadata) =>
      <BookComponent
        key={bookMetadata.identifier}
        bookMetadata={bookMetadata}
        reference={reference}
        setReference={setReference}
      />
    ) : [];

  return (
    <div>
      <ListItem
        button
        selected={selected}
        className={classes.fileList}
        style={{
          paddingLeft: '1em',
          paddingRight: '0.5em',
        }}
      >
        <ListItemIcon className={classes.listItemIcon}>
          {
            selected ?
            <Bookmarks fontSize="small" /> :
            <BookmarksOutlined fontSize="small" />
          }
        </ListItemIcon>
        <ListItemText
          inset
          className={classes.listItemText}
          primary={testamentId} />
      </ListItem>
      <Collapse in={selected} timeout="auto" unmountOnExit>
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
  reference: PropTypes.object.isRequired,
  setReference: PropTypes.func.isRequired,
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
