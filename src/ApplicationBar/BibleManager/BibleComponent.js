import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  List,
  ListItem,
} from '@material-ui/core';

import TestamentComponent from './TestamentComponent';

export const BibleComponent = ({classes, manifests}) => {
  let bible = {};
  const ult = manifests['ult'];
  if (ult) {
    ult.projects.forEach(project => {
      const testamentId = project.categories.includes('bible-ot') ? 'Old Testament': 'New Testament';
      if (!bible[testamentId]) bible[testamentId] = [];
      bible[testamentId].push(project);
    });
  }
  return (
    <div className={classes.bible}>
      <List
        className={classes.bible}
        component="nav"
        dense
      >
        <div className={classes.bibleList}>
          {
            Object.keys(bible).map(testamentId =>
              <TestamentComponent
                key={testamentId}
                testamentId={testamentId}
                books={bible[testamentId]}
                selected={true}
              />
            )
          }
          <ListItem />
          <ListItem />
          <ListItem />
          <ListItem />
          <ListItem />
        </div>
      </List>
    </div>
    )
}

BibleComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  manifests: PropTypes.object.isRequired,
};

const styles = theme => ({
  bible: {
    height: '100%',
  },
  bibleList: {
    height: '100%',
    overflowY: 'auto',
  },
});

export default withStyles(styles)(BibleComponent);
