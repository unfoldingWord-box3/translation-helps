import React from 'react';
import localstorage from 'local-storage'

import Application from './Application';
import './Application.css';

import * as ApplicationHelpers from './ApplicationHelpers';

const keyPrefix = 'ApplicationContainer.state.';

class ApplicationContainer extends React.Component {
  state = {
    manifests: {},
    context: {
      username: 'unfoldingWord',
      languageId: 'en',
      resourceId: null,
      reference: {},
    },
  };
  
  componentWillMount() {
    const context = localstorage.get(keyPrefix + 'context');
    if (context) {
      this.setState({context});
    }
  };

  setContext(context) {
    window.scrollTo(0,0);
    this.setState({context});
    localstorage.set(keyPrefix + 'context', context);
  };

  componentDidMount() {
    const {
      context: {
        username,
        languageId
      },
    } = this.state;
    ApplicationHelpers.fetchResourceManifests(username, languageId)
    .then(manifests => {
      this.setState({
        manifests,
      });
    });
  };

  render() {
    const {context, manifests} = this.state;
    return (
      <Application
        context={context}
        setContext={this.setContext.bind(this)}
        manifests={manifests}
      />
    );
  };
};

export default ApplicationContainer;
