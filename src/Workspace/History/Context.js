import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import {
  BookmarkBorder,
} from '@material-ui/icons';

import * as ScriptureHelpers from '../Scripture/helpers';

const Context = ({
  classes,
  manifest,
  manifest: {
    dublin_core: {
      subject,
      title,
      language,
    }
  },
  context,
  context: {
    username,
    languageId,
    resourceId,
    reference,
    reference: {
      bookId,
      chapter,
      verse,
    },
  },
  setContext,
}) => {
  let bookName = '';
  if (manifest && manifest.projects && reference && reference.bookId) {
    const project = ScriptureHelpers.projectByBookId(manifest.projects, reference.bookId);
    bookName = project.title;
  }
  return (
    <ListItem
      button
      className={classes.bookListItem}
      style={{
        paddingLeft: '2em',
        paddingRight: '0.7em',
      }}
      onClick={() => {
        setContext(context);
      }}
    >
      <ListItemIcon className={classes.listItemIcon}>
        <BookmarkBorder />
      </ListItemIcon>
      <ListItemText
        className={classes.listItemText}
        primary={`${bookName} ${chapter}${verse ? `:${verse}` : ''}`}
        secondary={`${language.title} - ${title}`}
      />
    </ListItem>
  );
}

Context.propTypes = {
  classes: PropTypes.object.isRequired,
  manifest: PropTypes.object.isRequired,
  context: PropTypes.object.isRequired,
  setContext: PropTypes.func.isRequired,
};

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

export default withStyles(styles)(Context);
