import React from 'react';
import PropTypes from 'prop-types';
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

export const Component = ({
  classes,
  open,
  handleToggleOpen,
  content,
  details,
  image,
  youtubeId,
}) => {
  let videoFrame;
  if (youtubeId) {
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
      <div className={classes.media}>
        <ReactPlayer
          className={classes.player}
          url={videoUrl}
          controls={true}
          config={config}
          height="100%"
          width="100%"
        />
      </div>
    );
  }

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

Component.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  handleToggleOpen: PropTypes.func.isRequired,
  content: PropTypes.element.isRequired,
  details: PropTypes.element.isRequired,
  image: PropTypes.string,
  youtubeId: PropTypes.string,
};

const styles = {
  card: {
    marginBottom: '1em',
  },
  media: {
    width: 'calc(100vw - 1.9em)',
    height: 'calc((100vw - 1.9em) * 9/16)',
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
  player: {
    width: '100%',
    height: '100%',
  },
};

export default withStyles(styles)(Component);
