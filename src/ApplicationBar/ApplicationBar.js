import React from 'react'
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {
  AppBar,
  Toolbar,
  Typography,
} from '@material-ui/core';
import {
} from '@material-ui/icons';

import styles from './ApplicationBarStyles';
import * as ApplicationHelpers from '../ApplicationHelpers';

const ApplicationBar = ({
  classes,
  projectName,
  manifests,
  reference,
  setReference,
  open,
  handleDrawerOpen,
  handleDrawerClose,
}) => {

  let bookName = '';
  if (manifests['ult'] && manifests['ult'].projects && reference.book) {
    const project = ApplicationHelpers.projectByBookId(manifests['ult'].projects, reference.book);
    bookName = project.title;
  }
  const bookNameComponent = bookName ? <span>&nbsp;-&nbsp;{bookName}</span> : <span />;

  return (
    <div>
      <AppBar
        className={classNames(classes.appBar, {
          [classes.appBarShift]: open,
          [classes[`appBarShift-left`]]: open,
        })}
      >
        <Toolbar className={classes.toolbar} disableGutters={!open}>
          <Typography variant="title" color="inherit" noWrap>
            {projectName}
          </Typography>
          <Typography variant="subheading" color="inherit" className={classes.coin} noWrap>
            {bookNameComponent}
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
}

ApplicationBar.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  manifests: PropTypes.object.isRequired,
  reference: PropTypes.object.isRequired,
  setReference: PropTypes.func.isRequired,
  projectName: PropTypes.string.isRequired,
  handleDrawerOpen: PropTypes.func.isRequired,
  handleDrawerClose: PropTypes.func.isRequired,
};

export default withStyles(styles, { withTheme: true })(ApplicationBar);
