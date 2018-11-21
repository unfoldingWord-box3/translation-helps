import React from 'react';

import Application from './Application';
import './Application.css';

// import * as ApplicationHelpers from './ApplicationHelpers';

class ApplicationContainer extends React.Component {
  state = {
    username: 'unfoldingWord',
    languageId: 'en',
    reference: {
      book: 'tit',
      chapter: '1',
      verse: '1'
    }
  };

  componentDidMount() {
  };

  render() {
    const {username, languageId, reference} = this.state;
    return (
      <Application
        username={username}
        languageId={languageId}
        reference={reference}
      />
    );
  };
};

export default ApplicationContainer;
