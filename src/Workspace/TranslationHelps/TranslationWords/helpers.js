import * as ApplicationHelpers from '../../../ApplicationHelpers';

const username = ApplicationHelpers.username;
const repository = (languageId) => ApplicationHelpers.resourceRepositories(languageId).tw;
// https://git.door43.org/[username]/[languageId]_ta/src/branch/master/bible/kt/abomination.md
// title = first line of file
// markdown = the path + .md
// rc://en/tw/dict/bible/kt/christ
export const fetchTitle = (languageId, linkPath) => new Promise((resolve, reject) => {
  const uriPath = linkPath.split('/').splice(1).join('/') + '.md';
  ApplicationHelpers.fetchFileFromServer(username, repository(languageId), uriPath)
  .then(markdown => {
    const title = markdown.split(/\n/)[0].replace(/#/g, '').trim();
    resolve(title);
  }).catch(reject);
});

export const fetchArticle = (languageId, linkPath) => new Promise((resolve, reject) => {
  const uriPath = linkPath.split('/').splice(1).join('/') + '.md'; // remove "/dict/"
  ApplicationHelpers.fetchFileFromServer(username, repository(languageId), uriPath)
  .then(article => {
    const prefix = linkPath.split('/').splice(0,2).join('/');
    article = article.split('../').join(`http://${languageId}/tw/${prefix}/`)
      .split('.md').join('').split('rc://').join('http://');
    resolve(article);
  }).catch(reject);
});
