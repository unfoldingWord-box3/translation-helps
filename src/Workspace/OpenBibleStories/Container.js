import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import styles from './styles';

import Component from './Component';

import * as helpers from './helpers';

class OpenBibleStoriesContainer extends React.Component {
  state = {
    stories: null,
  };

  componentDidMount() {
    const {username, languageId} = this.props.context;
    helpers.fetchOpenBibleStories({username, languageId})
    .then(stories => {
      this.setState({ stories });
    });
  };

  componentDidUpdate() {
    const {reference: {bookId, chapter, verse}} = this.props.context;
    const id = `${bookId}_${chapter}_${verse}`;
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }

  render() {
    const {stories} = this.state;
    const {props} = this;
    const {title} = props.manifests['obs'].dublin_core;
    return (
      <Component
        {...props}
        stories={stories}
        title={title}
      />
    );
  }
};

OpenBibleStoriesContainer.propTypes = {
  classes: PropTypes.object.isRequired,
  context: PropTypes.object.isRequired,
  setContext: PropTypes.func.isRequired,
};

export default withStyles(styles)(OpenBibleStoriesContainer);
