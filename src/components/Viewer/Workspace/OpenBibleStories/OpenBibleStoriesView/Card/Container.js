import React from 'react';
import PropTypes from 'prop-types';

import Component from './Component';

class Container extends React.Component {
  state = {
    open: false,
    id: Math.random(),
    helps: {},
  };

  handleToggleOpen = () => {
    this.setState({open: !this.state.open});
    this.scrollToId();
  };

  scrollToId = () => {
    const element = document.getElementById(this.state.id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  componentWillMount() {
    const {
      frameKey,
      context: {
        reference,
      },
    } = this.props;
    if (parseInt(reference.verse) === parseInt(frameKey)) {
      this.scrollToId();
    }
  };

  render() {
    const {open, id} = this.state;
    const {props} = this;
    return (
      <div id={id}>
        <Component
          {...props}
          open={open}
          handleToggleOpen={this.handleToggleOpen.bind(this)}
        />
      </div>
    );
  }
};

Container.propTypes = {
  context: PropTypes.object.isRequired,
  content: PropTypes.element.isRequired,
  details: PropTypes.element.isRequired,
  image: PropTypes.string,
  youtubeId: PropTypes.string,
};

export default Container;
