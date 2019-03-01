import React from 'react';
import PropTypes from 'prop-types';

import Component from './Component';

class Container extends React.Component {
  state = {
  };

  componentDidUpdate() {
    const {reference} = this.props.context;
    if (reference) {
      const {bookId, chapter, verse} = reference;
      const id = `${bookId}_${chapter}_${verse}`;
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    }
  }

  render() {
    const props = this.props;
    return (
      <Component
        {...props}
      />
    );
  };
};

Container.propTypes = {
  context: PropTypes.object.isRequired,
  setContext: PropTypes.func.isRequired,
  history: PropTypes.array,
  manifests: PropTypes.object.isRequired,
};

export default Container;
