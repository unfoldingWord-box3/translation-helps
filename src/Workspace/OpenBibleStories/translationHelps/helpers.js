import {each} from 'async';

import * as ApplicationHelpers from '../../../ApplicationHelpers';

export const fetchHelps = (username, languageId, storyKey, frameKey) => new Promise((resolve, reject) => {
  let helps = {};
  each(
    ['obs-tn', 'obs-tq'],
    (resourceId, done) => {
      switch (resourceId) {
        case 'obs-tn':
          fetchNotesAndWords(username, languageId, storyKey, frameKey)
          .then(response => {
            helps.notes = response.notes;
            helps.words = response.words;
            done();
          }).catch(done);
          break;
        case 'obs-tq':
          fetchQuestions(username, languageId, storyKey, frameKey)
          .then(questions => {
            helps.questions = questions;
            done();
          }).catch(done);
          break;
        default:
          done();
          break;
      };
    },
    (error) => {
      resolve(helps);
    }
  );
});

export const fetchQuestions = (username, languageId, storyKey, frameKey) => new Promise((resolve, reject) => {
  const repository = ApplicationHelpers.resourceRepositories(languageId)['obs-tq'];
  const file = pad(frameKey) + '.md';
  const filepath = ['content', pad(storyKey), file].join('/');
  ApplicationHelpers.fetchFileFromServer(username, repository, filepath)
  .then(markdown => {
    const questions = parseQuestionsMarkdown(markdown);
    resolve(questions);
  }).catch(reject);
});

export const fetchNotesAndWords = (username, languageId, storyKey, frameKey) => new Promise((resolve, reject) => {
  const repository = ApplicationHelpers.resourceRepositories(languageId)['obs-tn'];
  const file = pad(frameKey) + '.md';
  const filepath = ['content', pad(storyKey), file].join('/');
  ApplicationHelpers.fetchFileFromServer(username, repository, filepath)
  .then(markdown => {
    const helps = parseNotesMarkdown(markdown);
    resolve(helps);
  }).catch(reject);
});

export const pad = (number) => `${(number < 10) ? 0 : ''}${number}`;

export const parseQuestionsMarkdown = (markdown) => {
  const questions = markdown.split(/\n\s*#\s*/m)
  .map(questionItem => {
    const [questionText, ...answerLines] = questionItem.split(/\n\s*/m);
    const question = questionText.replace(/\s*#\s*/,'');
    const answer = answerLines.join('\n\n');
    return {
      gl_quote: question,
      occurrence_note: answer,
    };
  });
  return questions;
}

export const parseNotesMarkdown = (markdown) => {
  const [notesMarkdown, wordsMarkdown] = markdown.split(/#+\s*translationWords\s*/m);
  const notes = notesMarkdown.split(/\n\s*#\s*/m)
  .map(noteText => {
    const [quote, ...noteLines] = noteText.split(/\n\s*\n/m);
    const gl_quote = quote.replace(/\s*#\s*/,'');
    const occurrence_note = noteLines.join('\n\n');
    return {
      gl_quote,
      occurrence_note,
    };
  });
  let words;
  if (/\w+/.test(wordsMarkdown)) {
    words = wordsMarkdown.split(/\n?\s*\*\s*/m)
    .map(word => word.replace(/\[\[rc/,'http').replace(/\]\]/,''));
  }
  const helps = {
    notes,
    words,
  };
  return helps;
}
