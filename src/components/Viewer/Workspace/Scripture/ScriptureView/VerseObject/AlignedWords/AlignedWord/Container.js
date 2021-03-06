import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Component from './Component';
import * as helpers from './helpers';

class Container extends React.Component {
  state = {
    senses: [],
  };

  componentDidMount() {
    const {strong} = this.props.verseObject;
/* TODO:
  remove hardcoded organization and languageId
  pass directly through components
*/
    helpers.senses({strong})
    .then(senses => {
      if (!this.unmounted) {
        this.setState({
          senses,
        });
      }
    }).catch(error => {
      console.log(error);
    });
  };

  componentWillUnmount() {
    this.unmounted = true;
  }

  render() {
    return (
      <Component
        verseObject={this.props.verseObject}
        senses={this.state.senses}
      />
    );
  };
};

Container.propTypes = {
  classes: PropTypes.object.isRequired,
  verseObject: PropTypes.object.isRequired,
};

const styles = theme => ({
});

export default withStyles(styles, { withTheme: true })(Container);
