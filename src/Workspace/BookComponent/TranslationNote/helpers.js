import * as TranslationAcademyHelpers from '../TranslationAcademy/helpers';
import * as TranslationWordsHelpers from '../TranslationWords/helpers';

export const fetchTitle = (languageId, resourceId, linkPath) => new Promise((resolve, reject) => {
  switch (resourceId) {
    case 'ta':
      TranslationAcademyHelpers.fetchTitle(languageId, linkPath).then(resolve)
      break;
    case 'tw':
      TranslationWordsHelpers.fetchTitle(languageId, linkPath).then(resolve);
      break;
    default:
      reject('resourceId not configured: ' + resourceId);
      break;
  };
});

export const fetchArticle = (languageId, resourceId, linkPath) => new Promise((resolve, reject) => {
  switch (resourceId) {
    case 'ta':
      TranslationAcademyHelpers.fetchArticle(languageId, linkPath).then(resolve);
      break;
    case 'tw':
      TranslationWordsHelpers.fetchArticle(languageId, linkPath).then(resolve);
      break;
    default:
      reject('resourceId not configured: ' + resourceId);
      break;
  };
});
