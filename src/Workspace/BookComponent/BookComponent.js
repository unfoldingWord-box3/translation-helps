import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import { withStyles } from '@material-ui/core/styles';
import {
  Paper,
  Grid,
} from '@material-ui/core';
import {
} from '@material-ui/icons';

import ChapterComponent from './ChapterComponent';

export const BookComponent = ({classes, bookData, translationNotesData}) => {
  const chapters = Object.keys(bookData.chapters).map(chapterKey =>
    <Grid key={chapterKey} item xs={12} sm={6} md={4} lg={3}>
      <Paper className={classes.paper}>
        <ChapterComponent
          key={chapterKey}
          chapterKey={chapterKey}
          chapterData={bookData.chapters[chapterKey]}
          translationNotesChapterData={translationNotesData[chapterKey]}
        />
      </Paper>
    </Grid>
  );
  const intro = translationNotesData['front']['intro'][0]['occurrence_note'];
  return (
    <div className={classes.root}>
      <Grid container spacing={24}>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <Paper className={classes.paper}>
            <ReactMarkdown
              source={intro}
              escapeHtml={false}
            />
          </Paper>
        </Grid>
        {chapters}
      </Grid>
    </div>
  );
};

BookComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  bookData: PropTypes.object.isRequired,
  translationNotesData: PropTypes.object,
};

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'justified',
    color: theme.palette.text.secondary,
  },
});

export default withStyles(styles)(BookComponent);
