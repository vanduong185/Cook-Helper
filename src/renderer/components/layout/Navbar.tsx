import React, { ReactElement, useState } from 'react';
import { useHistory } from 'react-router-dom';
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
  MenuBook,
  Fastfood,
  Restaurant,
  Apps,
  Home,
} from '@material-ui/icons';
import { DRAWER_WIDTH } from '../../constants/AppConst';
import { toggleNavbar } from './NavbarSlice';
import { AppState } from '../../store/store';

interface NavItemData {
  title: string;
  link: string;
  icon: ReactElement;
}

const navItemsData: NavItemData[] = [
  {
    title: 'Trang chủ',
    link: '/',
    icon: <Home />,
  },
  {
    title: 'Tạo tiệc',
    link: '/party',
    icon: <MenuBook />,
  },
  {
    title: 'Quản lý món',
    link: '/dishes',
    icon: <Fastfood />,
  },
  {
    title: 'Quản lý nguyên liệu',
    link: '/items',
    icon: <Apps />,
  },
  {
    title: 'Quản lý dụng cụ',
    link: '/tools',
    icon: <Restaurant />,
  },
];

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
  navItemText: {
    color: theme.palette.grey[800],
    fontWeight: 800,
  },
  activeNavItem: {
    backgroundColor: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
    },
  },
  activeNavItemText: {
    color: 'white',
  },
}));

export const Navbar = (): ReactElement => {
  const classes = useStyles();
  const history = useHistory();
  const open = useSelector((state: AppState) => state.navbar);
  const dispatch = useDispatch();
  const [activeNavLink, setActiveNavLink] = useState<string>('/');

  const handleCloseNavbar = (): void => {
    const action = toggleNavbar(false);
    dispatch(action);
  };

  const handleNavItemClick = (link: string): void => {
    setActiveNavLink(link);
    history.push(link);
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
      <List style={{ padding: '0px' }}>
        {navItemsData.map(
          (navItem, index): ReactElement => (
            <ListItem
              key={index}
              button
              onClick={(): void => {
                handleNavItemClick(navItem.link);
              }}
              className={
                activeNavLink === navItem.link
                  ? classes.activeNavItem
                  : undefined
              }
            >
              <ListItemIcon
                className={
                  activeNavLink === navItem.link
                    ? classes.activeNavItemText
                    : undefined
                }
              >
                {navItem.icon}
              </ListItemIcon>
              <ListItemText>
                <span
                  className={clsx(
                    classes.navItemText,
                    activeNavLink === navItem.link
                      ? classes.activeNavItemText
                      : undefined,
                  )}
                >
                  {navItem.title}
                </span>
              </ListItemText>
            </ListItem>
          ),
        )}
      </List>
    </Drawer>
  );
};
