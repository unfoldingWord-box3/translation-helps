import React from 'react';
import queryString from 'query-string';

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
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('owner') || 'unfoldingword';
    const rc = urlParams.get('rc') || ''
    const rcArray = rc.slice(1).split('/').filter(string => string);
    const [languageId, resourceId, bookId, chapter, verse] = rcArray;
    return {
      username: username,
      languageId: languageId || 'en',
      resourceId: resourceId,
      reference: {
        bookId,
        chapter,
        verse,
      },
    }
  };

  addToHistoryArray(_context, _history) {
    let history = [];
    if (_history) history = [..._history];
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
    let manifests = {...oldManifests};
    const languageChanged = (oldContext.languageId !== context.languageId);
    const usernameChanged = (oldContext.username !== context.username);
    if (languageChanged || usernameChanged) {
      manifests = await helpers.fetchResourceManifests(context);
    }
    return manifests;
  };

  validateContext({ manifests, context }) {
    const {resourceId, reference} = context;
    const manifestExists = (!!manifests && !!manifests[resourceId]);
    const validReference = chapterAndVerses.validateReference({reference});
    const valid = (manifestExists && validReference);
    return valid;
  }

  async setContext(_context, back=false) {
    let newState = {};
    const {reference: _reference} = _context || this.defaultContext();
    const reference = _reference ? {..._reference} : {};
    const context = {..._context, reference};
    // allow navigation to Resources selection
    const emptyResourceId = (!context.reference || !context.resourceId);
    if (emptyResourceId) {
      newState.context = context;
      // only update query if back button is not pressed
      if (!back) this.updateQuery(newState.context);
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
      // only update query if back button is not pressed
      if (!back) this.updateQuery(newState.context);
      window.scrollTo(0,0);
    }
    // update state
    this.setState(newState);
  };

  updateQuery(context) {
    const {
      username,
      languageId,
      resourceId,
      reference: {
        bookId,
        chapter,
        verse,
      },
    } = context;
    const _username = username ? `owner=${username}` : '';
    const _languageId = languageId ? `/${languageId}` : '';
    const _resourceId = resourceId ? `/${resourceId}` : '';
    const _bookId = bookId ? `/${bookId}` : '';
    const _chapter = chapter ? `/${chapter}` : '';
    const _verse = verse ? `/${verse}` : '';
    const rc = `&rc=${_languageId}${_resourceId}${_bookId}${_chapter}${_verse}`
    const path = window.location.pathname;
  	const query = `${path}?${_username}${rc}`;
  	window.history.pushState(context, null, query);
  }

  componentWillMount() {
    let newState = {};
    newState.context = this.defaultContext();
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
    window.addEventListener("popstate", (e) => {
      const context = e.state;
      this.setContext(context, true);
    });
  };

  render() {
    const {context, history, manifests} = this.state;
    const _context = context ? helpers.deepFreeze(context) : context;
    const _manifests = manifests ? helpers.deepFreeze(manifests) : manifests;
    return (
      <Component
        context={_context}
        history={history}
        setContext={this.setContext.bind(this)}
        manifests={_manifests}
      />
    );
  };
};

export default Container;
