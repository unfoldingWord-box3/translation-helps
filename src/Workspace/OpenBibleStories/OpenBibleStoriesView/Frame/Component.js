import React from 'react';
import PropTypes from 'prop-types';
import remark from 'remark';
import remark2react from 'remark-react';
import ReactPlayer from 'react-player';
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
import * as helpers from '../../helpers';

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
  let videoFrame;
  if (parseInt(frameKey) === 0) {
    const youtubeId = helpers.youtubeId(storyKey);
    const videoUrl = `https://www.youtube.com/watch?v=${youtubeId}`;
    const config = {
      youtube: {
        playerVars: {
          rel: 0,
          modestbranding: 1,
        },
      },
    };
    videoFrame = (
      <ReactPlayer
        className={classes.media}
        url={videoUrl}
        controls={true}
        config={config}
      />
    );
  }

  let tabs = [];
  if (helps) {
    const {
      notes,
      words,
      questions,
      studyNotes,
      studyQuestions,
    } = helps;
    if (studyQuestions) tabs.push({ title: 'Study Questions', text: helps.studyQuestions });
    if (notes) tabs.push({ title: 'Notes', notes });
    if (words) tabs.push({ title: 'Words', words });
    if (questions) tabs.push({ title: 'Questions', notes: questions });
    if (studyNotes) tabs.push({ title: 'Study Notes', notes: helps.studyNotes });
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
        : videoFrame
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
    width: 'calc(100vw)',
    height: 'calc(100vw * 9/16)',
    maxWidth: '40em',
    maxHeight: 'calc(40em * 9/16)',
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
  video: {
    width: 'calc(100vw - 5.3em)',
    height: 'calc((100vw - 5.3em) * (9/16))',
    maxWidth: 'calc(40em - 3.5em)',
    maxHeight: 'calc((40em - 3.5em) * (9/16))',
  }
};

export default withStyles(styles)(Frame);
