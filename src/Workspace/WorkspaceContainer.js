import React from 'react';
import PropTypes from 'prop-types';

import Workspace from './Workspace';

import * as WorkspaceHelpers from './WorkspaceHelpers';

class WorkspaceContainer extends React.Component {
  state = {
    bookData: null,
    translationNotesData: null,
    ugntData: null,
  };

  fetchResources(props) {
    const {username, languageId, reference, manifests} = props;
    if (reference.book) {
      WorkspaceHelpers.fetchBook(username, languageId, reference.book, manifests.ult)
      .then(bookData => {
        WorkspaceHelpers.translationNotes(username, languageId, reference.book, manifests.tn)
        .then(translationNotesData => {
          WorkspaceHelpers.fetchUGNTBook(username, languageId, reference.book, manifests.ugnt)
          .then(ugntData => {
            this.setState({
              bookData,
              translationNotesData,
              ugntData,
            });
          }).catch(error => {
            debugger
            this.setState({
              bookData,
              translationNotesData,
              ugntData: null,
            });
          });
        });
      });
    } else {
      this.setState({
        bookData: null,
        translationNotesData: null,
        ugntData: null,
      });
    }
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.reference.book !== this.props.reference.book) {
      this.fetchResources(nextProps);
    }
  };

  componentDidMount() {
    this.fetchResources(this.props);
  };

  render() {
    const props = this.props;
    const {bookData, translationNotesData, ugntData} = this.state;
    return (
      <Workspace
        {...props}
        bookData={bookData}
        translationNotesData={translationNotesData}
        ugntData={ugntData}
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
