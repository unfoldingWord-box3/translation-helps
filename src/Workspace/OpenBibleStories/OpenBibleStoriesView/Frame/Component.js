import React from 'react';
import PropTypes from 'prop-types';
import remark from 'remark';
import remark2react from 'remark-react';
import { withStyles } from '@material-ui/core/styles';
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  IconButton,
  Collapse,
} from '@material-ui/core';
import {
  ExpandMore,
  ExpandLess,
} from '@material-ui/icons';

import TranslationHelps from '../../../TranslationHelps';

export const Frame = ({
  classes,
  context,
  setContext,
  open,
  handleToggleOpen,
  storyKey,
  frameKey,
  image,
  text,
  helps,
}) => {

  let tabs = [];
  if (helps && helps.notes) {
    const notesTab = {
      title: 'Notes',
      notes: helps.notes,
    };
    tabs.push(notesTab)
  };
  if (helps && helps.words) {
    const wordsTab = {
      title: 'Words',
      words: helps.words,
    };
    tabs.push(wordsTab);
  }
  if (helps && helps.questions) {
    const questionsTab = {
      title: 'Questions',
      notes: helps.questions,
    };
    tabs.push(questionsTab);
  }

  const details = (tabs.length > 0) ?
    <TranslationHelps
      context={context}
      setContext={setContext}
      tabs={tabs}
    /> : null;

  const options = {
    remarkReactComponents: {
      strong: 'sup',
    }
  };
  const _text = (frameKey > 0) ? `**${frameKey}** ${text}` : text;
  const content = remark().use(remark2react, options).processSync(_text).contents;

  return (
    <Card className={classes.card}>
      {
        image ?
        <CardMedia
          className={classes.media}
          image={image}
          title="Open Bible Stories Image"
        />
        : null
      }
      <CardContent className={classes.content}>
        {content}
      </CardContent>
      <CardActions className={classes.actions} disableActionSpacing>
        <IconButton
          className={classes.button}
          onClick={handleToggleOpen}
          aria-expanded={open}
          aria-label="Show more"
        >
          {open ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </CardActions>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <CardContent className={classes.details}>
          {details}
        </CardContent>
        <CardActions className={classes.actions} disableActionSpacing>
          <IconButton
            className={classes.button}
            onClick={handleToggleOpen}
            aria-expanded={open}
            aria-label="collapse"
          >
            {open ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </CardActions>
      </Collapse>
    </Card>
  );
}

Frame.propTypes = {
  classes: PropTypes.object.isRequired,
  context: PropTypes.object.isRequired,
  setContext: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  handleToggleOpen: PropTypes.func.isRequired,
  frameKey: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired,
  image: PropTypes.string,
  helps: PropTypes.object.isRequired,
};

const styles = {
  card: {
    marginBottom: '1em',
  },
  media: {
    height: 320,
  },
  content: {
    paddingBottom: 0,
  },
  details: {
    padding: 0,
  },
  actions: {
    padding: 0,
  },
  button: {
    marginLeft: 'auto',
  },
};

export default withStyles(styles)(Frame);
