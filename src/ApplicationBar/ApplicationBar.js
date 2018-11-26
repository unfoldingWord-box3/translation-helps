import React from 'react'
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Headroom from 'react-headroom';
import {
  Typography,
} from '@material-ui/core';
import {
} from '@material-ui/icons';

import * as WorkspaceHelpers from '../Workspace/WorkspaceHelpers';

const ApplicationBar = ({
  classes,
  projectName,
  manifests,
  reference,
}) => {

  let bookName = '';
  if (manifests['ult'] && manifests['ult'].projects && reference.book) {
    const project = WorkspaceHelpers.projectByBookId(manifests['ult'].projects, reference.book);
    bookName = project.title;
  }
  const referenceComponent = (bookName ? <span>&nbsp;-&nbsp;{bookName} {reference.chapter}</span> : <span />);

  return (
    <Headroom>
      <div className={classes.paper}>
        <div className={classes.toolbar}>
          <Typography className={classes.projectName} variant="subheading" color="inherit" noWrap>
            {projectName}
          </Typography>
          <Typography variant="title" color="inherit" className={classes.coin} noWrap>
            {referenceComponent}
          </Typography>
        </div>
      </div>
    </Headroom>
  );
}

ApplicationBar.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  manifests: PropTypes.object.isRequired,
  reference: PropTypes.object.isRequired,
  projectName: PropTypes.string.isRequired,
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
  projectName: {
    paddingTop: '0.1em',
  },
});

export default withStyles(styles, { withTheme: true })(ApplicationBar);
