const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  appFrame: {
    zIndex: 1,
    position: 'relative',
    display: 'flex',
    width: '100%',
  },
  main: {
    width: '100%',
    minWidth: '20em',
  },
  workspace: {
    padding: '1em 1em 5.5em 1em',
  },
  bottomNav: {
    width: '100%',
    position: 'fixed',
    bottom: 0,
    zIndex: 10,
  }
});

export default styles;
