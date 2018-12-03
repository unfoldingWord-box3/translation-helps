import * as ApplicationHelpers from '../../../ApplicationHelpers';

const username = ApplicationHelpers.username;
const repository = (languageId) => ApplicationHelpers.resourceRepositories(languageId).ta;
// https://git.door43.org/[username]/[languageId]_ta/src/branch/master/translate/figs-metaphor
// title = title.md
// markdown = 01.md
export const fetchTitle = (languageId, linkPath) => new Promise((resolve, reject) => {
  const uriPath = linkPath.split('/').splice(1).join('/') + '/title.md';
  ApplicationHelpers.fetchFileFromServer(username, repository(languageId), uriPath)
  .then(resolve).catch(reject);
});

export const fetchArticle = (languageId, linkPath) => new Promise((resolve, reject) => {
  const uriPath = linkPath.split('/').splice(1).join('/') + '/01.md';
  ApplicationHelpers.fetchFileFromServer(username, repository(languageId), uriPath)
  .then(article => {
    const prefix = linkPath.split('/').splice(0,2).join('/');
    article = article.split('../').join(`http://${languageId}/ta/${prefix}/`)
      .split('/01.md').join('').split('rc://').join('http://');
    resolve(article);
  }).catch(reject);
});
