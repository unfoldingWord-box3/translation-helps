import React from 'react';
import PropTypes from 'prop-types';
import MUIDataTable from "mui-datatables";
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

import * as helpers from './helpers';

const getMuiTheme = () => createMuiTheme({
  overrides: {
    MuiPaper: {
      elevation4: {
        boxShadow: 'none',
      },
      rounded: {
        borderRadius: 'unset',
      },
      root: {
        backgroundColor: 'unset',
      }
    },
    MuiTableCell: {
      root: {
        padding: "0 8px 0 8px",
      }
    },
    MuiTableRow: {
      root: {
        height: 'unset',
      }
    },
  }
});

export const AlignmentsTable = ({
  lemmaIndex,
}) => {
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
      const {originalTexts, targetTexts} = helpers.textFromVerseObject(alignment);
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
        title={"Find Original and Translated words"}
        data={data}
        columns={columns}
        options={options}
      />
    </MuiThemeProvider>
  );
};

AlignmentsTable.propTypes = {
  lemmaIndex: PropTypes.array.isRequired,
};

export default AlignmentsTable;
