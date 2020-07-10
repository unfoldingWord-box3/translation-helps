import * as TranslationAcademyHelpers from './TranslationAcademy/helpers';
import * as TranslationWordsHelpers from './TranslationWords/helpers';

export async function fetchTitle({organization, languageId, resourceId, path}) {
  let title;
  switch (resourceId) {
    case 'ta':
      title = await TranslationAcademyHelpers.fetchTitle({organization, languageId, path});
      break;
    case 'tw':
      title = await TranslationWordsHelpers.fetchTitle({organization, languageId, path});
      break;
    case 'tn':
      break;
    default:
      console.log(`resourceId not configured: ${languageId} - ${resourceId} - ${path}`);
      break;
  };
  return title;
};

export async function fetchArticle({organization, languageId, resourceId, path}) {
  let article;
  switch (resourceId) {
    case 'ta':
      article = await TranslationAcademyHelpers.fetchArticle({organization, languageId, path})
      break;
    case 'tw':
      article = await TranslationWordsHelpers.fetchArticle({organization, languageId, path})
      break;
    case 'tn':
      break;
    default:
      console.log(`resourceId not configured: ${languageId} - ${resourceId} - ${path}`);
      break;
  };
  return article;
};
