/* eslint-disable react/prop-types, react/jsx-handler-names */

import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { withStyles } from '@material-ui/core/styles';
import {
  NoSsr,
} from '@material-ui/core';
import {
} from '@material-ui/icons'

import components from './Components';
import styles from './styles';

const suggestions = [
  { value: 'en', label: 'en - English' },
  { value: 'fr', label: 'fr - French' },
];

class Container extends React.Component {

  handleChange = name => object => {
    const context = JSON.parse(JSON.stringify(this.props.context));
    context.languageId = object.value;
    this.props.setContext(context);
  };

  render() {
    const {
      classes,
      theme,
      context,
    } = this.props;

    const selectStyles = {
      input: base => ({
        ...base,
        color: theme.palette.text.primary,
        '& input': {
          font: 'inherit',
        },
      }),
    };

    return (
      <div className={classes.root}>
        <NoSsr>
          <Select
            classes={classes}
            styles={selectStyles}
            options={suggestions}
            components={components}
            value={
              suggestions.filter(object => (object.value === context.languageId) )[0]
            }
            onChange={this.handleChange('language')}
            placeholder="Select Language"
          />
          <div className={classes.divider} />
        </NoSsr>
      </div>
    );
  }
}

Container.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  context: PropTypes.object.isRequired,
  setContext: PropTypes.func.isRequired,
};

export default withStyles(styles, { withTheme: true })(Container);
