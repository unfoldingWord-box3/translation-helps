import React from 'react';

import Component from './Component';

import * as helpers from './helpers';

const keyPrefix = 'ApplicationContainer.state.';

class Container extends React.Component {
  state = {
    manifests: {},
    context: this.defaultContext(),
    history: [],
  };

  defaultContext() {
    return {
      username: 'unfoldingWord',
      languageId: 'en',
      resourceId: null,
      reference: {},
    }
  };

  addToHistoryArray(_context, _history) {
    let history = [];
    if (_history) history = helpers.copy(_history);
    const newContext = JSON.stringify(_context);
    const oldContext = JSON.stringify(history[0]);
    const isNew = !( newContext === oldContext );
    if (isNew) {
      const context = JSON.parse(newContext);
      history.unshift(context);
    }
    if (!history) debugger
    return history;
  };

  // add to history (load, add, persist, return)
  addHistory({history, context}) {
    if (context.reference && context.reference.chapter) {
      history = this.addToHistoryArray(context, history);
      helpers.save({ key: `${keyPrefix}history`, value: history });
    }
    return history;
  };

  // load new manifests and update context if language or username changes
  async refreshManifests({context}) {
    const {context: oldContext, manifests: oldManifests} = this.state;
    let manifests = helpers.copy(oldManifests);
    const languageChanged = (oldContext.languageId !== context.languageId);
    const usernameChanged = (oldContext.username !== context.username);
    if (languageChanged || usernameChanged) {
      manifests = await helpers.fetchResourceManifests(context);
    }
    return manifests;
  };

  async setContext(_context) {
    let newState = {};
    const context = helpers.copy(_context);
    // allow navigation to Resources selection
    const emptyResourceId = (!context.reference || !context.resourceId);
    if (emptyResourceId) {
      newState.context = context;
      window.scrollTo(0,0);
    }
    // set context and manifests if new ones need to be fetched
    newState.manifests = await this.refreshManifests({context});
    // the resource manifest should exist (incomplete translation)
    const manifestExists = (!!this.state.manifests[context.resourceId]);
    // TODO: Check to see if book exists as well
    if (manifestExists) {
      // use 'obs' for bookId if is resourceId
      if (context.resourceId === 'obs') context.reference.bookId = 'obs';
      newState.context = context;
      newState.history = this.addHistory({history: this.state.history, context});
      window.scrollTo(0,0);
    }
    // update state
    this.setState(newState);
    // persist context
    helpers.save({ key: `${keyPrefix}context`, value: context });
  };

  componentWillMount() {
    const context = helpers.load({
      key: `${keyPrefix}context`,
      defaultValue: this.defaultContext(),
    });
    const history = helpers.load({
      key: `${keyPrefix}history`,
      defaultValue: [],
    });
    this.setState({
      context,
      history,
    });
  };

  async componentDidMount() {
    let newState = {};
    const {context} = this.state;
    const manifests = await helpers.fetchResourceManifests(context);
    const validContext = !!(context && manifests && manifests[context.resourceId]);
    newState.manifests = manifests;
    newState.context = validContext ? context : this.defaultContext();
    this.setState(newState);
  };

  render() {
    const {context, history, manifests} = this.state;
    return (
      <Component
        context={context}
        history={history}
        setContext={this.setContext.bind(this)}
        manifests={manifests}
      />
    );
  };
};

export default Container;
