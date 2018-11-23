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
} from '@material-ui/icons';

import BookComponent from './BookComponent';

export const TestamentComponent = ({classes, testamentId, books, reference, setReference}) => {
  const selected = books.map(book => book.identifier).includes(reference.book);
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
        className={classes.fileList}
        style={{
          paddingLeft: '1em',
          paddingRight: '0.5em',
        }}
      >
        <ListItemIcon className={classes.listItemIcon}>
          {
            selected ?
            <Folder fontSize="small" /> :
            <FolderOpen fontSize="small" />
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

export default withStyles(styles)(TestamentComponent);
