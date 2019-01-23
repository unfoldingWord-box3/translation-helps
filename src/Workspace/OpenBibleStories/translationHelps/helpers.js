import * as ApplicationHelpers from '../../../helpers';

export async function fetchHelps({username, languageId, storyKey, frameKey}) {
  let helps = {};
  const resourceIds = ['obs-tn', 'obs-tq', 'obs-sn'];
  const promises = resourceIds.map(resourceId => {
    let promise;
    if (resourceId === 'obs-tn')
      promise = fetchNotesAndWords({username, languageId, storyKey, frameKey});
    if (resourceId === 'obs-tq')
      promise = fetchQuestions({username, languageId, storyKey, frameKey});
    if (resourceId === 'obs-sn')
      promise = fetchStudyNotes({username, languageId, storyKey, frameKey});
    return promise;
  });
  const helpsArray = await Promise.all(promises);
  resourceIds.forEach((resourceId, index) => {
    if (resourceId === 'obs-tn') {
      helps.notes = helpsArray[index].notes;
      helps.words = helpsArray[index].words;
    }
    if (resourceId === 'obs-tq')
      helps.questions = helpsArray[index];
    if (resourceId === 'obs-sn')
      helps.studyNotes = helpsArray[index];
  });
  return helps;
};

export async function fetchStudyQuestions({username, languageId, storyKey}) {
  const repository = ApplicationHelpers.resourceRepositories({languageId})['obs-sq'];
  const file = pad(storyKey) + '.md';
  const path = ['content', file].join('/');
  const markdown = ApplicationHelpers.fetchFileFromServer({username, repository, path});
  return markdown;
};

export async function fetchStudyNotes({username, languageId, storyKey, frameKey}) {
  const repository = ApplicationHelpers.resourceRepositories({languageId})['obs-sn'];
  const file = pad(frameKey) + '.md';
  const path = ['content', pad(storyKey), file].join('/');
  const markdown = await ApplicationHelpers.fetchFileFromServer({username, repository, path});
  const data = parseStudyNotes({markdown});
  return data;
};

export async function fetchQuestions({username, languageId, storyKey, frameKey}) {
  const repository = ApplicationHelpers.resourceRepositories({languageId})['obs-tq'];
  const file = pad(frameKey) + '.md';
  const path = ['content', pad(storyKey), file].join('/');
  const markdown = await ApplicationHelpers.fetchFileFromServer({username, repository, path});
  const questions = parseQuestions({markdown});
  return questions;
};

export async function fetchNotesAndWords({username, languageId, storyKey, frameKey}) {
  const repository = ApplicationHelpers.resourceRepositories({languageId})['obs-tn'];
  const file = pad(frameKey) + '.md';
  const path = ['content', pad(storyKey), file].join('/');
  const markdown = await ApplicationHelpers.fetchFileFromServer({username, repository, path});
  const helps = parseNotes({markdown});
  return helps;
};

export const pad = (number) => `${(number < 10) ? 0 : ''}${number}`;

export const parseQuestions = ({markdown}) => {
  if (!markdown) return null;
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

export const parseNotes = ({markdown}) => {
  if (!markdown) return {};
  const [notesMarkdown, wordsMarkdown] = markdown.split(/#+\s*translationWords\s*/m);
  const notes = notesMarkdown.split(/\n\s*#\s*/m)
  .map(noteText => {
    const [quote, ...noteLines] = noteText.split(/\n\s*\n/m);
    const gl_quote = quote.replace(/\s*#\s*/,'');
    const occurrence_note = noteLines.join('\n\n')
    return {
      gl_quote,
      occurrence_note,
    };
  });
  let words;
  if (wordsMarkdown && /\w+/.test(wordsMarkdown)) {
    words = wordsMarkdown.split(/\n?\s*\*\s*/m)
    .filter(word => word !== '')
    .map(word => word.replace(/\[\[rc/,'http').replace(/\]\]/,''));
  }
  const helps = {
    notes,
    words,
  };
  return helps;
}

export const parseStudyNotes = ({markdown}) => {
  if (!markdown) return null;
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
