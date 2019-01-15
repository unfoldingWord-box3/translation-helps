import * as TranslationAcademyHelpers from './TranslationAcademy/helpers';
import * as TranslationWordsHelpers from './TranslationWords/helpers';

export const fetchTitle = (username, languageId, resourceId, linkPath) => new Promise((resolve, reject) => {
  switch (resourceId) {
    case 'ta':
      TranslationAcademyHelpers.fetchTitle(username, languageId, linkPath)
      .then(resolve).catch(error => console.log(error));
      break;
    case 'tw':
      TranslationWordsHelpers.fetchTitle(username, languageId, linkPath)
      .then(resolve).catch(error => console.log(error));
      break;
    case 'tn':
      break;
    default:
      const message = `resourceId not configured: ${languageId} - ${resourceId} - ${linkPath}`;
      console.log(message);
      break;
  };
});

export const fetchArticle = (username, languageId, resourceId, linkPath) => new Promise((resolve, reject) => {
  switch (resourceId) {
    case 'ta':
      TranslationAcademyHelpers.fetchArticle(username, languageId, linkPath)
      .then(resolve).catch(error => console.log(error));
      break;
    case 'tw':
      TranslationWordsHelpers.fetchArticle(username, languageId, linkPath)
      .then(resolve).catch(error => console.log(error));
      break;
    case 'tn':
      break;
    default:
      const message = `resourceId not configured: ${languageId} - ${resourceId} - ${linkPath}`;
      console.log(message);
      break;
  };
});
