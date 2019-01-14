import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import SwipeableViews from 'react-swipeable-views';
import {
  AppBar,
  Tabs,
  Tab,
  Badge,
} from '@material-ui/core';

import HelpsTab from './HelpsTab';

import styles from './styles';

export const TranslationHelpsComponent = ({
  classes,
  context,
  setContext,
  tabs,
  addTab,
  tabIndex,
  handleChangeIndex,
  id,
}) => {
  let tabLabels = [];
  let tabContents = [];
  let badgeCount = 0;

  tabs.forEach((tab, index) => {
    if (tab.text) {
      badgeCount = 0;
    } else if (tab.notes) {
      badgeCount = tab.notes.length;
    } else if (tab.original) {
      const wordObjects = tab.original;
      badgeCount = wordObjects.length;
    } else if (tab.words) {
      badgeCount = tab.words.length;
    } else if (tab.content) {
      badgeCount = tab.content.length;
    }
    const badge = (
      <Badge className={classes.padding} color="primary" badgeContent={badgeCount}>
        {tab.title}
      </Badge>
    );
    tabLabels.push(
      <Tab key={tabLabels.length} label={ (badgeCount > 0) ? badge : tab.title } />
    );
    const open = (index === tabIndex);
    tabContents.push(
      <div key={tabContents.length} className={ open ? classes.tabContent : classes.hidden }>
        <HelpsTab
          tab={tab}
          addTab={addTab}
          open={open}
          context={context}
          setContext={setContext}
        />
      </div>);
  });

  const currentTab = tabContents[tabIndex];

  return (
    <div id={id} className={classes.root}>
      <AppBar className={classes.appBar} position="sticky" color="default">
        <Tabs
          className={classes.width}
          value={tabIndex}
          onChange={handleChangeIndex}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
        >
          {tabLabels}
        </Tabs>
      </AppBar>
      <div className={classes.width}>
        {currentTab}
      </div>
    </div>
  );
}

TranslationHelpsComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  context: PropTypes.object.isRequired,
  setContext: PropTypes.func.isRequired,
  tabs: PropTypes.array.isRequired,
  addTab: PropTypes.func.isRequired,
  handleChangeIndex: PropTypes.func.isRequired,
};

export default withStyles(styles, { withTheme: true })(TranslationHelpsComponent);
