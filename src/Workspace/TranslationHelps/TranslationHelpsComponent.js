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
import OriginalWord from '../Scripture/ScriptureView/OriginalWord';

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
    let content;
    if (tab.text) {
      badgeCount = 0;
      content = <TextComponentWithRCLinks
        text={tab.text}
        addTab={addTab}
        context={context}
        setContext={setContext}
      />;
    } else if (tab.notes) {
      badgeCount = tab.notes.length;
      content = tab.notes.map((note, index) =>
        <TranslationNotes
          key={index}
          note={note}
          addTab={addTab}
          context={context}
          setContext={setContext}
        />
      );
    } else if (tab.original) {
      const wordObjects = tab.original;
      badgeCount = wordObjects.length;
      content = wordObjects.map((wordObject, index) => {
        const link = wordObject.link.replace('rc://*/', `http://${context.languageId}/`);
        const originalWords = wordObject.originalWords.map((verseObject, index) =>
          <OriginalWord key={index} verseObject={verseObject} />
        );
        const text = `${link}`;
        return (
          <div key={index}>
            <Divider />
            <TextComponentWithRCLinks
              text={text}
              addTab={addTab}
              context={context}
              setContext={setContext}
            />
            {originalWords}
          </div>
        );
      });
    } else if (tab.words) {
      badgeCount = tab.words.length;
      content = tab.words.map((word, index) => {
        return (
          <div key={index}>
            <Divider />
            <TextComponentWithRCLinks
              text={word}
              addTab={addTab}
              context={context}
              setContext={setContext}
            />
          </div>
        );
      });
    } else if (tab.content) {
      badgeCount = tab.content.length;
      content = tab.content;
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
    <div id={id} className={classes.root}>
      <AppBar className={classes.appBar} position="sticky" color="default">
        <Tabs
          className={classes.width}
          value={tabIndex}
          onChange={handleChangeIndex}
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
        onChangeIndex={handleChangeIndex}
      >
        {tabContents}
      </SwipeableViews>
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
