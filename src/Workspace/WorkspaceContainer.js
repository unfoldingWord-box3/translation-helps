import React from 'react';
import PropTypes from 'prop-types';

import Workspace from './Workspace';

import * as WorkspaceHelpers from './WorkspaceHelpers';

class WorkspaceContainer extends React.Component {
  state = {
    ult: null,
    tn: null,
    original: null,
    referenceLoaded: null,
  };

  fetchResourcesConditionally(nextProps) {
    const {reference} = nextProps;
    const referenceChanged = (nextProps.reference.book !== this.props.reference.book);
    const emptyBookData = (!this.state.bookData);
    const needToFetch = (emptyBookData || referenceChanged)
    const canFetch = (reference.book && Object.keys(nextProps.manifests).length > 0);
    if (canFetch && needToFetch) {
      WorkspaceHelpers.fetchResources(nextProps)
      .then(newState => {
        newState.referenceLoaded = reference;
        this.setState(newState);
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    this.fetchResourcesConditionally(nextProps);
  };

  componentDidMount() {
    this.fetchResourcesConditionally(this.props);
  };

  componentDidUpdate() {
    const {book, chapter, verse} = this.props.reference;
    const id = `${book}_${chapter}_${verse}`;
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }

  render() {
    const props = this.props;
    const {ult, tn, original, referenceLoaded} = this.state;
    return (
      <Workspace
        {...props}
        referenceLoaded={referenceLoaded}
        bookData={ult}
        translationNotesData={tn}
        originalData={original}
      />
    );
  };
};

WorkspaceContainer.propTypes = {
  username: PropTypes.string.isRequired,
  languageId: PropTypes.string.isRequired,
  reference: PropTypes.object.isRequired,
  setReference: PropTypes.func.isRequired,
  manifests: PropTypes.object.isRequired,
};

export default WorkspaceContainer;
