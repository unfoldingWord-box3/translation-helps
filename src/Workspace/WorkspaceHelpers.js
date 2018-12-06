import usfmjs from 'usfm-js';

// Purpose: application wide
// Scope: limited to resource files and parsing
// Notes: pass in manifests don't fetch them

import * as ApplicationHelpers from '../ApplicationHelpers';

export const fetchBook = (username, languageId, bookId, manifest) => new Promise((resolve, reject) => {
  const repository = ApplicationHelpers.resourceRepositories(languageId).ult;
  fetchFileByBookId(username, repository, bookId, manifest)
  .then(usfm => {
    const json = usfmjs.toJSON(usfm);
    resolve(json);
  }).catch(reject);
});

export const fetchUGNTBook = (username, languageId, bookId, manifest) => new Promise((resolve, reject) => {
  const repository = ApplicationHelpers.resourceRepositories(languageId).ugnt;
  fetchFileByBookId(username, repository, bookId, manifest)
  .then(usfm => {
    const json = usfmjs.toJSON(usfm);
    resolve(json);
  }).catch(reject);
});

export const translationNotes = (username, languageId, bookId, manifest) => new Promise((resolve, reject) => {
  fetchNotes(username, languageId, bookId, manifest)
  .then(array => {
    let translationNotesObject = {};
    array.shift();
    array.forEach(item => {
      let [book, chapter, verse, id, support_reference, original_quote, occurrence, gl_quote, occurrence_note] = item;
      if (book && chapter && verse) {
        if (!translationNotesObject[chapter]) translationNotesObject[chapter] = {};
        if (!translationNotesObject[chapter][verse]) translationNotesObject[chapter][verse] = [];
        let object = {
          id: id,
          support_reference: support_reference,
          original_quote: original_quote,
          occurrence: occurrence,
          gl_quote: gl_quote,
          occurrence_note: occurrence_note.replace(/<br>/g,'\n'),
        };
        translationNotesObject[chapter][verse].push(object);
      }
    });
    resolve(translationNotesObject);
  }).catch(reject);
})

export const fetchNotes = (username, languageId, bookId, manifest) => new Promise((resolve, reject) => {
  const repository = ApplicationHelpers.resourceRepositories(languageId).tn;
  fetchFileByBookId(username, repository, bookId, manifest)
  .then(tsv => {
    const data = tsvParse(tsv);
    resolve(data);
  }).catch(reject);
});

export const fetchFileByBookId = (username, repository, bookId, manifest) => new Promise((resolve, reject) => {
  try {
    let {path} = projectByBookId(manifest.projects, bookId);
    path = path.replace(/^\.\//, '');
    ApplicationHelpers.fetchFileFromServer(username, repository, path)
    .then(resolve).catch(reject);
  } catch {
    console.log(`manifest is not populated`, manifest);
    debugger
  }
});

export const projectByBookId = (projects, bookId) => {
  const _projects = projects.filter(item => item.identifier === bookId);
  let project;
  if (_projects.length > 0) {
    project = _projects[0];
  } else {
    console.log(`${bookId} not found in projects list: `, projects);
    project = {};
  }
  return project;
}

export const tsvParse = (tsv) =>
  tsv.split('\n').map(row => row.trim().split('\t'));
