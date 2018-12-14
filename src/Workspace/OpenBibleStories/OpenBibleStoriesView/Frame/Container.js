import React from 'react';
import PropTypes from 'prop-types';

import Component from './Component';

import * as translationHelps from '../../translationHelps/helpers';

class FrameContainer extends React.Component {
  state = {
    open: false,
    id: Math.random(),
    helps: null,
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
    translationHelps.fetchHelps(username, languageId, storyKey, frameKey)
    .then(helps => {
      this.setState({ helps });
    });
    if (parseInt(reference.verse) === parseInt(frameKey)) {
      this.scrollToId();
    }
  };

  render() {
    const {helps, open, id} = this.state;
    const {props} = this;
    return (
      <div id={id}>
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

FrameContainer.propTypes = {
  classes: PropTypes.object.isRequired,
  storyKey: PropTypes.number.isRequired,
  frameKey: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired,
  image: PropTypes.string,
  context: PropTypes.object.isRequired,
  setContext: PropTypes.func.isRequired,
};

export default FrameContainer;
