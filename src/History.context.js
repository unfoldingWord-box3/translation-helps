import React, {
  createContext,
  useState
} from 'react';

import * as helpers from './helpers';

const keyPrefix = 'Viewer.state.';

export const HistoryContext = createContext();

export function HistoryContextProvider({children}) {
  const loadHistory = () => {
    const _history = helpers.load({
      key: `${keyPrefix}history`,
      defaultValue: [],
    });
    return _history;
  };
  const loadedHistory = loadHistory();
  const [history, setHistory] = useState(loadedHistory);

  const addToHistoryArray = (_context, _history) =>  {
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
  const addHistory = (context) => {
    if (context.reference && context.reference.chapter) {
      let _history = addToHistoryArray(context, history);
      setHistory(_history);
      saveHistory();
    }
    return history;
  };

  const saveHistory = () => {
    helpers.save({ key: `${keyPrefix}history`, value: history });
  };

  const _history = history ? helpers.deepFreeze(history) : null;

  const value = {
    history: _history,
    setHistory,
    addHistory,
    loadHistory,
  };

  return (
    <HistoryContext.Provider value={value}>
      {children}
    </HistoryContext.Provider>
  );
};
