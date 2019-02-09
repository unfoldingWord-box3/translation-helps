import React from 'react';

import Component from './Component';

import * as helpers from './helpers';
import * as chapterAndVerses from './chaptersAndVerses';

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

  validateContext({ manifests, context }) {
    const {
      resourceId,
      reference,
    } = context;
    const manifestExists = (!!manifests && !!manifests[resourceId]);
    const validReference = chapterAndVerses.validateReference({reference});
    const valid = (manifestExists && validReference);
    return valid;
  }

  async setContext(_context) {
    let newState = {};
    const context = helpers.copy(_context);
    // allow navigation to Resources selection
    const emptyResourceId = (!context.reference || !context.resourceId);
    if (emptyResourceId) {
      newState.context = context;
      window.scrollTo(0,0);
    }
    // use 'obs' for bookId if is resourceId
    if (context.resourceId === 'obs') context.reference.bookId = 'obs';
    // set context and manifests if new ones need to be fetched
    const manifests = await this.refreshManifests({context});
    newState.manifests = manifests;
    const validContext = this.validateContext({manifests, context});
    // validate context
    if (validContext) {
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
    let newState = {};
    newState.context = helpers.load({
      key: `${keyPrefix}context`,
      defaultValue: this.defaultContext(),
    });
    newState.history = helpers.load({
      key: `${keyPrefix}history`,
      defaultValue: [],
    });
    this.setState(newState);
  };

  async componentDidMount() {
    let newState = {};
    const {context} = this.state;
    const manifests = await helpers.fetchResourceManifests(context);
    const validContext = this.validateContext({manifests, context});
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
