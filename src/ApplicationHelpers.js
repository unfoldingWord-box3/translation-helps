import path from 'path';
import YAML from 'yaml';
import {each} from 'async';
import localforage from 'localforage';
import { setup } from 'axios-cache-adapter';

const baseURL = "https://d3r5pm83aa8hdu.cloudfront.net/";

const store = localforage.createInstance({
  driver: [localforage.INDEXEDDB],
  name: 'web-cache',
});
const api = setup({
  baseURL: baseURL,
  cache: {store, maxAge: 24 * 60 * 60 * 1000},
});

// Purpose: application wide
// Scope: limited to resource manifests and information

export const username = 'unfoldingword';
export const resourceRepositories = (languageId) => {
  return {
    ult: languageId + '_ult',
    tn: languageId + '-tn',
    ta: languageId + '-ta',
    tw: languageId + '-tw',
    ugnt: 'UGNT',
    uhb: 'UHB',
    ugl: languageId + '_ugl',
    uhal: languageId + '_uhal',
    obs: languageId + '_obs',
    'obs-tn': languageId + '_obs-tn',
    'obs-tq': languageId + '_obs-tq',
  };
};

export const fetchResourceManifests = (username, languageId) => new Promise((resolve, reject) => {
  let manifests = {};
  const _resourceRepositories = resourceRepositories(languageId);
  const resourceIds = Object.keys(_resourceRepositories);
  each(
    resourceIds,
    (resourceId, done) => {
      const repository = _resourceRepositories[resourceId];
      fetchManifest(username, repository)
      .then(manifest => {
        manifests[resourceId] = manifest;
        done();
      }).catch(reject);
    },
    (error) => {
      if (error) reject(error);
      resolve(manifests);
    }
  );
});

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

export const get = (uri) => new Promise((resolve, reject) => {
  api.get(uri).then(response => {
    resolve(response.data);
  }).catch(error => {
    reject(error);
  });
});
