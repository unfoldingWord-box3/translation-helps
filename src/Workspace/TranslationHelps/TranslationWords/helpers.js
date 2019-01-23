import * as ApplicationHelpers from '../../../helpers';

const resourceRepository = ({languageId}) => ApplicationHelpers.resourceRepositories({languageId}).tw;
// https://git.door43.org/[username]/[languageId]_ta/src/branch/master/bible/kt/abomination.md
// title = first line of file
// markdown = the path + .md
// rc://en/tw/dict/bible/kt/christ
export const fetchTitle = ({username, languageId, path}) => new Promise((resolve, reject) => {
  const repository = resourceRepository({languageId});
  const _path = path.split('/').splice(1).join('/') + '.md';
  ApplicationHelpers.fetchFileFromServer({username, repository, path: _path})
  .then(markdown => {
    const title = markdown.split(/\n/)[0].replace(/#/g, '').trim();
    resolve(title);
  }).catch(reject);
});

export const fetchArticle = ({username, languageId, path}) => new Promise((resolve, reject) => {
  const repository = resourceRepository({languageId});
  const _path = path.split('/').splice(1).join('/') + '.md'; // remove "/dict/"
  ApplicationHelpers.fetchFileFromServer({username, repository, path: _path})
  .then(article => {
    const prefix = _path.split('/').splice(0,2).join('/');
    article = article.split('../').join(`http://${languageId}/tw/${prefix}/`)
      .split('.md').join('').split('rc://').join('http://');
    resolve(article);
  }).catch(reject);
});
