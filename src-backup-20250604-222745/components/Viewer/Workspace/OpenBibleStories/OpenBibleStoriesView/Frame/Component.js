import React from 'react';
import PropTypes from 'prop-types';
import remark from 'remark';
import remark2react from 'remark-react';
import { withStyles } from '@material-ui/core/styles';

import Card from '../Card';
import TranslationHelps from '../../../TranslationHelps';
import * as helpers from '../../helpers';

export const Component = ({
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
    /> : <div />;

  const options = {
    remarkReactComponents: {
      strong: 'sup',
    }
  };
  const _text = (frameKey > 0) ? `**${frameKey}** ${text}` : text;
  const content = remark().use(remark2react, options).processSync(_text).contents;

  let youtubeId;
  if (parseInt(frameKey) === 0) {
    youtubeId = helpers.youtubeId({storyKey});
  }

  return (
    <Card
      context={context}
      content={content}
      details={details}
      image={image}
      youtubeId={youtubeId}
    />
  );
}

Component.propTypes = {
  classes: PropTypes.object.isRequired,
  context: PropTypes.object.isRequired,
  setContext: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  handleToggleOpen: PropTypes.func.isRequired,
  frameKey: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  image: PropTypes.string,
  helps: PropTypes.object.isRequired,
};

const styles = {
};

export default withStyles(styles)(Component);
