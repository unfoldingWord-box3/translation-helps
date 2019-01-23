import Path from 'path';
import * as ApplicationHelpers from '../../../../../../helpers';

const username = 'unfoldingword';
const languageId = 'en'
const repositories = ApplicationHelpers.resourceRepositories({languageId});

export const parseSenses = ({lexiconMarkdown}) => {
  let senses = [];
  const sensesSection = lexiconMarkdown.split(/##\s*Senses/)[1];
  const senseSections = sensesSection.split(/###\s*Sense/).splice(1);
  senseSections.forEach(senseSection => {
    const definitionRegexp = /####\s*Definitions?.*?[\n\s]+(.*?)\n/;
    const glossRegexp = /####\s*Glosse?s?.*?[\n\s]+(.*?)\n/;
    let definition = definitionRegexp.test(senseSection) ? definitionRegexp.exec(senseSection)[1] : null;
    definition = (!/#/.test(definition)) ? definition : null;
    let gloss = glossRegexp.test(senseSection) ? glossRegexp.exec(senseSection)[1] : null;
    gloss = (!/#/.test(gloss)) ? gloss : null;
    const sense = {
      definition: definition,
      gloss: gloss,
    };
    senses.push(sense);
  });
  const uniqueSenses = unique({array: senses});
  return uniqueSenses;
};

export const senses = ({strong}) => new Promise((resolve, reject) => {
  let repository, path;
  if (/H\d+/.test(strong)) {
    repository = repositories.uhal;
    const _strong = strong.match(/H\d+/)[0];
    path = Path.join('content', _strong + '.md');
  }
  if (/G\d+/.test(strong)) {
    repository = repositories.ugl;
    path = Path.join('content', strong, '01.md');
  }
  if (repository && path) {
    ApplicationHelpers.fetchFileFromServer({username, repository, path})
    .then(lexiconMarkdown => {
      const senses = parseSenses({lexiconMarkdown});
      resolve(senses);
    }).catch(reject);
  } else {
    reject(`Could not find sense info for: ${strong}`)
  }
});

export const unique = ({array, response=[]}) => {
  let _array = array;
  array.forEach(object => {
    _array = _array.filter(_object =>
      !(object.gloss === _object.gloss && object.definition === _object.definition)
    );
    _array.push(object);
  });
  return _array;
}
