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

// import BooksManager from '../BooksManager';

const ApplicationBar = ({
  classes,
  projectName,
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
          Coins
        </Typography>
        <IconButton onClick={handleDrawerClose}>
          <ChevronLeft />
        </IconButton>
      </div>
      <Divider />
      {}
    </Drawer>
  );

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
            Titus
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
  projectName: PropTypes.string.isRequired,
  handleDrawerOpen: PropTypes.func.isRequired,
  handleDrawerClose: PropTypes.func.isRequired,
};

export default withStyles(styles, { withTheme: true })(ApplicationBar);
