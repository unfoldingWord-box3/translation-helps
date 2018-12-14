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
} from '@material-ui/icons';

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
        context = {username, languageId, reference: {}};
        break;
      case 1:
        context.reference = {};
        break;
      case 2:
        context.reference = {bookId: reference.bookId};
        break;
      default:
        break;
    };
    this.props.setContext(context);
  };

  render() {
    const { classes, context } = this.props;

    let value;
    const couldShowReference = (!context.resourceId);
    const couldShowBook = (!context.resourceId === 'obs' && !(context.reference && context.reference.bookId));
    const couldShowChapter = (!(context.reference && context.reference.chapter));

    if (couldShowReference) { value = 0; }
    else if (couldShowBook) { value = 1; }
    else if (couldShowChapter) { value = 2; }

    return (
      <Paper className={classes.root}>
        <BottomNavigation
          value={value}
          onChange={this.handleChange}
          showLabels
          className={classes.root}
        >
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
