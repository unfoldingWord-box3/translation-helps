import React from 'react';
import PropTypes from 'prop-types';

import Scripture from './Scripture';

import * as helpers from './helpers';

class ScriptureContainer extends React.Component {
  state = {
    referenceLoaded: null,
    resources: {
      ult: null,
      tn: null,
      original: null,
    },
  };

  fetchResourcesConditionally(nextProps) {
    const {manifests, context: {reference}} = nextProps;
    const {ult, obs} = this.state;
    const referenceChanged = (reference.bookId !== this.props.context.reference.bookId);
    const emptyBookData = (!(ult || obs));
    const needToFetch = (emptyBookData || referenceChanged)
    const canFetch = (reference.bookId && Object.keys(manifests).length > 0);
    if (canFetch && needToFetch) {
      helpers.fetchResources(nextProps)
      .then(resources => {
        this.setState({
          resources,
          referenceLoaded: reference,
        });
      });
    }
  };

  componentWillReceiveProps(nextProps) {
    this.fetchResourcesConditionally(nextProps);
  };

  componentDidMount() {
    this.fetchResourcesConditionally(this.props);
  };

  componentDidUpdate() {
    const {reference: {bookId, chapter, verse}} = this.props.context;
    const id = `${bookId}_${chapter}_${verse}`;
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  render() {
    const props = this.props;
    const {resources, referenceLoaded} = this.state;
    return (
      <Scripture
        {...props}
        referenceLoaded={referenceLoaded}
        resources={resources}
      />
    );
  };
};

ScriptureContainer.propTypes = {
  context: PropTypes.object.isRequired,
  setContext: PropTypes.func.isRequired,
  manifests: PropTypes.object.isRequired,
};

export default ScriptureContainer;
