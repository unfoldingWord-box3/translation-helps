import React, {Suspense, lazy} from 'react';
import PropTypes from 'prop-types';
import {
} from '@material-ui/core';

const Component = lazy(() => import('./Component'));

class Container extends React.Component {
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
      <Suspense fallback={<div />}>
        <Component
          {...props}
          id={id}
          tabs={tabs}
          tabIndex={tabIndex}
          addTab={this.addTab.bind(this)}
          handleChangeIndex={this.handleChangeIndex.bind(this)}
        />
      </Suspense>
    )
  }
}

Container.propTypes = {
  context: PropTypes.object.isRequired,
  setContext: PropTypes.func.isRequired,
  tabs: PropTypes.array.isRequired,
};

export default Container;
