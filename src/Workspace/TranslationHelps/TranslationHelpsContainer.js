import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import SwipeableViews from 'react-swipeable-views';
import {
  AppBar,
  Tabs,
  Tab,
} from '@material-ui/core';

import TextComponentWithRCLinks from './TextComponentWithRCLinks';
import TranslationNotes from './TranslationNotes';

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
    const { classes, theme } = this.props;
    const {tabs, tabIndex} = this.state;
    let tabLabels = [];
    let tabContents = [];
    tabs.forEach((tab, index) => {
      let content;
      if (tab.text) {
        content = <TextComponentWithRCLinks text={tab.text} addTab={this.addTab.bind(this)} />;
      } else if (tab.notes) {
        content = tab.notes.map((note, index) =>
          <TranslationNotes key={index} note={note} addTab={this.addTab.bind(this)} />
        );
      }
      tabLabels.push(<Tab label={tab.title} />);
      tabContents.push(<div className={classes.width}>{content}</div>);
    });
    return (
      <div className={classes.root}>
        <AppBar className={classes.width} position="sticky" color="default">
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
};

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: '100%',
    overflow: 'hidden',
  },
  width: {
    width: '100%',
    overflow: 'hidden',
  }
});

export default withStyles(styles, { withTheme: true })(TranslationHelpsContainer);
