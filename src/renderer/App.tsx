import React, { ReactElement } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';
import { HashRouter } from 'react-router-dom';
import { AppBar } from './components/layout/AppBar';
import { Navbar } from './components/layout/Navbar';
import { AppRouter } from './components/layout/AppRouter';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
  },
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
    paddingTop: '65px',
    paddingBottom: '65px',
  },
}));

export const App = (): ReactElement => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <HashRouter>
        <CssBaseline />
        <AppBar></AppBar>
        <Navbar></Navbar>
        <main className={classes.content}>
          <AppRouter></AppRouter>
        </main>
      </HashRouter>
    </div>
  );
};
