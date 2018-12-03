import React from 'react';
import PropTypes from 'prop-types';

import TestamentComponent from './TestamentComponent';

class TestamentContainer extends React.Component {
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
      <TestamentComponent
        {...props}
        open={open}
        toggle={this.toggle.bind(this)}
      />
    );
  };
};

TestamentContainer.propTypes = {
};

export default TestamentContainer;
