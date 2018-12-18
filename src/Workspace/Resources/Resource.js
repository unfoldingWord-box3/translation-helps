import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  Card,
  CardActions,
  CardContent,
  Button,
  Typography,
} from '@material-ui/core';

const Resource = ({
  classes,
  manifest,
  manifest: {
    dublin_core: {
      identifier,
      subject,
      title,
      description,
      publisher,
      language,
      rights,
      contributors,
    }
  },
  context: {
    username,
    languageId,
  },
  setContext,
}) => {
  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
          {subject}
        </Typography>
        <Typography variant="h5" component="h2">
          {title}
        </Typography>
        <Typography className={classes.pos} color="textSecondary">
          {rights}
        </Typography>
        <Typography component="p">
          {description}
        </Typography>
      </CardContent>
      <CardActions className={classes.actions}>
        <Button
          size="small"
          variant="contained"
          className={classes.button}
          color="primary"
          onClick={() => {
            const resourceId = identifier;
            const reference = (resourceId === 'obs') ? {bookId: resourceId} : {};
            const context = {username, languageId, resourceId: identifier, reference};
            setContext(context);
          }}
        >
          Open
        </Button>
      </CardActions>
    </Card>
  );
}

Resource.propTypes = {
  classes: PropTypes.object.isRequired,
  manifest: PropTypes.object.isRequired,
  context: PropTypes.object.isRequired,
  setContext: PropTypes.func.isRequired,
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
};

export default withStyles(styles)(Resource);
