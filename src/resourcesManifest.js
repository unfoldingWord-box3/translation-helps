const resources = ({languageId}) => ({
  scripture: {
    primary: {
      text: languageId + '_irv',
      notes: languageId + '-tn',
      words: languageId + '-tw',
      questions: languageId + '-tq',
    },
    secondary: [
      {
        text: languageId + '_ust',
      }
    ],
    oldTestamentOriginal: {
      text: 'UHB',
      lexicon: languageId + '_uhal',
    },
    newTestamentOriginal: {
      text: 'UGNT',
      lexicon: languageId + '_ugl',
    },
  },
  obs: {
    primary: {
      text: languageId + '_obs',
      notes: languageId + '_obs-tn',
      words: languageId + '_obs-tw',
      questions: languageId + '_obs-tq',
      studyNotes: languageId + '_obs-sn',
      studyQuestions: languageId + '_obs-sq',
    },
  },
});

export default resources;
