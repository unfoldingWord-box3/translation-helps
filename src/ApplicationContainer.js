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
    history: [],
  };

  defaultContext() {
    return {
      username: 'unfoldingWord',
      languageId: 'en',
      resourceId: null,
      reference: {},
    }
  }

  addToHistory(_context, _history) {
    let history = [];
    if (_history) history = JSON.parse(JSON.stringify(_history));
    const newContext = JSON.stringify(_context);
    const oldContext = JSON.stringify(history[0]);
    const isNew = !( newContext === oldContext );
    if (isNew) {
      const context = JSON.parse(newContext);
      history.unshift(context);
    }
    if (!history) debugger
    return history;
  }

  componentWillMount() {
    let context, history;
    context = localstorage.get(keyPrefix + 'context');
    context = context || this.defaultContext();
    try {
      history = localstorage.get(keyPrefix + 'history');
    } catch {
      history = [];
    }
    this.setState({
      context,
      history,
    });
  };

  setContext(_context) {
    window.scrollTo(0,0);
    const context = JSON.parse(JSON.stringify(_context));
    const {history: _history} = this.state;
    let history;
    if (_history) {
      history = JSON.parse(JSON.stringify(_history));
    } else {
      try {
        history = localstorage.get(keyPrefix + 'history');
      } catch {
        history = [];
        debugger
      }
    }
    if (context.resourceId === 'obs') context.reference.bookId = 'obs';
    let newState = {
      context,
      history,
    };
    const {reference} = context;
    if (reference && reference.chapter) {
      history = this.addToHistory(context, history);
      localstorage.set(keyPrefix + 'history', _history);
      newState.history = history;
    }
    this.setState(newState);
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
    const {context, history, manifests} = this.state;
    return (
      <Application
        context={context}
        history={history}
        setContext={this.setContext.bind(this)}
        manifests={manifests}
      />
    );
  };
};

export default ApplicationContainer;
