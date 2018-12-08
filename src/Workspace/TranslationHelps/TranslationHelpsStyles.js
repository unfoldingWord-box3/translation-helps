export const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: '100%',
  },
  width: {
    width: '100%',
  },
  appBar: {
    width: '95%',
    zIndex: '10',
    margin: 'auto',
  },
  hidden: {
    height: '0px',
  },
  padding: {
    padding: `0 ${theme.spacing.unit * 2}px`,
  },
  tabContent: {
    padding: `0 ${theme.spacing.unit * 3}px`,
  }
});

export default styles;
