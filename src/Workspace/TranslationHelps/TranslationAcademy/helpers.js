import * as ApplicationHelpers from '../../../helpers';

const resourceRepository = ({languageId}) => ApplicationHelpers.resourceRepositories({languageId}).ta;
// https://git.door43.org/[username]/[languageId]_ta/src/branch/master/translate/figs-metaphor
// title = title.md
// markdown = 01.md
export async function fetchTitle({username, languageId, path}) {
  const repository = resourceRepository({languageId});
  const _path = path.split('/').splice(1).join('/') + '/title.md';
  const title = await ApplicationHelpers.fetchFileFromServer({username, repository, path: _path});
  return title;
};

export async function fetchArticle({username, languageId, path}) {
  let article;
  const repository = resourceRepository({languageId});
  const _path = path.split('/').filter(word => word !== 'man').join('/') + '/01.md';
  try {
    const _article = await ApplicationHelpers.fetchFileFromServer({username, repository, path: _path})
    const prefix = _path.split('/').splice(0,1).join('/');
    article = _article
    .split('../').join(`http://${languageId}/ta/${prefix}/`)
    .split('/01.md').join('')
    .split('rc://').join('http://');
  } catch {
    debugger
  }
  return article;
};
