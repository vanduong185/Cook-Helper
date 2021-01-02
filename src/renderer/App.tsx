import React, { ReactElement } from 'react';
import clsx from 'clsx';
import { makeStyles, Theme } from '@material-ui/core/styles';
import {
  CssBaseline,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import {
  Menu,
  ChevronLeft,
  Dashboard,
  ShoppingCart,
  People,
  BarChart,
  Layers,
  Home as HomeIcon,
  Fastfood,
} from '@material-ui/icons';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import { Home } from './pages/Home';
import { ItemManager } from './pages/ItemManager';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
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
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
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
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
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
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
    paddingTop: '65px',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
}));

export const App = (): ReactElement => {
  const classes = useStyles();

  const [open, setOpen] = React.useState(true);
  const handleDrawerOpen = (): void => {
    setOpen(true);
  };
  const handleDrawerClose = (): void => {
    setOpen(false);
  };

  return (
    <div className={classes.root}>
      <Router>
        <CssBaseline />
        <AppBar
          position="absolute"
          className={clsx(classes.appBar, open && classes.appBarShift)}
        >
          <Toolbar className={classes.toolbar}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              className={clsx(
                classes.menuButton,
                open && classes.menuButtonHidden,
              )}
            >
              <Menu />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          classes={{
            paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
          }}
          open={open}
        >
          <div className={classes.toolbarIcon}>
            <IconButton onClick={handleDrawerClose}>
              <ChevronLeft />
            </IconButton>
          </div>
          <Divider />
          <List>{mainListItems}</List>
        </Drawer>
        <main className={classes.content}>
          <Switch>
            <Route path="/main_window" exact component={Home} />
            <Route path="/item-manager" exact component={ItemManager} />
          </Switch>
        </main>
      </Router>
    </div>
  );
};

export const mainListItems = (
  <div>
    <Link to={'/main_window'}>
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
    <ListItem button>
      <ListItemIcon>
        <Fastfood />
      </ListItemIcon>
      <ListItemText primary="Quản lý nguyên liệu" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <BarChart />
      </ListItemIcon>
      <ListItemText primary="Reports" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <Layers />
      </ListItemIcon>
      <ListItemText primary="Integrations" />
    </ListItem>
  </div>
);
