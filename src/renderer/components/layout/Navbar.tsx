import React, { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import clsx from 'clsx';
import {
  IconButton,
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import {
  ChevronLeft,
  ShoppingCart,
  Fastfood,
  Home as HomeIcon,
} from '@material-ui/icons';
import { DRAWER_WIDTH } from '../../constants/AppConst';

import { toggleNavbar } from './NavbarSlice';
import { AppState } from '../../store/store';

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
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: DRAWER_WIDTH,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
}));

export const Navbar = (): ReactElement => {
  const classes = useStyles();

  const open = useSelector((state: AppState) => state.navbar);

  const dispatch = useDispatch();

  const handleCloseNavbar = (): void => {
    const action = toggleNavbar(false);
    dispatch(action);
  };

  return (
    <Drawer
      variant="permanent"
      classes={{
        paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
      }}
      open={open}
    >
      <div className={classes.toolbarIcon}>
        <IconButton onClick={handleCloseNavbar}>
          <ChevronLeft />
        </IconButton>
      </div>
      <Divider />
      <List>{mainListItems}</List>
    </Drawer>
  );
};

export const mainListItems = (
  <div>
    <Link to={'/'}>
      <ListItem button>
        <ListItemIcon>
          <HomeIcon />
        </ListItemIcon>
        <ListItemText primary="Trang chủ" />
      </ListItem>
    </Link>
    <Link to={'/party'}>
      <ListItem button>
        <ListItemIcon>
          <ShoppingCart />
        </ListItemIcon>
        <ListItemText primary="Tạo tiệc" />
      </ListItem>
    </Link>
    <Link to={'/dishes'}>
      <ListItem button>
        <ListItemIcon>
          <Fastfood />
        </ListItemIcon>
        <ListItemText primary="Quản lý món" />
      </ListItem>
    </Link>
    <Link to={'/items'}>
      <ListItem button>
        <ListItemIcon>
          <Fastfood />
        </ListItemIcon>
        <ListItemText primary="Quản lý nguyên liệu" />
      </ListItem>
    </Link>
    <Link to={'/tools'}>
      <ListItem button>
        <ListItemIcon>
          <Fastfood />
        </ListItemIcon>
        <ListItemText primary="Quản lý dụng cụ" />
      </ListItem>
    </Link>
  </div>
);
