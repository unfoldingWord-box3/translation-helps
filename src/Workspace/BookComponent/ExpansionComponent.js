import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
} from '@material-ui/core';
import {
  ExpandMore,
} from '@material-ui/icons';

import styles from './styles';

export const ExpansionComponent = ({classes, summary, details}) => {
  return (
    <ExpansionPanel className={classes.column}>
      <ExpansionPanelSummary expandIcon={<ExpandMore />}>
        {summary}
      </ExpansionPanelSummary>
      <ExpansionPanelDetails className={classes.expansionPanelDetails}>
        <div className={classes.fullWidth}>{details}</div>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
};

ExpansionComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  summary: PropTypes.object.isRequired,
  details: PropTypes.object,
};

export default withStyles(styles)(ExpansionComponent);
