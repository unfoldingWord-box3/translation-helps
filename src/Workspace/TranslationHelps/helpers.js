import * as TranslationAcademyHelpers from './TranslationAcademy/helpers';
import * as TranslationWordsHelpers from './TranslationWords/helpers';

export const fetchTitle = ({username, languageId, resourceId, path}) => new Promise((resolve, reject) => {
  switch (resourceId) {
    case 'ta':
      TranslationAcademyHelpers.fetchTitle({username, languageId, path})
      .then(resolve).catch(error => console.log(error));
      break;
    case 'tw':
      TranslationWordsHelpers.fetchTitle({username, languageId, path})
      .then(resolve).catch(error => console.log(error));
      break;
    case 'tn':
      break;
    default:
      const message = `resourceId not configured: ${languageId} - ${resourceId} - ${path}`;
      console.log(message);
      break;
  };
});

export const fetchArticle = ({username, languageId, resourceId, path}) => new Promise((resolve, reject) => {
  switch (resourceId) {
    case 'ta':
      TranslationAcademyHelpers.fetchArticle({username, languageId, path})
      .then(resolve).catch(error => console.log(error));
      break;
    case 'tw':
      TranslationWordsHelpers.fetchArticle({username, languageId, path})
      .then(resolve).catch(error => console.log(error));
      break;
    case 'tn':
      break;
    default:
      const message = `resourceId not configured: ${languageId} - ${resourceId} - ${path}`;
      console.log(message);
      break;
  };
});
