import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import { withStyles } from '@material-ui/core/styles';
import {
  Grid,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Typography,
} from '@material-ui/core';
import {
  ExpandMore,
} from '@material-ui/icons';

import ChapterComponent from './ChapterComponent';

export const BookComponent = ({classes, bookData, translationNotesData}) => {
  const chapters = Object.keys(bookData.chapters).map(chapterKey =>
    <Grid key={chapterKey} item xs={12} sm={6} md={4} lg={3}>
      <ChapterComponent
        key={chapterKey}
        chapterKey={chapterKey}
        chapterData={bookData.chapters[chapterKey]}
        translationNotesChapterData={translationNotesData[chapterKey]}
      />
    </Grid>
  );
  const intro = translationNotesData['front']['intro'][0]['occurrence_note'];
  return (
    <div className={classes.root}>
      <Grid container spacing={24}>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <ExpansionPanel key={Math.random()}>
            <ExpansionPanelSummary
              expandIcon={
                <ExpandMore />
              }>
              <ReactMarkdown
                source={intro.split('\n')[0]}
                escapeHtml={false}
              />
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Typography>
                <ReactMarkdown
                  source={intro.split('\n').splice(1).join('\n')}
                  escapeHtml={false}
                />
              </Typography>
            </ExpansionPanelDetails>
          </ExpansionPanel>
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
