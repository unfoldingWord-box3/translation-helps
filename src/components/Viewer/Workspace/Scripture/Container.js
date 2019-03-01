import React from 'react';
import PropTypes from 'prop-types';

import Component from './Component';

import * as helpers from './helpers';
import * as AlignmentHelpers from './Alignment/helpers';

class Container extends React.Component {
  state = {
    lemmaIndex: null,
    referenceLoaded: null,
    resources: {
      ult: null,
      ulb: null,
      irv: null,
      ust: null,
      tn: null,
      original: null,
    },
  };

  fetchResourcesConditionally(nextProps) {
    const {manifests, context: {reference}} = nextProps;
    const {ult, ust, ulb, irv, obs} = this.state;
    const referenceChanged = (
      (reference && !this.props.context.reference) ||
      (reference && (reference.bookId !== this.props.context.reference.bookId))
    );
    const emptyBookData = (!(ult || ust || ulb || irv || obs));
    const needToFetch = (emptyBookData || referenceChanged)
    const canFetch = (reference && reference.bookId && Object.keys(manifests).length > 0);
    if (canFetch && needToFetch) {
      helpers.fetchResources(nextProps)
      .then(resources => {
        const lemmaIndex = AlignmentHelpers.index({data: resources.ult.data});
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
    const {lemmaIndex, resources, referenceLoaded} = this.state;
    return (
      <Component
        {...props}
        lemmaIndex={lemmaIndex}
        referenceLoaded={referenceLoaded}
        resources={resources}
      />
    );
  };
};

Container.propTypes = {
  context: PropTypes.object.isRequired,
  setContext: PropTypes.func.isRequired,
  manifests: PropTypes.object.isRequired,
};

export default Container;
