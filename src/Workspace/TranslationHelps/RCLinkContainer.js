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
    context: {
      languageId: null,
      resourceId: null,
      reference: null,
    },
    path: null,
    title: null,
    article: null,
    open: null,
  };

  parseHref(href) {
    let _match, languageId, resourceId, path, reference, linkedResourceId;
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
        const [_match, bookId, chapter, verse] = match;
        if (bookId === 'obs') {
          resourceId = 'obs';
          reference = {chapter: parseInt(chapter), verse: parseInt(verse)};
        } else {
          resourceId = 'ult';
          reference = {bookId, chapter: parseInt(chapter), verse: parseInt(verse)};
        }
      }
    }
    return {
      context: {
        languageId,
        resourceId,
        reference,
      },
      path,
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
    const {
      context: {
        languageId,
        resourceId,
      },
      title,
      path,
    } = this.state;
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
    const {
      context: {
        languageId,
        resourceId,
        reference,
      },
      path,
      title,
    } = this.state;
    if (reference) {
      let {context} = this.props;
      if (['ult','obs'].includes(resourceId)) context.resourceId = resourceId;
      context.reference = reference;
      this.props.setContext(context);
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
  context: PropTypes.object.isRequired,
  setContext: PropTypes.func.isRequired,
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
