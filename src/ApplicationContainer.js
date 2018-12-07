import React from 'react';
import localstorage from 'local-storage'

import Application from './Application';
import './Application.css';

import * as ApplicationHelpers from './ApplicationHelpers';

const keyPrefix = 'ApplicationContainer.state.';

class ApplicationContainer extends React.Component {
  state = {
    username: 'unfoldingWord',
    languageId: 'en',
    manifests: {},
    reference: {},
  };

  componentWillMount() {
    const reference = localstorage.get(keyPrefix + 'reference');
    if (reference && reference.book !== 'obs') this.setState({reference});
  };

  setReference(reference) {
    window.scrollTo(0,0);
    this.setState({
      reference,
    });
    localstorage.set(keyPrefix + 'reference', reference);
  };

  componentDidMount() {
    const {username, languageId} = this.state;
    ApplicationHelpers.fetchResourceManifests(username, languageId)
    .then(manifests => {
      this.setState({
        manifests,
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
