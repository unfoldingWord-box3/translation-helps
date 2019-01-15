import React from 'react';
import PropTypes from 'prop-types';

import Scripture from './Scripture';

import * as helpers from './helpers';
import * as AlignmentHelpers from './Alignment/helpers';

class ScriptureContainer extends React.Component {
  state = {
    lemmaIndex: null,
    referenceLoaded: null,
    resources: {
      ult: null,
      ust: null,
      tn: null,
      original: null,
    },
  };

  fetchResourcesConditionally(nextProps) {
    const {manifests, context: {reference}} = nextProps;
    const {ult, ust, obs} = this.state;
    const referenceChanged = (reference.bookId !== this.props.context.reference.bookId);
    const emptyBookData = (!(ult || ust || obs));
    const needToFetch = (emptyBookData || referenceChanged)
    const canFetch = (reference.bookId && Object.keys(manifests).length > 0);
    if (canFetch && needToFetch) {
      helpers.fetchResources(nextProps)
      .then(resources => {
        const lemmaIndex = AlignmentHelpers.index(resources.ult);
        this.setState({
          lemmaIndex,
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
    const {lemmaIndex, resources, referenceLoaded} = this.state;
    return (
      <Scripture
        {...props}
        lemmaIndex={lemmaIndex}
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
