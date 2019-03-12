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

import {getLanguages} from '../../../gitApi';
import components from './components';
import styles from '../styles';

class Container extends React.Component {
  state = {
    languages: [],
  };

  async componentDidMount() {
    const {username} = this.props.context;
    const resourceIds = ['ult','ust','ulb','udb','irv','obs'];
    const languages = await getLanguages({username, resourceIds});
    this.setState({languages});
  };

  handleChange = name => object => {
    const languageId = object.value;
    const context = {...this.props.context, languageId};
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

    const suggestions = this.state.languages
    .map(({languageId, languageName, localized, region, gateway}) => {
      const value = languageId;
      const name = `${languageId} - ${languageName} - ${localized}`;
      const gatewayLabel = `(${region} ${gateway ? 'Gateway' : 'Other'})`;
      const label = `${name} ${gatewayLabel}`;
      return {value, label};
    });

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
