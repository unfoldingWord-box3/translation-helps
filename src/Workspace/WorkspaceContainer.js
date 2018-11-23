import React from 'react';
import PropTypes from 'prop-types';

import Workspace from './Workspace';

import * as ApplicationHelpers from '../ApplicationHelpers';

class WorkspaceContainer extends React.Component {
  state = {
    bookData: null,
    translationNotesData: null,
  };

  fetchResources(props) {
    const {username, languageId, reference} = props;
    ApplicationHelpers.fetchBook(username, languageId, reference.book)
    .then(bookData => {
      ApplicationHelpers.translationNotes(username, languageId, reference.book)
      .then(translationNotes => {
        this.setState({
          bookData: bookData,
          translationNotesData: translationNotes,
        })
      });
    });
  };

  componentWillReceiveProps(nextProps) {
    this.fetchResources(nextProps);
  };

  componentDidMount() {
    this.fetchResources(this.props);
  };

  render() {
    const props = this.props;
    const {bookData, translationNotesData} = this.state;
    return (
      <Workspace
        {...props}
        bookData={bookData}
        translationNotesData={translationNotesData}
      />
    );
  };
};

WorkspaceContainer.propTypes = {
  username: PropTypes.string.isRequired,
  languageId: PropTypes.string.isRequired,
  reference: PropTypes.object.isRequired,
  manifests: PropTypes.object.isRequired,
};

export default WorkspaceContainer;
