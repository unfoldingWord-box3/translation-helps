import Path from 'path';
import YAML from 'yaml';
import localforage from 'localforage';
import { setup } from 'axios-cache-adapter';

import * as langnames from './langnames';

const baseURL = 'https://git.door43.org/';
const apiPath = 'api/v1';

const store = localforage.createInstance({
  driver: [localforage.INDEXEDDB],
  name: 'web-cache',
});

const api = setup({
  baseURL: baseURL,
  cache: {store, maxAge: 1 * 24 * 60 * 60 * 1000},
});

export const resourceRepositories = ({languageId}) => {
  return {
    obs: languageId + '_obs',
    'obs-tn': languageId + '_obs-tn',
    'obs-tq': languageId + '_obs-tq',
    'obs-sn': languageId + '_obs-sn',
    'obs-sq': languageId + '_obs-sq',
    ult: languageId + '_ult',
    ust: languageId + '_ust',
    irv: languageId + '_irv',
    ulb: languageId + '_ulb',
    udb: languageId + '_udb',
    tn: languageId + '_tn',
    ta: languageId + '_ta',
    tw: languageId + '_tw',
    ugnt: 'UGNT',
    uhb: 'UHB',
    ugl: languageId + '_ugl',
    uhal: languageId + '_uhal',
  };
};

export async function fetchResourceManifests({username, languageId}) {
  let manifests = {};
  const _resourceRepositories = resourceRepositories({languageId});
  const resourceIds = Object.keys(_resourceRepositories);
  const promises = resourceIds.map(resourceId => {
    const repository = _resourceRepositories[resourceId];
    const _username = ['ugnt','uhb'].includes(resourceId) ? 'unfoldingword' : username;
    return fetchManifest({username: _username, repository})
  });
  const manifestArray = await Promise.all(promises);
  resourceIds.forEach((resourceId, index) => {
    manifests[resourceId] = manifestArray[index];
  });
  return manifests;
};

export async function getLanguages({username, resourceIds}) {
  const languageIds = await getLanguageIds({username, resourceIds});
  const languages = languageIds.map(languageId =>
    langnames.getLanguage({languageId})
  ).filter(language => !!language);
  languages.sort((a,b) =>
    (a.languageId > b.languageId) ? 1 : ((b.languageId > a.languageId) ? -1 : 0)
  );
  return languages;
};

export async function getLanguageIds({username, resourceIds}) {
  let languageIds = [];
  const promises = resourceIds.map(resourceId => {
    return getLanguageIdsByResource({username, resourceId});
  });
  const languageIdsArray = await Promise.all(promises);
  const _languageIds = languageIdsArray.flat();
  _languageIds.forEach(languageId => {
    const languageAdded = languageIds.includes(languageId);
    if (!languageAdded) languageIds.push(languageId);
  });
  return languageIds;
}

// /repos/search?q=ulb&uid=4598&limit=50&exclusive=true
export async function getLanguageIdsByResource({username, resourceId}) {
  let languageIds = [];
  const uid = await getUID({username});
  const query = `q=${resourceId}&uid=${uid}&limit=50&exclusive=true`;
  const uri = Path.join(apiPath, `repos/search?${query}`);
  const repos = await get({uri});
  if (repos && repos.data) {
    languageIds = repos.data.map(repo => repo.name.split('_')[0]);
  }
  return languageIds;
};

export async function fetchManifest({username, repository}) {
  const yaml = await fetchFileFromServer({username, repository, path: 'manifest.yaml'});
  const json = (yaml) ? YAML.parseDocument(yaml).toJSON() : null;
  return json;
};

// https://git.door43.org/unfoldingword/en_ult/raw/branch/master/manifest.yaml
export async function fetchFileFromServer({username, repository, path, branch='master'}) {
  const repoExists = await repositoryExists({username, repository});
  if (repoExists) {
    const uri = Path.join(username, repository, 'raw/branch', branch, path);
    try {
      const data = await get({uri});
      return data;
    }
    catch(error) {
      return null;
    }
  } else {
    return null;
  }
};

export async function getUID({username}) {
  const uri = Path.join(apiPath, 'users', username);
  const user = await get({uri});
  const {id: uid} = user;
  return uid;
}
export async function repositoryExists({username, repository}) {
  const uid = await getUID({username});
  const query = `q=${repository}&uid=${uid}`;
  const uri = Path.join(apiPath, 'repos', `search?${query}`);
  const {data: repos} = await get({uri});
  const repo = repos.filter(repo => repo.name === repository)[0];
  return !!repo;
};

async function get({uri}) {
  const {data} = await api.get(uri);
  return data;
};

// http://bg.door43.org/api/v1/repos/unfoldingword/en_ugl/git/trees/master
export async function fetchTree({username, repository, sha='master'}) {
  try {
    const uri = Path.join('api/v1/repos', username, repository, 'git/trees', sha);
    const data = await get({uri});
    const tree = JSON.parse(data);
    return tree;
  } catch {
    return null;
  }
};

export async function recursiveTree({username, repository, path, sha}) {
  let tree = {};
  const pathArray = path.split();
  const results = fetchTree({username, repository, sha});
  const result = results.tree.filter(item => item.path === pathArray[0])[0];
  if (result) {
    if (result.type === 'tree') {
      const childPath = pathArray.slice(1).join('/');
      const children = recursiveTree({username, repository, path: childPath, sha: result.sha});
      tree[result.path] = children;
    } else if (result.type === 'blob') {
      tree[result.path] = true;
    }
  }
};

export async function fileExists({username, repository, path, branch}) {
  // get root listing
  recursiveTree()
  // get recursive path listing
}
