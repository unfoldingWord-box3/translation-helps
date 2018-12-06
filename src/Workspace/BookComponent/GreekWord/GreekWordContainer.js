import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import GreekWordComponent from './GreekWordComponent';
import * as GreekWordHelpers from './GreekWordHelpers';

class GreekWordsContainer extends React.Component {
  state = {
    senses: [],
  };

  componentDidMount() {
    GreekWordHelpers.senses(this.props.verseObject.strong)
    .then(senses => {
      this.setState({
        senses: senses,
      });
    }).catch(error => {
      console.log(error);
    });
  };

  render() {
    return (
      <GreekWordComponent
        verseObject={this.props.verseObject}
        senses={this.state.senses}
      />
    );
  };
};

GreekWordsContainer.propTypes = {
  classes: PropTypes.object.isRequired,
  verseObject: PropTypes.object.isRequired,
};

const styles = theme => ({
});

export default withStyles(styles, { withTheme: true })(GreekWordsContainer);
