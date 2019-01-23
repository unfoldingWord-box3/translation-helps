import * as ApplicationHelpers from '../../../helpers';

const resourceRepository = ({languageId}) => ApplicationHelpers.resourceRepositories({languageId}).tw;
// https://git.door43.org/[username]/[languageId]_ta/src/branch/master/bible/kt/abomination.md
// title = first line of file
// markdown = the path + .md
// rc://en/tw/dict/bible/kt/christ
export async function fetchTitle({username, languageId, path}) {
  const repository = resourceRepository({languageId});
  const _path = path.split('/').splice(1).join('/') + '.md';
  const markdown = await ApplicationHelpers.fetchFileFromServer({username, repository, path: _path});
  const title = markdown.split(/\n/)[0].replace(/#/g, '').trim();
  return title;
};

export async function fetchArticle({username, languageId, path}) {
  let article;
  const repository = resourceRepository({languageId});
  const _path = path.split('/').filter(word => word !== 'dict').join('/') + '.md';
  try {
    const _article = await ApplicationHelpers.fetchFileFromServer({username, repository, path: _path});
    const prefix = _path.split('/').splice(0,1).join('/');
    article = _article
    .split('../').join(`http://${languageId}/tw/${prefix}/`)
    .split('.md').join('')
    .split('rc://').join('http://');
  } catch {
    debugger
  }
  return article;
};
