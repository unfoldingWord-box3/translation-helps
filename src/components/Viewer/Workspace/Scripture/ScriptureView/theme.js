import { createMuiTheme } from '@material-ui/core/styles';

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
        backgroundColor: '#FFF',
      }
    },
    MuiTableCell: {
      root: {
        padding: '0 8px 0 8px',
      }
    },
    MUIDataTableHeadCell: {
      fixedHeader: {
        zIndex: 'unset',
      }
    },
    MUIDataTable: {
      responsiveScroll: {
        maxHeight: 'unset',
      }
    },
    MuiTableRow: {
      root: {
        height: 'unset',
      }
    },
  }
});

export default getMuiTheme;
