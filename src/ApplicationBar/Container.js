import React from 'react';
import Component from './Component';

class Container extends React.Component {
  state = {
  };

  render() {
    const {props} = this;
    return (
      <Component
        {...props}
      />
    );
  };
}
export default Container;
