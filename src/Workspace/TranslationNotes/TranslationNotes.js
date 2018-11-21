import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
} from '@material-ui/core';
import {
} from '@material-ui/icons';
import MUIDataTable from "mui-datatables";

export const TranslationNotes = ({classes, columns, data}) => {
  const options = {
    filter: false,
    responsive: 'scroll',
    rowsPerPageOptions: [10,20,50,100],
    onRowClick: (rowData,rowMeta) => {
      // const id = coins[rowMeta.dataIndex].id;
    },
  };

  return (
    <MUIDataTable
      className={classes.root}
      title={"translationNotes"}
      columns={columns}
      data={data}
      options={options}
    />
  );
};

TranslationNotes.propTypes = {
  classes: PropTypes.object.isRequired,
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
};

const styles = theme => ({
  root: {
    width: '100%',
  },
});

export default withStyles(styles)(TranslationNotes);
