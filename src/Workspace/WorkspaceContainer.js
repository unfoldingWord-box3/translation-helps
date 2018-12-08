import React from 'react';
import PropTypes from 'prop-types';

import Workspace from './Workspace';

import * as WorkspaceHelpers from './WorkspaceHelpers';

class WorkspaceContainer extends React.Component {
  state = {
    bookData: null,
    translationNotesData: null,
    originalData: null,
    referenceLoaded: null,
  };

  fetchResources(props) {
    const {username, languageId, reference, manifests} = props;
    if (reference.book) {
      WorkspaceHelpers.fetchBook(username, languageId, reference.book, manifests.ult)
      .then(bookData => {
        WorkspaceHelpers.translationNotes(username, languageId, reference.book, manifests.tn)
        .then(translationNotesData => {
          WorkspaceHelpers.fetchOriginalBook(username, languageId, reference.book, manifests.uhb, manifests.ugnt)
          .then(originalData => {
            this.setState({
              bookData,
              translationNotesData,
              originalData,
              referenceLoaded: reference,
            });
          }).catch(error => {
            this.setState({
              bookData,
              translationNotesData,
              originalData: null,
              referenceLoaded: reference,
            });
          });
        });
      });
    } else {
      this.setState({
        bookData: null,
        translationNotesData: null,
        originalData: null,
        referenceLoaded: null,
      });
    }
  };

  fetchResourcesConditionally(nextProps) {
    const referenceChanged = (nextProps.reference.book !== this.props.reference.book);
    const emptyBookData = (!this.state.bookData);
    const needToFetch = (emptyBookData || referenceChanged)
    const canFetch = (Object.keys(nextProps.manifests).length > 0);
    if (canFetch && needToFetch) {
      this.fetchResources(nextProps);
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
    const {bookData, translationNotesData, originalData, referenceLoaded} = this.state;
    return (
      <Workspace
        {...props}
        referenceLoaded={referenceLoaded}
        bookData={bookData}
        translationNotesData={translationNotesData}
        originalData={originalData}
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
