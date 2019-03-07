import React, {useContext} from 'react';
import MUIDataTable from "mui-datatables";
import { MuiThemeProvider } from '@material-ui/core/styles';
import {
} from '@material-ui/core';

import getMuiTheme from './theme';

import {ResourcesContext} from '../Resources.context';

export const AlignmentsTable = () => {
  const {
    resources: {
      tn,
    },
  } = useContext(ResourcesContext);
  const columns = [
    {
      name: "C:V",
      options: {
        filter: false,
        sort: true,
      }
    },
    {
      name: "ID",
      options: {
       filter: false,
       sort: true,
       display: 'false',
      }
    },
    {
      name: "Type",
      options: {
       filter: true,
       sort: true,
      }
    },
    {
      name: "Original",
      options: {
       filter: false,
       sort: true,
      }
    },
    {
      name: "Occurrence",
      options: {
       filter: false,
       sort: true,
       display: 'false',
      }
    },
    {
      name: "Gateway",
      options: {
       filter: false,
       sort: true,
      }
    },
    {
      name: "Note",
      options: {
       filter: false,
       sort: true,
       display: 'false',
       customBodyRender: (value, tableMeta, updateValue) => {
         const maxNoteLength = 100;
         const note = (value.length <= (maxNoteLength - 3)) ? value :
           value.substring(0,maxNoteLength) + '...';
         return (
           <div>
            {note}
           </div>
         );
        },
      }
    },
  ];

  let data = [];
  if (tn.rows) {
    const rows = tn.rows.slice(0);
    rows.shift();
    rows.pop();
    data = rows.map(row => {
      const [book, chapter, verse, id, supportReference, origQuote, occurrence, glQuote, note] = row;
      if (book) {/* book not used, this bypasses linter warning */}
      const type = (!supportReference) ? 'general' : supportReference;
      return [
        `${chapter}:${verse}`,
        id,
        type,
        origQuote,
        occurrence,
        glQuote,
        note,
      ];
    });
  }

  const options = {
    filterType: 'checkbox',
    selectableRows: false,
    responsive: 'scroll',
    download: false,
    print: false,
    filter: true,
    viewColumns: true,
  };

  return (
    <MuiThemeProvider theme={getMuiTheme()}>
      <MUIDataTable
        title={"Search translationNotes"}
        data={data}
        columns={columns}
        options={options}
      />
    </MuiThemeProvider>
  );
};

export default AlignmentsTable;
