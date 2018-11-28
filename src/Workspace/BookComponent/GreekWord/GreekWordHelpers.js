import path from 'path';
import * as ApplicationHelpers from '../../../ApplicationHelpers';

const username = 'unfoldingword';
const languageId = 'en'
const repository = ApplicationHelpers.resourceRepositories(languageId).ugl;

export const parseSenses = (lexiconMarkdown) => {
  let senses = [];
  const sensesSection = lexiconMarkdown.split(/##\s*Senses/)[1];
  const senseSections = sensesSection.split(/###\s*Sense/).splice(1);
  senseSections.forEach(senseSection => {
    const definitionRegexp = /####\s*Definitions?.*?[\n\s]+(.*?)\n/;
    const glossRegexp = /####\s*Glosse?s?.*?[\n\s]+(.*?)\n/;
    let definition = definitionRegexp.exec(senseSection)[1];
    definition = (!/#/.test(definition)) ? definition : null;
    let gloss = glossRegexp.exec(senseSection)[1];
    gloss = (!/#/.test(gloss)) ? gloss : null;
    const sense = {
      definition: definition,
      gloss: gloss,
    };
    senses.push(sense);
  });
  return senses;
};

export const senses = (strong) => new Promise((resolve, reject) => {
  const filepath = path.join('content', strong, '01.md');
  ApplicationHelpers.fetchFileFromServer(username, repository, filepath)
  .then(markdown => {
    const senses = parseSenses(markdown);
    resolve(senses);
  }).catch(reject);
});
