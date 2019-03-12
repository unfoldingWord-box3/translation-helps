import * as TranslationAcademyHelpers from './TranslationAcademy/helpers';
import * as TranslationWordsHelpers from './TranslationWords/helpers';

export async function fetchTitle({username, languageId, resourceId, path}) {
  let title;
  switch (resourceId) {
    case 'ta':
      title = await TranslationAcademyHelpers.fetchTitle({username, languageId, path});
      break;
    case 'tw':
      title = await TranslationWordsHelpers.fetchTitle({username, languageId, path});
      break;
    case 'tn':
      break;
    default:
      console.log(`resourceId not configured: ${languageId} - ${resourceId} - ${path}`);
      break;
  };
  return title;
};

export async function fetchArticle({username, languageId, resourceId, path}) {
  let article;
  switch (resourceId) {
    case 'ta':
      article = await TranslationAcademyHelpers.fetchArticle({username, languageId, path})
      break;
    case 'tw':
      article = await TranslationWordsHelpers.fetchArticle({username, languageId, path})
      break;
    case 'tn':
      break;
    default:
      console.log(`resourceId not configured: ${languageId} - ${resourceId} - ${path}`);
      break;
  };
  return article;
};
