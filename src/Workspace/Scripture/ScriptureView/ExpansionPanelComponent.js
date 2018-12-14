import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  ExpansionPanelActions,
  IconButton,
} from '@material-ui/core';
import {
  ExpandMore,
  ExpandLess,
} from '@material-ui/icons';

import styles from '../../styles';

export const ExpansionPanelComponent = ({
  classes,
  summary,
  details,
  id,
  open,
  handleToggle,
  handleClose
}) => {
  return (
    <ExpansionPanel expanded={open} className={classes.column} onChange={handleToggle}>
      <ExpansionPanelSummary expandIcon={<ExpandMore />}>
        <span id={id} style={{position: 'absolute', top: '-5em'}}></span>
        {summary}
      </ExpansionPanelSummary>
      <ExpansionPanelDetails className={classes.expansionPanelDetails}>
      {
        open ?
          <div className={classes.fullWidth}>
            {details}
          </div>
        : ''
      }
      </ExpansionPanelDetails>
      <ExpansionPanelActions className={classes.expansionPanelActions}>
        <IconButton
          className={classes.button}
          aria-label="Close"
          onClick={handleClose}
        >
          <ExpandLess />
        </IconButton>
      </ExpansionPanelActions>
    </ExpansionPanel>
  );
};

ExpansionPanelComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  summary: PropTypes.object.isRequired,
  details: PropTypes.object,
  open: PropTypes.bool.isRequired,
  id: PropTypes.number.isRequired,
  handleToggle: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default withStyles(styles)(ExpansionPanelComponent);
