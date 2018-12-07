import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  Chip,
  Typography,
} from '@material-ui/core';

import * as helpers from './helpers';

class RCLinkContainer extends React.Component {
  state = {
    languageId: null,
    resourceId: null,
    path: null,
    title: null,
    article: null,
    open: null,
  };

  parseHref(href) {
    let _match, languageId, resourceId, path;
    const regexpLanguageIdResourcePath = /http:\/\/([\w-_]+)\/([\w-_]+)\/(.+)/;
    if (regexpLanguageIdResourcePath.test(href)) {
      const match = regexpLanguageIdResourcePath.exec(href);
      [_match, languageId, resourceId, path] = match;
    } else {
      path = href;
    }
    return {
      languageId: languageId,
      resourceId: resourceId,
      path: path,
    }
  };

  componentWillMount() {
    const {href, children} = this.props;
    let state = this.parseHref(href);
    state.title = children[0];
    this.setState(state);
  };

  componentDidMount() {
    const {languageId, resourceId, path} = this.state;
    if (languageId && resourceId && path) {
      helpers.fetchTitle(languageId, resourceId, path)
      .then(title => {
        this.setState({
          title: title,
        });
      });
    }
  };

  handleOpen = () => {
    const {languageId, resourceId, path, title} = this.state;
    helpers.fetchArticle(languageId, resourceId, path)
    .then(article => {
      const tab = {
        title: title || path,
        text: article,
      };
      this.props.addTab(tab);
    });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const {title, path} = this.state;
    const {classes} = this.props;

    return (
      <Chip
        label={
          <Typography noWrap>
            {title || path}
          </Typography>
        }
        className={classes.chip}
        classes={{label: classes.label}}
        onClick={this.handleOpen}
        clickable
      />
    );
  }
};

RCLinkContainer.propTypes = {
  classes: PropTypes.object.isRequired,
  url: PropTypes.string.isRequired,
  addTab: PropTypes.func.isRequired,
};


const styles = theme => ({
  chip: {
    height: 'unset',
    maxWidth: '95%',
  },
  label: {
    maxWidth: '90%',
  }
});

export default withStyles(styles, { withTheme: true })(RCLinkContainer);
