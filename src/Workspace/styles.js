export const styles = theme => ({
  root: {
  },
  paper: {
    padding: theme.spacing.unit * 2,
  },
  column: {
    maxWidth: '40em',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  verse: {
    margin: 0,
  },
  originalVerse: {
    margin: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
  },
  fullWidth: {
    width: '100%'
  },
  expansionPanelDetails: {
    padding: 0,
  },
  expansionPanelActions: {
    padding: 0,
  },
});

export default styles;
