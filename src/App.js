import React, {useContext, useState} from 'react';
import { withStyles } from '@material-ui/core/styles';
import { MuiThemeProvider } from '@material-ui/core/styles';

import ApplicationBar from './ApplicationBar';
import BottomNav from './BottomNav';
import Viewer from './components/Viewer';

import styles from './styles';
import theme from './theme';

import { ContextContext, ContextContextProvider } from './Context.context';
import { HistoryContext, HistoryContextProvider } from './History.context';

function App({classes}) {
  const {context, updateContext} = useContext(ContextContext);
  const {history, addHistory} = useContext(HistoryContext);
  const [manifests, setManifests] = useState({});

  // window.addEventListener("popstate", (e) => {
  //   const context = e.state;
  //   setContext(context, true);
  // });

  const setContext = (_context) => {
    addHistory(_context);
    updateContext(_context);
  };

  return (
    <MuiThemeProvider theme={theme}>
      <div className={classes.root}>
        <div className={classes.appFrame}>
          <main className={classes.main}>
            <ApplicationBar
              applicationName="unfoldingWord"
              context={context}
              manifests={manifests}
            />
            <div className={classes.workspace}>
              <Viewer
                context={context}
                setContext={setContext}
                history={history}
                handleManifestsChange={setManifests}
              />
            </div>
          </main>
          <nav className={classes.bottomNav}>
            <BottomNav
              context={context}
              setContext={updateContext}
            />
          </nav>
        </div>
      </div>
    </MuiThemeProvider>
  );
};

function AppWrapper({classes}) {

  return (
    <ContextContextProvider>
      <HistoryContextProvider>
        <App
          classes={classes}
        />
      </HistoryContextProvider>
    </ContextContextProvider>
  );
};

export default withStyles(styles)(AppWrapper);
