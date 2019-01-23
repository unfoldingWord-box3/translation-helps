import * as ApplicationHelpers from '../../../helpers';

const resourceRepository = ({languageId}) => ApplicationHelpers.resourceRepositories({languageId}).ta;
// https://git.door43.org/[username]/[languageId]_ta/src/branch/master/translate/figs-metaphor
// title = title.md
// markdown = 01.md
export const fetchTitle = ({username, languageId, path}) => new Promise((resolve, reject) => {
  const repository = resourceRepository({languageId});
  const _path = path.split('/').splice(1).join('/') + '/title.md';
  ApplicationHelpers.fetchFileFromServer({username, repository, path: _path})
  .then(resolve).catch(reject);
});

export const fetchArticle = ({username, languageId, path}) => new Promise((resolve, reject) => {
  const repository = resourceRepository({languageId});
  const _path = path.split('/').splice(1).join('/') + '/01.md';
  ApplicationHelpers.fetchFileFromServer({username, repository, path: _path})
  .then(article => {
    const prefix = _path.split('/').splice(0,2).join('/');
    article = article.split('../').join(`http://${languageId}/ta/${prefix}/`)
      .split('/01.md').join('').split('rc://').join('http://');
    resolve(article);
  }).catch(reject);
});
