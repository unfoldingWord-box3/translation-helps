import * as gitApi from '../../../gitApi';

const resourceRepository = ({languageId}) => gitApi.resourceRepositories({languageId}).tw;
// https://git.door43.org/[organization]/[languageId]_ta/src/branch/master/bible/kt/abomination.md
// title = first line of file
// markdown = the path + .md
// rc://en/tw/dict/bible/kt/christ
export async function fetchTitle({organization, languageId, path}) {
  let title;
  const repository = resourceRepository({languageId});
  const _path = path.split('/').splice(1).join('/') + '.md';
  const markdown = await gitApi.getFile({organization, repository, path: _path});
  if (markdown) {
    title = markdown.split(/\n/)[0].replace(/#/g, '').trim();
  }
  return title;
};

export async function fetchArticle({organization, languageId, path}) {
  let article;
  const repository = resourceRepository({languageId});
  const _path = path.split('/').filter(word => word !== 'dict').join('/') + '.md';
  const _article = await gitApi.getFile({organization, repository, path: _path});
  if (_article) {
    const prefix = _path.split('/').splice(0,1).join('/');
    article = _article
    .split('../').join(`http://${languageId}/tw/${prefix}/`)
    .split('.md').join('')
    .split('rc://').join('http://');
  }
  return article;
};
