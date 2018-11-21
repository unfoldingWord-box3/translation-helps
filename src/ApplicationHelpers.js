import path from 'path';
import YAML from 'yaml';
import usfmjs from 'usfm-js';

const uriBase = "https://git.door43.org/";

export const fetchBook = (username, languageId, bookId) => new Promise((resolve, reject) => {
  const repository = languageId + '_ult';
  fetchFileByBookId(username, repository, bookId)
  .then(usfm => {
    const json = usfmjs.toJSON(usfm);
    resolve(json);
  }).catch(reject);
});

export const translationNotes = (username, languageId, bookId) => new Promise((resolve, reject) => {
  fetchNotes(username, languageId, bookId)
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

export const fetchNotes = (username, languageId, bookId) => new Promise((resolve, reject) => {
  const repository = languageId + '-tn';
  fetchFileByBookId(username, repository, bookId)
  .then(tsv => {
    const data = tsvParse(tsv);
    resolve(data);
  }).catch(reject);
});

export const fetchFileByBookId = (username, repository, bookId) => new Promise((resolve, reject) => {
  fetchManifest(username, repository, bookId).then(manifest => {
    let {path} = projectByBookId(manifest.projects, bookId);
    path = path.replace(/^\.\//, '');
    fetchFileFromServer(username, repository, path)
    .then(resolve).catch(reject);
  });
});

export const projectByBookId = (projects, bookId) =>
  projects.filter(item => item.identifier === bookId)[0];

export const tsvParse = (tsv) =>
  tsv.split('\n').map(row => row.trim().split('\t'));

export const fetchManifest = (username, repository) => new Promise((resolve, reject) => {
  fetchFileFromServer(username, repository, 'manifest.yaml')
  .then(yaml => {
    const json = YAML.parseDocument(yaml).toJSON();
    resolve(json);
  }).catch(reject);
});

// https://git.door43.org/unfoldingword/en_ult/raw/branch/master/manifest.yaml
export const fetchFileFromServer = (username, repository, filepath, branch='master') => new Promise((resolve, reject) => {
  const uri = path.join(username, repository, 'raw/branch', branch, filepath);
  get(uri).then(resolve).catch(reject);
});

export const get = (_uri) => new Promise((resolve, reject) => {
  const uri = uriBase + _uri;
  fetch(uri, { mode: 'cors' }).then(response => {
    resolve(response.text())
  }).catch(reject);
});
