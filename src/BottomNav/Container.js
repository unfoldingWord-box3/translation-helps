import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import {
  Paper,
  BottomNavigation,
  BottomNavigationAction,
  IconButton,
} from '@material-ui/core';
import {
  LibraryBooks,
  Book,
  Bookmark,
  KeyboardArrowLeft,
  KeyboardArrowRight,
} from '@material-ui/icons';

import {chaptersInBook} from '../chaptersAndVerses';

class BottomNavContainer extends React.Component {
  handleChange = (event, value) => {
    let {
      context,
      context: {
        username,
        languageId,
        reference,
      }
    } = this.props;
    switch (value) {
      case 0:
        this.previousChapter();
        break;
      case 1:
        context = {username, languageId, reference: {}};
        break;
      case 2:
        context.reference = {};
        break;
      case 3:
        context.reference = {bookId: reference.bookId};
        break;
      case 4:
        this.nextChapter();
        break;
      default:
        break;
    };
    this.props.setContext(context);
  };

  previousChapter = () => {
    let {context} = this.props;
    let {chapter} = context.reference;
    if (chapter > 1) context.reference.chapter = context.reference.chapter - 1;
    this.props.setContext(context);
  };

  nextChapter = () => {
    let {context} = this.props;
    let {bookId, chapter} = context.reference;
    if (chapter < chaptersInBook(bookId).length) context.reference.chapter = context.reference.chapter + 1;
    this.props.setContext(context);
  };

  render() {
    const { classes, context } = this.props;

    let value;
    const couldShowReference = (!context.resourceId);
    const couldShowBook = (!context.resourceId === 'obs' && !(context.reference && context.reference.bookId));
    const couldShowChapter = (!(context.reference && context.reference.chapter));

    if (couldShowReference) { value = 1; }
    else if (couldShowBook) { value = 2; }
    else if (couldShowChapter) { value = 3; }

    return (
      <Paper className={classes.root}>
        <BottomNavigation
          value={value}
          onChange={this.handleChange}
          showLabels
          className={classes.root}
        >
          <BottomNavigationAction
            icon={<KeyboardArrowLeft />}
          />
          <BottomNavigationAction
            label="Resources"
            icon={<LibraryBooks />}
          />
          <BottomNavigationAction
            label="Books"
            icon={<Book />}
          />
          <BottomNavigationAction
            label="Chapters"
            icon={<Bookmark />}
          />
          <BottomNavigationAction
            icon={<KeyboardArrowRight />}
          />
        </BottomNavigation>
      </Paper>
    );
  }
}

BottomNavContainer.propTypes = {
  classes: PropTypes.object.isRequired,
  context: PropTypes.object.isRequired,
  setContext: PropTypes.func.isRequired,
};

const styles = theme => ({
  root: {
    width: '100%',
  },
});

export default withStyles(styles, { withTheme: true })(BottomNavContainer);
