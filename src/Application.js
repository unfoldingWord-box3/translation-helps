import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import './Application.css';

import ApplicationBar from './ApplicationBar';
import Workspace from './Workspace';
import BottomNav from './BottomNav';

export const Application = ({classes, username, languageId, reference, manifests, setReference}) =>
  <div className={classes.root}>
    <div className={classes.appFrame}>
      <ApplicationBar
        username={username}
        languageId={languageId}
        manifests={manifests}
        reference={reference}
        setReference={setReference}
      />
      <main className={classes.main}>
        <Workspace
          username={username}
          languageId={languageId}
          manifests={manifests}
          reference={reference}
          setReference={setReference}
        />
      </main>
      <nav className={classes.bottomNav}>
        <BottomNav
          setReference={setReference}
        />
      </nav>
    </div>
  </div>

Application.propTypes = {
  classes: PropTypes.object.isRequired,
  username: PropTypes.string.isRequired,
  languageId: PropTypes.string.isRequired,
  reference: PropTypes.object.isRequired,
  setReference: PropTypes.func.isRequired,
  manifests: PropTypes.object,
};

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  appFrame: {
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    width: '100%',
  },
  main: {
    width: '100%',
    padding: '5.5em 1em 5.5em 1em',
    minWidth: '20em',
    fontSize: '0.9em',
    lineHeight: '1.75em',
  },
  bottomNav: {
    width: '100%',
    position: 'fixed',
    bottom: 0,
    zIndex: 10,
  }
});

export default withStyles(styles)(Application);
