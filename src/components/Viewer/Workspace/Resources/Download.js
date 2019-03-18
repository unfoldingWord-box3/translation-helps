import React, {useState} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  Card,
  CardActions,
  CardContent,
  Button,
  Typography,
  CircularProgress,
} from '@material-ui/core';

import * as gitApi from '../../gitApi';

const Component = ({
  classes,
  context: {
    username,
    languageId,
  },
}) => {
  const [downloading, setDownloading] = useState(false);

  const subject = 'All Resources for this Language';
  const title = 'Download for Offline Use';
  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
          {subject}
        </Typography>
        <Typography variant="h6" component="h3">
          {title}
        </Typography>
      </CardContent>
      <CardActions className={classes.actions}>
        {
          downloading ? (
            <CircularProgress
              className={classes.progress}
              color="secondary"
              disableShrink
            />
          ) : (
            <div />
          )
        }
        <Button
          size="small"
          variant="contained"
          className={classes.button}
          color="primary"
          onClick={()=>{
            setDownloading(true);
            gitApi.fetchRepositoriesZipFiles({username, languageId, onProgress: (progress)=>{

            }})
            .then(response => {
              setDownloading(false);
              console.log(response);
            });
          }}
        >
          Download
        </Button>
      </CardActions>
    </Card>
  );
}

Component.propTypes = {
  classes: PropTypes.object.isRequired,
  context: PropTypes.object.isRequired,
};

const styles = {
  card: {
    minWidth: 275,
    marginBottom: '1em',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  actions: {
    width: '100%',
    textAlign: 'right',
  },
  button: {
    marginLeft: 'auto',
  },
  progress: {
    margin: 'auto',
    display: 'block',
  },
};

export default withStyles(styles)(Component);
