import React, {useContext} from 'react';
import MUIDataTable from 'mui-datatables';
import { MuiThemeProvider } from '@material-ui/core/styles';

import * as helpers from './helpers';
import getMuiTheme from '../theme';

import {ResourcesContext} from '../../Resources.context';
import {LemmaIndexContext} from './LemmaIndex.context';

export const AlignmentsTable = () => {
  const {
    resources,
    contextLoaded,
    contextLoaded: {
      resourceId,
    }
  } = useContext(ResourcesContext);

  const {lemmaIndex, populateLemmaIndex} = useContext(LemmaIndexContext);
  if (!lemmaIndex && contextLoaded.reference && resources[resourceId]) {
    populateLemmaIndex({data: resources[resourceId].data});
  }

  const columns = [
    {
      name: "Strong's: Lemma",
      options: {
        filter: false,
        sort: true,
      }
    },
    {
      name: "UGNT",
      options: {
       filter: false,
       sort: true,
      }
    },
    {
      name: "ULT",
      options: {
       filter: false,
       sort: true,
      }
    },
    {
      name: "C:V",
      options: {
       filter: false,
       sort: true,
      }
    },
  ];

  let data = [];
  if (lemmaIndex) {
    Object.keys(lemmaIndex).forEach(lemma => {
      const lemmaRows = lemmaIndex[lemma].map(entry => {
        const {
          strong,
          alignment,
          reference: {
            chapter,
            verse,
          },
        } = entry;
        const {originalTexts, targetTexts} = helpers.textFromVerseObject({verseObject: alignment});
        const original = originalTexts.join(' ');
        const target = targetTexts.join(' ');
        const reference = `${chapter}:${verse}`;
        return [
          `${strong}: ${lemma}`,
          original,
          target,
          reference
        ];
      });
      data = data.concat(lemmaRows);
    });
  }

  const options = {
    filterType: 'checkbox',
    selectableRows: false,
    responsive: 'scroll',
    download: false,
    print: false,
    filter: false,
    viewColumns: false,
  };

  return (
    <MuiThemeProvider theme={getMuiTheme()}>
      <MUIDataTable
        title={"Search UGNT and ULT for this book"}
        data={data}
        columns={columns}
        options={options}
      />
    </MuiThemeProvider>
  );
};

export default AlignmentsTable;
