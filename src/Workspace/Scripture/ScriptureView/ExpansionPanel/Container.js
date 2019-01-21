import React from 'react';
import PropTypes from 'prop-types';
import {
} from '@material-ui/core';

import Component from './Component';

class Container extends React.Component {
  state = {
    id: Math.random(),
    open: false,
  };

  handleClose = () => {
    this.setState({ open: false });
    this.scrollToId(this.state.id);
  };

  handleToggle = () => {
    this.setState({ open: !this.state.open });
    this.scrollToId(this.state.id);
  };

  scrollToId = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  render() {
    const {props} = this;
    const {open, id} = this.state;
    return (
      <Component
        {...props}
        id={id}
        open={open}
        handleClose={this.handleClose.bind(this)}
        handleToggle={this.handleToggle.bind(this)}
      />
    )
  }
}

Container.propTypes = {
  summary: PropTypes.object.isRequired,
  details: PropTypes.object,
};

export default Container;
