import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import {
  Paper,
  BottomNavigation,
  BottomNavigationAction,
} from '@material-ui/core';
import {
  Bookmarks,
  Book,
  Bookmark,
} from '@material-ui/icons';

class BottomNavContainer extends React.Component {
  handleChange = (event, value) => {
    let newReference = this.props.reference;
    switch (value) {
      case 1:
        newReference = {};
        break;
      case 2:
        newReference = {book: this.props.reference.book};
        break;
      default:
        break;
    };
    this.props.setReference(newReference);
  };

  render() {
    const { classes, reference } = this.props;

    let value = null;
    if (!reference.book) {
      value = 1;
    } else if (!reference.chapter) {
      value = 2;
    }

    return (
      <Paper className={classes.root}>
        <BottomNavigation
          value={value}
          onChange={this.handleChange}
          showLabels
          className={classes.root}
        >
          <BottomNavigationAction
            label="Bookmarks"
            icon={<Bookmarks />}
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
  reference: PropTypes.object.isRequired,
  setReference: PropTypes.func.isRequired,
};

const styles = theme => ({
  root: {
    width: '100%',
  },
});

export default withStyles(styles, { withTheme: true })(BottomNavContainer);
