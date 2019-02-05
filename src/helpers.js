import Path from 'path';
import YAML from 'yaml';
import localforage from 'localforage';
import localstorage from 'local-storage'
import { setup } from 'axios-cache-adapter';

const baseURL = "https://git.door43.org/";

const store = localforage.createInstance({
  driver: [localforage.INDEXEDDB],
  name: 'web-cache',
});
const api = setup({
  baseURL: baseURL,
  cache: {store, maxAge: 1 * 24 * 60 * 60 * 1000},
});

// Purpose: application wide
// Scope: limited to resource manifests and information

export const resourceRepositories = ({languageId}) => {
  return {
    ult: languageId + '_ult',
    ust: languageId + '_ust',
    tn: languageId + '_tn',
    ta: languageId + '_ta',
    tw: languageId + '_tw',
    ugnt: 'UGNT',
    uhb: 'UHB',
    ugl: languageId + '_ugl',
    uhal: languageId + '_uhal',
    obs: languageId + '_obs',
    'obs-tn': languageId + '_obs-tn',
    'obs-tq': languageId + '_obs-tq',
    'obs-sn': languageId + '_obs-sn',
    'obs-sq': languageId + '_obs-sq',
  };
};

export async function fetchResourceManifests({username, languageId}) {
  let manifests = {};
  const _resourceRepositories = resourceRepositories({languageId});
  const resourceIds = Object.keys(_resourceRepositories);
  const resourceIdsPromises = resourceIds.map(resourceId => {
    const repository = _resourceRepositories[resourceId];
    return fetchManifest({username, repository})
  });
  const manifestArray = await Promise.all(resourceIdsPromises);
  resourceIds.forEach((resourceId, index) => {
    manifests[resourceId] = manifestArray[index];
  });
  return manifests;
};

export async function fetchManifest({username, repository}) {
  const yaml = await fetchFileFromServer({username, repository, path: 'manifest.yaml'});
  const json = (yaml) ? YAML.parseDocument(yaml).toJSON() : null;
  return json;
};

// https://git.door43.org/unfoldingword/en_ult/raw/branch/master/manifest.yaml
export async function fetchFileFromServer({username, repository, path, branch='master'}) {
  try {
    const uri = Path.join(username, repository, 'raw/branch', branch, path);
    const data = await get({uri});
    return data
  } catch {
    // debugger
  }
};

async function get({uri}) {
  const {data} = await api.get(uri);
  return data;
};

export const save = ({key, value}) => {
 return localstorage.set(key, value);
};

export const load = ({key, defaultValue}) => {
  let value;
  try {
    value = localstorage.get(key);
  } catch {
    value = defaultValue;
  }
  return value;
};

export const copy = (object) => (
  JSON.parse(JSON.stringify(object))
);
