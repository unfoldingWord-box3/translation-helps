import React from 'react';
import PropTypes from 'prop-types';

import Component from './Component';

import * as thHelpers from '../../translationHelps/helpers';

class Container extends React.Component {
  state = {
    open: false,
    helps: {},
  };

  handleToggleOpen = () => {
    this.setState({open: !this.state.open});
    this.scrollToId();
  };

  scrollToId = () => {
    const element = document.getElementById(this.props.frameKey);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  componentDidMount() {
    const {
      storyKey,
      frameKey,
      context: {
        username,
        languageId,
        reference,
      },
    } = this.props;
    thHelpers.fetchHelps({username, languageId, storyKey, frameKey})
    .then(helps => {
      this.setState({helps});
    });
    if (parseInt(reference.verse) === parseInt(frameKey)) {
      this.scrollToId();
    }
  };

  render() {
    const {open} = this.state;
    const {props} = this;
    const helps = {...this.state.helps, ...this.props.helps};
    return (
      <div id={props.frameKey}>
        <Component
          {...props}
          helps={helps}
          open={open}
          handleToggleOpen={this.handleToggleOpen.bind(this)}
        />
      </div>
    );
  }
};

Container.propTypes = {
  storyKey: PropTypes.number.isRequired,
  frameKey: PropTypes.string.isRequired,
  helps: PropTypes.object,
  text: PropTypes.string.isRequired,
  image: PropTypes.string,
  context: PropTypes.object.isRequired,
  setContext: PropTypes.func.isRequired,
};

export default Container;
