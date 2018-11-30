import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  Popover,
} from '@material-ui/core';

import TextComponent from './TextComponent';
import GreekWord from './GreekWord/index.js';

class GreekWordsContainer extends React.Component {
  state = {
    anchorEl: null,
  };

  handlePopoverOpen = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handlePopoverClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { classes, children, greekWords } = this.props;
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);
    return (
      <span>
        <span
          aria-owns={open ? 'mouse-over-popover' : undefined}
          aria-haspopup="true"
          onMouseEnter={this.handlePopoverOpen}
          onMouseLeave={this.handlePopoverClose}
          className={(open ? classes.open : classes.closed)}
        >
          {
            children.map((verseObject, index) =>
              <TextComponent key={index} verseObject={verseObject}/>
            )
          }
        </span>
        <Popover
          id="mouse-over-popover"
          className={classes.popover}
          classes={{
            paper: classes.paper,
          }}
          open={open}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          onClose={this.handlePopoverClose}
          disableRestoreFocus
        >
        {
          greekWords.map((verseObject, index) =>
            <GreekWord key={index} verseObject={verseObject} />
          )
        }
        </Popover>
      </span>
    );
  }
}

GreekWordsContainer.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.array.isRequired,
  greekWords: PropTypes.array,
};

const styles = theme => ({
  open: {
    backgroundColor: 'lightgoldenrodyellow',
  },
  closed: {
  },
  popover: {
    pointerEvents: 'none',
  },
  paper: {
    padding: theme.spacing.unit,
  },
});

export default withStyles(styles, { withTheme: true })(GreekWordsContainer);
