import * as gitApi from '../../../gitApi';

const resourceRepository = ({languageId}) => gitApi.resourceRepositories({languageId}).ta;
// https://git.door43.org/[organization]/[languageId]_ta/src/branch/master/translate/figs-metaphor
// title = title.md
// markdown = 01.md
export async function fetchTitle({organization, languageId, path}) {
  const repository = resourceRepository({languageId});
  const _path = path.split('/').splice(1).join('/') + '/title.md';
  const title = await gitApi.getFile({organization, repository, path: _path});
  return title;
};

export async function fetchArticle({organization, languageId, path}) {
  let article;
  const repository = resourceRepository({languageId});
  const _path = path.split('/').filter(word => word !== 'man').join('/') + '/01.md';
  try {
    const _article = await gitApi.getFile({organization, repository, path: _path})
    const prefix = _path.split('/').splice(0,1).join('/');
    article = _article
    .split('../').join(`http://${languageId}/ta/${prefix}/`)
    .split('/01.md').join('')
    .split('rc://').join('http://');
  } catch(error) {
    debugger
  }
  return article;
};
