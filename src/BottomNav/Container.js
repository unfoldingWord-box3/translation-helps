import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import {
  Paper,
  BottomNavigation,
  BottomNavigationAction,
} from '@material-ui/core';
import {
  LibraryBooks,
  Book,
  Bookmark,
  History,
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
        context = {username, languageId, view: 'history'};
        break;
      case 2:
        context = {username, languageId, reference: {}};
        break;
      case 3:
        context.reference = {};
        break;
      case 4:
        if (reference) context.reference = {bookId: reference.bookId};
        break;
      case 5:
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
    if (chapter > 1) {
      context.reference.chapter = context.reference.chapter - 1;
      context.reference.verse = undefined;
    }
    this.props.setContext(context);
  };

  nextChapter = () => {
    let {context} = this.props;
    let {bookId, chapter} = context.reference;
    if (chapter < chaptersInBook(bookId).length) {
      context.reference.chapter = context.reference.chapter + 1
      context.reference.verse = undefined;
    }
    this.props.setContext(context);
  };

  render() {
    const { classes, context } = this.props;

    const shouldShowHistory = (context.view === 'history');
    const couldShowReference = (!context.resourceId);
    const couldShowBook = (!(context.resourceId === 'obs') && !(context.reference && context.reference.bookId));
    const couldShowChapter = (!(context.reference && context.reference.chapter));

    let value;
    if (shouldShowHistory) { value = 1; }
    else if (couldShowReference) { value = 2; }
    else if (couldShowBook) { value = 3; }
    else if (couldShowChapter) { value = 4; }

    return (
      <Paper className={classes.root}>
        <BottomNavigation
          value={value}
          onChange={this.handleChange}
          showLabels={true}
          className={classes.bottomNavigation}
        >
          <BottomNavigationAction
            className={classes.button}
            icon={<KeyboardArrowLeft />}
          />
          <BottomNavigationAction
            className={classes.button}
            label="History"
            icon={<History />}
          />
          <BottomNavigationAction
            className={classes.button}
            label="Resources"
            icon={<LibraryBooks />}
          />
          <BottomNavigationAction
            className={classes.button}
            label="Books"
            icon={<Book />}
          />
          <BottomNavigationAction
            className={classes.button}
            label="Chapters"
            icon={<Bookmark />}
          />
          <BottomNavigationAction
            className={classes.button}
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
  bottomNavigation: {
    margin: '0 auto',
    maxWidth: '40em',
  },
  button: {
    paddingLeft: '0',
    paddingRight: '0',
    minWidth: '60px',
  },
});

export default withStyles(styles, { withTheme: true })(BottomNavContainer);
