import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import SwipeableViews from 'react-swipeable-views';
import {
  AppBar,
  Tabs,
  Tab,
  Divider,
  Badge,
} from '@material-ui/core';

import TextComponentWithRCLinks from './TextComponentWithRCLinks';
import TranslationNotes from './TranslationNotes';
import GreekWord from '../BookComponent/GreekWord';

import * as ugntHelpers from './UGNT/helpers';

class TranslationHelpsContainer extends React.Component {
  state = {
    tabIndex: 0,
    tabs: this.props.tabs,
  };

  handleChange = (event, tabIndex) => {
    this.setState({ tabIndex });
  };

  handleChangeIndex = index => {
    this.setState({ tabIndex: index });
  };

  addTab = (tab) => {
    let {tabs} = this.state;
    tabs.push(tab);
    this.setState({
      tabs,
      tabIndex: tabs.length - 1,
    });
  };

  render() {
    const { classes, languageId } = this.props;
    const {tabs, tabIndex} = this.state;
    let tabLabels = [];
    let tabContents = [];
    let badgeCount = 0;
    tabs.forEach((tab, index) => {
      let content;
      if (tab.text) {
        badgeCount = 0;
        content = <TextComponentWithRCLinks text={tab.text} addTab={this.addTab.bind(this)} />;
      } else if (tab.notes) {
        badgeCount = tab.notes.length;
        content = tab.notes.map((note, index) =>
          <TranslationNotes key={index} note={note} addTab={this.addTab.bind(this)} />
        );
      } else if (tab.ugnt) {
        const wordObjects = ugntHelpers.taggedWords(tab.ugnt);
        badgeCount = wordObjects.length;
        content = wordObjects.map((wordObject, index) => {
          const link = wordObject.link.replace('rc://*/', `http://${languageId}/`);
          const greekWords = wordObject.greekWords.map((verseObject, index) =>
            <GreekWord key={index} verseObject={verseObject} />
          );
          const text = `${link}`;
          return (
            <div key={index}>
              <Divider />
              <TextComponentWithRCLinks text={text} addTab={this.addTab.bind(this)} />
              {greekWords}
            </div>
          );
        });
      }
      const badge = (
        <Badge className={classes.padding} color="primary" badgeContent={badgeCount}>
          {tab.title}
        </Badge>
      );
      tabLabels.push(
        <Tab key={tabLabels.length} label={ (badgeCount > 0) ? badge : tab.title } />
      );
      tabContents.push(
        <div key={tabContents.length} className={(index === tabIndex) ? classes.tabContent : classes.hidden }>
          {content}
        </div>);
    });
    return (
      <div className={classes.root}>
        <AppBar className={classes.appBar} position="sticky" color="default">
          <Tabs
            className={classes.width}
            value={tabIndex}
            onChange={this.handleChange}
            indicatorColor="primary"
            textColor="primary"
            scrollable
            scrollButtons="auto"
          >
            {tabLabels}
          </Tabs>
        </AppBar>
        <SwipeableViews
          className={classes.width}
          index={tabIndex}
          onChangeIndex={this.handleChangeIndex}
        >
          {tabContents}
        </SwipeableViews>
      </div>
    );
  }
}

TranslationHelpsContainer.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  tabs: PropTypes.array.isRequired,
  languageId: PropTypes.string.isRequired,
};

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: '100%',
  },
  width: {
    width: '100%',
  },
  appBar: {
    width: '95%',
    zIndex: '10',
    margin: 'auto',
  },
  hidden: {
    height: '0px',
  },
  padding: {
    padding: `0 ${theme.spacing.unit * 2}px`,
  },
  tabContent: {
    padding: `0 ${theme.spacing.unit * 3}px`,
  }
});

export default withStyles(styles, { withTheme: true })(TranslationHelpsContainer);
