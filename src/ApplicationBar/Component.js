import React from 'react'
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Headroom from 'react-headroom';
import {
  Typography,
} from '@material-ui/core';

import * as ScriptureHelpers from '../Workspace/Scripture/helpers';

const Component = ({
  classes,
  applicationName,
  manifests,
  context: {
    resourceId,
    reference,
  },
}) => {

  let bookName = '';
  let chapter = '';
  if (manifests[resourceId] && reference) {
    const { bookId } = reference;
    chapter = reference.chapter;
    const {projects} = manifests[resourceId];
    const project = ScriptureHelpers.projectByBookId({projects, bookId});
    bookName = project ? project.title : '';
  }
  const referenceComponent = (bookName ? <span>&nbsp;&nbsp;{bookName} {chapter}</span> : <span />);

  return (
    <Headroom>
      <div className={classes.paper}>
        <div className={classes.toolbar}>
          <img className={classes.logo} src="./logo.png" alt="unfoldingWord Logo" />
          <Typography variant="h6" color="inherit" className={classes.coin} noWrap>
            {referenceComponent}
          </Typography>
        </div>
      </div>
    </Headroom>
  );
}

Component.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  manifests: PropTypes.object.isRequired,
  context: PropTypes.object.isRequired,
  projectName: PropTypes.string,
};

const styles = theme => ({
  paper: {
    color: '#fff',
    backgroundColor: '#31ADE3',
    textAlign: 'center',
    boxShadow: '0px 1px 5px 0px rgba(0, 0, 0, 0.2),' +
               '0px 2px 2px 0px rgba(0, 0, 0, 0.14),' +
               '0px 3px 1px -2px rgba(0, 0, 0, 0.12)',
  },
  toolbar: {
    margin: 'auto',
    display: 'inline-flex',
    padding: '1em 0',
  },
  logo: {
    height: '1.8em',
    paddingTop: '0.25em',
  },
});

export default withStyles(styles, { withTheme: true })(Component);
