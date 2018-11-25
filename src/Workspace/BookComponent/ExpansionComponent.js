import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import ScrollableAnchor from 'react-scrollable-anchor'
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

export const ExpansionComponent = ({classes, key, summary, details}) => {
  return (
    <ExpansionPanel className={classes.column} key={key}>
      <ExpansionPanelSummary
        expandIcon={
          <ExpandMore />
        }>
        <ScrollableAnchor id={key}>
          {summary}
        </ScrollableAnchor>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <div>
          {details}
        </div>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
};

ExpansionComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  key: PropTypes.string.isRequired,
  heading: PropTypes.string.isRequired,
  details: PropTypes.string.isRequired,
};

export default withStyles(styles)(ExpansionComponent);
