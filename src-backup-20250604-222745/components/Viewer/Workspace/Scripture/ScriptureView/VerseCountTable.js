import React, {useContext} from 'react';
import MUIDataTable from "mui-datatables";
import { MuiThemeProvider } from '@material-ui/core/styles';
import {
} from '@material-ui/core';

import getMuiTheme from './theme';

import {ResourcesContext} from '../Resources.context';

export const VerseCountTable = () => {
  let columns, data = [];
  const {
    contextLoaded,
    verseCountTableData,
    populateVerseCountTableData,
  } = useContext(ResourcesContext);
  if (contextLoaded.reference && !verseCountTableData) {
    populateVerseCountTableData();
  } else {
    columns = verseCountTableData.columns;
    data = verseCountTableData.data;
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
        title={"Verse Counts"}
        data={data}
        columns={columns}
        options={options}
      />
    </MuiThemeProvider>
  );
};

export default VerseCountTable;
