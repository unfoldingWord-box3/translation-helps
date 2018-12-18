import usfmjs from 'usfm-js';
import {each} from 'async';

// Purpose: application wide
// Scope: limited to resource files and parsing
// Notes: pass in manifests don't fetch them

import * as ApplicationHelpers from '../../ApplicationHelpers';

export const fetchResources = (props) => new Promise((resolve, reject) => {
  const {context: {username, languageId, reference}, manifests} = props;
  let resources = {
    ult: null,
    tn: null,
    original: null,
  };
  const resourceIds = ['ult', 'tn', 'original'];
  each(resourceIds,
    (resourceId, done) => {
      switch (resourceId) {
        case 'ult':
          fetchBook(username, languageId, reference.bookId, manifests.ult)
          .then(data => {
            resources[resourceId] = data.chapters;
            done();
          });
          break;
        case 'tn':
          translationNotes(username, languageId, reference.bookId, manifests.tn)
          .then(data => {
            resources[resourceId] = data;
            done();
          });
          break;
        case 'original':
          fetchOriginalBook(username, languageId, reference.bookId, manifests.uhb, manifests.ugnt)
          .then(data => {
            resources[resourceId] = data.chapters;
            done();
          });
          break;
        default:
          done();
          break;
      }
    },
    (error) => {
      resolve(resources);
    }
  );
});

export const fetchBook = (username, languageId, bookId, manifest) => new Promise((resolve, reject) => {
  if (!projectByBookId(manifest.projects, bookId)) {
    const error = 'book not found in ult';
    console.warn(error);
    reject(error);
  }
  const repository = ApplicationHelpers.resourceRepositories(languageId).ult;
  fetchFileByBookId(username, repository, bookId, manifest)
  .then(usfm => {
    const json = usfmjs.toJSON(usfm);
    resolve(json);
  }).catch(reject);
});

export const whichTestament = (bookId, uhbManifest, ugntManifest) => {
  let testament;
  const uhbProject = projectByBookId(uhbManifest.projects, bookId);
  const ugntProject = projectByBookId(ugntManifest.projects, bookId);
  if (uhbProject) testament = 'old';
  if (ugntProject) testament = 'new';
  return testament;
}

export const fetchOriginalBook = (username, languageId, bookId, uhbManifest, ugntManifest) => new Promise((resolve, reject) => {
  let manifest, repository;
  const testament = whichTestament(bookId, uhbManifest, ugntManifest);
  const repositories = ApplicationHelpers.resourceRepositories(languageId);
  if (testament === 'old') {
    manifest = uhbManifest;
    repository = repositories.uhb;
  };
  if (testament === 'new') {
    manifest = ugntManifest;
    repository = repositories.ugnt;
  };
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

export const fetchUHBBook = (username, languageId, bookId, manifest) => new Promise((resolve, reject) => {
  const repository = ApplicationHelpers.resourceRepositories(languageId).uhb;
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
        occurrence_note = (!!occurrence_note) ? occurrence_note.replace(/<br>/g,'\n') : occurrence_note;
        let object = {
          id,
          support_reference,
          original_quote,
          occurrence,
          gl_quote,
          occurrence_note,
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
  let {path} = projectByBookId(manifest.projects, bookId);
  path = path.replace(/^\.\//, '');
  ApplicationHelpers.fetchFileFromServer(username, repository, path)
  .then(resolve).catch(reject);
});

export const projectByBookId = (projects, bookId) => {
  const _projects = projects.filter(item => item.identifier === bookId);
  let project;
  if (_projects.length > 0) {
    project = _projects[0];
  }
  return project;
}

export const tsvParse = (tsv) =>
  tsv.split('\n').map(row => row.trim().split('\t'));
