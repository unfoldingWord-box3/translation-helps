import React from 'react';
import ApplicationBar from './ApplicationBar';

const projectName = 'translationHelps';

class ApplicationBarContainer extends React.Component {
  state = {
    open: false,
  };

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  render() {
    const {props, state} = this;
    return (
      <ApplicationBar
        {...props}
        open={state.open}
        projectName={projectName}
        handleDrawerOpen={this.handleDrawerOpen.bind(this)}
        handleDrawerClose={this.handleDrawerClose.bind(this)}
      />
    );
  };
}
export default ApplicationBarContainer;
