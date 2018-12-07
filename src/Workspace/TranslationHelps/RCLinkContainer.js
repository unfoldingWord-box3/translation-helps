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
    reference: null,
  };

  parseHref(href) {
    let _match, languageId, resourceId, path, reference;
    const regexpLanguageIdResourcePath = /http:\/\/([\w-_]+)\/([\w-_]+)\/(.+)/;
    if (regexpLanguageIdResourcePath.test(href)) {
      const match = regexpLanguageIdResourcePath.exec(href);
      [_match, languageId, resourceId, path] = match;
    } else {
      path = href;
    }
    if (resourceId === 'tn') {
      const regexpReference = /\/([\w]+)\/([\d]+)\/([\d]+)/;
      if (regexpReference.test(path)) {
        const match = regexpReference.exec(path);
        const [_match, book, chapter, verse] = match;
        if (book !== 'obs') {
          reference = {book, chapter: parseInt(chapter), verse: parseInt(verse)};
        }
      }
    }
    return {
      languageId,
      resourceId,
      path,
      reference,
    }
  };

  componentWillMount() {
    const {href, children} = this.props;
    let state = this.parseHref(href);
    const text = children[0];
    if (text !== href) {
      state.title = text;
    }
    this.setState(state);
  };

  componentDidMount() {
    const {title, languageId, resourceId, path} = this.state;
    if (!title && languageId && resourceId && path) {
      helpers.fetchTitle(languageId, resourceId, path)
      .then(title => {
        this.setState({
          title: title,
        });
      });
    }
  };

  handleOpen = () => {
    const {languageId, resourceId, path, title, reference} = this.state;
    if (reference) {
      this.props.setReference(reference)
    } else {
      helpers.fetchArticle(languageId, resourceId, path)
      .then(article => {
        const tab = {
          title: title || path,
          text: article,
        };
        this.props.addTab(tab);
      });
    }
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
          <Typography noWrap component='span'>
            {title || path}
          </Typography>
        }
        component='span'
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
  href: PropTypes.string.isRequired,
  addTab: PropTypes.func.isRequired,
  setReference: PropTypes.func.isRequired,
};


const styles = theme => ({
  chip: {
    height: 'unset',
    maxWidth: '95%',
  },
  label: {
    maxWidth: '94%',
  }
});

export default withStyles(styles, { withTheme: true })(RCLinkContainer);
