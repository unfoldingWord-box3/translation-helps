import * as ApplicationHelpers from '../../../helpers';

const resourceRepository = ({languageId}) => ApplicationHelpers.resourceRepositories({languageId}).tw;
// https://git.door43.org/[username]/[languageId]_ta/src/branch/master/bible/kt/abomination.md
// title = first line of file
// markdown = the path + .md
// rc://en/tw/dict/bible/kt/christ
export async function fetchTitle({username, languageId, path}) {
  let title;
  const repository = resourceRepository({languageId});
  const _path = path.split('/').splice(1).join('/') + '.md';
  const markdown = await ApplicationHelpers.fetchFileFromServer({username, repository, path: _path});
  if (markdown) {
    title = markdown.split(/\n/)[0].replace(/#/g, '').trim();
  }
  return title;
};

export async function fetchArticle({username, languageId, path}) {
  let article;
  const repository = resourceRepository({languageId});
  const _path = path.split('/').filter(word => word !== 'dict').join('/') + '.md';
  const _article = await ApplicationHelpers.fetchFileFromServer({username, repository, path: _path});
  if (_article) {
    const prefix = _path.split('/').splice(0,1).join('/');
    article = _article
    .split('../').join(`http://${languageId}/tw/${prefix}/`)
    .split('.md').join('')
    .split('rc://').join('http://');
  }
  return article;
};
