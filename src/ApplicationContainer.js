import React from 'react';

import Application from './Application';
import './Application.css';

import * as ApplicationHelpers from './ApplicationHelpers';

class ApplicationContainer extends React.Component {
  state = {
    username: 'unfoldingWord',
    languageId: 'en',
    manifests: {},
    reference: {},
  };

  setReference(reference) {
    this.setState({
      reference: reference,
    });
  };

  componentDidMount() {
    const {username, languageId} = this.state;
    ApplicationHelpers.fetchResourceManifests(username, languageId)
    .then(manifests => {
      this.setState({
        manifests: manifests,
      });
    });
  };

  render() {
    const {username, languageId, reference, manifests} = this.state;
    return (
      <Application
        username={username}
        languageId={languageId}
        reference={reference}
        setReference={this.setReference.bind(this)}
        manifests={manifests}
      />
    );
  };
};

export default ApplicationContainer;
