import React from 'react';
import PropTypes from 'prop-types';

import Scripture from './Scripture';

import {ResourcesContextProvider} from './Resources.context';

class Container extends React.Component {
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
  };

  render() {
    const props = this.props;
    return (
      <ResourcesContextProvider>
        <Scripture
          {...props}
        />
      </ResourcesContextProvider>
    );
  };
};

Container.propTypes = {
  context: PropTypes.object.isRequired,
  setContext: PropTypes.func.isRequired,
  manifests: PropTypes.object.isRequired,
};

export default Container;
