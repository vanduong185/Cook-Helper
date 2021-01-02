import React, { ReactElement } from 'react';
import clsx from 'clsx';
import { AppBar as MUIAppBar, Toolbar, IconButton } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Menu } from '@material-ui/icons';
import { DRAWER_WIDTH } from '../../constants/AppConst';

const useStyles = makeStyles((theme: Theme) => ({
  toolbar: {
    paddingRight: 24,
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: DRAWER_WIDTH,
    width: `calc(100% - ${DRAWER_WIDTH}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
}));

export const AppBar = (): ReactElement => {
  const classes = useStyles();

  const open = true;

  return (
    <MUIAppBar
      position="absolute"
      className={clsx(classes.appBar, open && classes.appBarShift)}
    >
      <Toolbar className={classes.toolbar}>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open drawer"
          className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
        >
          <Menu />
        </IconButton>
      </Toolbar>
    </MUIAppBar>
  );
};
