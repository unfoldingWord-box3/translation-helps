import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import './Application.css';

import ApplicationBar from './ApplicationBar';
import Workspace from './Workspace';
import BottomNav from './BottomNav';

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  palette: {
    primary: {
      light: '#59B7E7',
      main: '#31ADE3',
      dark: '#014263',
      contrastText: '#FFF'
    },
  },
});

export const Application = ({
  classes,
  context,
  setContext,
  manifests,
}) =>
<MuiThemeProvider theme={theme}>
  <div className={classes.root}>
    <div className={classes.appFrame}>
      <main className={classes.main}>
        <ApplicationBar
          applicationName="unfoldingWord"
          context={context}
          setContext={setContext}
          manifests={manifests}
        />
        <div className={classes.workspace}>
          <Workspace
            context={context}
            setContext={setContext}
            manifests={manifests}
          />
        </div>
      </main>
      <nav className={classes.bottomNav}>
        <BottomNav
          context={context}
          setContext={setContext}
        />
      </nav>
    </div>
  </div>
</MuiThemeProvider>;

Application.propTypes = {
  classes: PropTypes.object.isRequired,
  context: PropTypes.object.isRequired,
  setContext: PropTypes.func.isRequired,
  manifests: PropTypes.object,
};

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  appFrame: {
    zIndex: 1,
    position: 'relative',
    display: 'flex',
    width: '100%',
  },
  main: {
    width: '100%',
    minWidth: '20em',
  },
  workspace: {
    padding: '1em 1em 5.5em 1em',
  },
  bottomNav: {
    width: '100%',
    position: 'fixed',
    bottom: 0,
    zIndex: 10,
  }
});

export default withStyles(styles)(Application);
