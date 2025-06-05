import React from 'react';
import PropTypes from 'prop-types';

import Component from './Component';

class Container extends React.Component {
  state = {
    open: false,
  };

  toggle() {
    this.setState({
      open: !this.state.open
    })
  };

  render() {
    const props = this.props;
    const {open} = this.state;
    return (
      <Component
        {...props}
        open={open}
        toggle={this.toggle.bind(this)}
      />
    );
  };
};

Container.propTypes = {
  testamentId: PropTypes.string.isRequired,
  books: PropTypes.array.isRequired,
  context: PropTypes.object.isRequired,
  setContext: PropTypes.func.isRequired,
}

export default Container;
