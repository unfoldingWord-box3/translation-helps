import React from 'react';
import PropTypes from 'prop-types';
import {
} from '@material-ui/core';

import TranslationHelpsComponent from './TranslationHelpsComponent';

class TranslationHelpsContainer extends React.Component {
  state = {
    id: Math.random(),
    tabIndex: 0,
    tabs: this.props.tabs,
  };

  handleChangeIndex = (_index, __index) => {
    const index = (__index !== undefined) ? __index : _index;
    this.setState({ tabIndex: index });
    this.scrollToId(this.state.id);
  };

  addTab = (tab) => {
    let {tabs} = this.state;
    tabs.push(tab);
    this.setState({
      tabs,
      tabIndex: tabs.length - 1,
    });
    this.scrollToId(this.state.id);
  };

  scrollToId = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  render() {
    const {props} = this;
    const {tabs, tabIndex, id} = this.state;
    return (
      <TranslationHelpsComponent
        {...props}
        id={id}
        tabs={tabs}
        tabIndex={tabIndex}
        addTab={this.addTab.bind(this)}
        handleChangeIndex={this.handleChangeIndex.bind(this)}
      />
    )
  }
}

TranslationHelpsContainer.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  tabs: PropTypes.array.isRequired,
  languageId: PropTypes.string.isRequired,
  setReference: PropTypes.func.isRequired,
};

export default TranslationHelpsContainer;
