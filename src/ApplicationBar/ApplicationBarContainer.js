import React from 'react';
import ApplicationBar from './ApplicationBar';

class ApplicationBarContainer extends React.Component {
  state = {
  };

  render() {
    const {props} = this;
    return (
      <ApplicationBar
        {...props}
      />
    );
  };
}
export default ApplicationBarContainer;
