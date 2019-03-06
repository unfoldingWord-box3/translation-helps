import React from 'react';
import PropTypes from 'prop-types';
import MUIDataTable from "mui-datatables";
import { MuiThemeProvider } from '@material-ui/core/styles';
import {
} from '@material-ui/core';

import getMuiTheme from './theme';

export const VerseCountTable = ({
  columns,
  data,
}) => {
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

VerseCountTable.propTypes = {
  tn: PropTypes.array.isRequired,
};

export default VerseCountTable;
