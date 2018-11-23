import React from 'react'
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  Divider,
  IconButton
} from '@material-ui/core';
import {
  Menu,
  ChevronLeft
} from '@material-ui/icons';

import styles from './ApplicationBarStyles';
import * as ApplicationHelpers from '../ApplicationHelpers';

import BibleManager from './BibleManager';

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
  const drawer = (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <div className={classes.drawerHeader}>
        <Typography variant='subheading'>
          Books
        </Typography>
        <IconButton onClick={handleDrawerClose}>
          <ChevronLeft />
        </IconButton>
      </div>
      <Divider />
      <BibleManager
        manifests={manifests}
        reference={reference}
        setReference={setReference}
      />
    </Drawer>
  );

  let bookName = '';
  if (manifests['ult'] && manifests['ult'].projects) {
    const project = ApplicationHelpers.projectByBookId(manifests['ult'].projects, reference.book);
    bookName = project.title;
  }

  return (
    <div>
      <AppBar
        className={classNames(classes.appBar, {
          [classes.appBarShift]: open,
          [classes[`appBarShift-left`]]: open,
        })}
      >
        <Toolbar className={classes.toolbar} disableGutters={!open}>
          <IconButton
            color="inherit"
            aria-label="Open drawer"
            onClick={handleDrawerOpen}
            className={classNames(classes.menuButton, open && classes.hide)}
          >
            <Menu />
          </IconButton>
          <Typography variant="title" color="inherit" noWrap>
            {projectName} -<span>&nbsp;</span>
          </Typography>
          <Typography variant="subheading" color="inherit" className={classes.coin} noWrap>
            {bookName}
          </Typography>
        </Toolbar>
      </AppBar>
      {drawer}
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
