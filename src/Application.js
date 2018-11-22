import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import './Application.css';

import ApplicationBar from './ApplicationBar';
import Workspace from './Workspace';

export const Application = ({classes, username, languageId, reference}) =>
  <div className={classes.root}>
    <div className={classes.appFrame}>
      <ApplicationBar
        username={username}
        languageId={languageId}
        reference={reference}
      />
      <main className={classes.main}>
        <Workspace
          username={username}
          languageId={languageId}
          reference={reference}
        />
      </main>
    </div>
  </div>

Application.propTypes = {
  classes: PropTypes.object.isRequired,
  username: PropTypes.string.isRequired,
  languageId: PropTypes.string.isRequired,
  reference: PropTypes.object.isRequired,
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
    padding: '5.5em 1em 1em 1em',
    minWidth: '20em',
    fontSize: '0.9em',
    lineHeight: '1.75em',
  }
});

export default withStyles(styles)(Application);
