import {each} from 'async';

import * as ApplicationHelpers from '../../../helpers';

export const fetchHelps = (username, languageId, storyKey, frameKey) => new Promise((resolve, reject) => {
  let helps = {};
  each(
    ['obs-tn', 'obs-tq', 'obs-sn'],
    (resourceId, done) => {
      switch (resourceId) {
        case 'obs-tn':
          fetchNotesAndWords(username, languageId, storyKey, frameKey)
          .then(data => {
            helps.notes = data.notes;
            helps.words = data.words;
            done();
          }).catch(done);
          break;
        case 'obs-tq':
          fetchQuestions(username, languageId, storyKey, frameKey)
          .then(data => {
            helps.questions = data;
            done();
          }).catch(done);
          break;
        case 'obs-sn':
          fetchStudyNotes(username, languageId, storyKey, frameKey)
          .then(data => {
            helps.studyNotes = data;
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

export const fetchStudyQuestions = (username, languageId, storyKey) => new Promise((resolve, reject) => {
  const repository = ApplicationHelpers.resourceRepositories(languageId)['obs-sq'];
  const file = pad(storyKey) + '.md';
  const filepath = ['content', file].join('/');
  ApplicationHelpers.fetchFileFromServer(username, repository, filepath)
  .then(markdown => {
    resolve(markdown);
  }).catch(reject);
});

export const fetchStudyNotes = (username, languageId, storyKey, frameKey) => new Promise((resolve, reject) => {
  const repository = ApplicationHelpers.resourceRepositories(languageId)['obs-sn'];
  const file = pad(frameKey) + '.md';
  const filepath = ['content', pad(storyKey), file].join('/');
  ApplicationHelpers.fetchFileFromServer(username, repository, filepath)
  .then(markdown => {
    const data = parseStudyNotes(markdown);
    resolve(data);
  }).catch(reject);
});

export const fetchQuestions = (username, languageId, storyKey, frameKey) => new Promise((resolve, reject) => {
  const repository = ApplicationHelpers.resourceRepositories(languageId)['obs-tq'];
  const file = pad(frameKey) + '.md';
  const filepath = ['content', pad(storyKey), file].join('/');
  ApplicationHelpers.fetchFileFromServer(username, repository, filepath)
  .then(markdown => {
    const questions = parseQuestions(markdown);
    resolve(questions);
  }).catch(reject);
});

export const fetchNotesAndWords = (username, languageId, storyKey, frameKey) => new Promise((resolve, reject) => {
  const repository = ApplicationHelpers.resourceRepositories(languageId)['obs-tn'];
  const file = pad(frameKey) + '.md';
  const filepath = ['content', pad(storyKey), file].join('/');
  ApplicationHelpers.fetchFileFromServer(username, repository, filepath)
  .then(markdown => {
    const helps = parseNotes(markdown);
    resolve(helps);
  }).catch(reject);
});

export const pad = (number) => `${(number < 10) ? 0 : ''}${number}`;

export const parseQuestions = (markdown) => {
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

export const parseNotes = (markdown) => {
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

export const parseStudyNotes = (markdown) => {
  const data = markdown.split(/\n\s*#+\s*/m)
  .map(noteText => {
    const [quote, ...noteLines] = noteText.split(/\n\s*\n/m);
    const gl_quote = quote.replace(/\s*#\s*/,'');
    const occurrence_note = noteLines.join('\n\n');
    return {
      gl_quote,
      occurrence_note,
    };
  }).filter(note => !/^;/.test(note.occurrence_note));
  return data;
}
