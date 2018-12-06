import * as TranslationAcademyHelpers from './TranslationAcademy/helpers';
import * as TranslationWordsHelpers from './TranslationWords/helpers';

export const fetchTitle = (languageId, resourceId, linkPath) => new Promise((resolve, reject) => {
  switch (resourceId) {
    case 'ta':
      TranslationAcademyHelpers.fetchTitle(languageId, linkPath)
      .then(resolve).catch(error => console.log(error));
      break;
    case 'tw':
      TranslationWordsHelpers.fetchTitle(languageId, linkPath)
      .then(resolve).catch(error => console.log(error));
      break;
    default:
      const message = `resourceId not configured: ${languageId} - ${resourceId} - ${linkPath}`;
      console.log(message);
      break;
  };
});

export const fetchArticle = (languageId, resourceId, linkPath) => new Promise((resolve, reject) => {
  switch (resourceId) {
    case 'ta':
      TranslationAcademyHelpers.fetchArticle(languageId, linkPath)
      .then(resolve).catch(error => console.log(error));
      break;
    case 'tw':
      TranslationWordsHelpers.fetchArticle(languageId, linkPath)
      .then(resolve).catch(error => console.log(error));
      break;
    default:
      const message = `resourceId not configured: ${languageId} - ${resourceId} - ${linkPath}`;
      console.log(message);
      break;
  };
});
