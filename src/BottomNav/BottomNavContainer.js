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
  state = {
    value: null,
  };

  handleChange = (event, value) => {
    this.props.setReference({});
    this.setState({
      value: value,
    });
  };

  handleClose = () => {
    this.setState({
      value: null,
    });
  };

  render() {
    const { classes, username, languageId, manifests, reference, setReference } = this.props;
    const { value } = this.state;

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
  username: PropTypes.string.isRequired,
  languageId: PropTypes.string.isRequired,
  reference: PropTypes.object.isRequired,
  setReference: PropTypes.func.isRequired,
};

const styles = {
  root: {
    width: '100%',
  },
};

export default withStyles(styles)(BottomNavContainer);
