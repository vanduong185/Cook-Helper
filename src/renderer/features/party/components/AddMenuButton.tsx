import React, { ReactElement } from 'react';
import clsx from 'clsx';
import {
  Box,
  createStyles,
  IconButton,
  makeStyles,
  Theme,
} from '@material-ui/core';
import { Cancel } from '@material-ui/icons';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    box: {
      position: 'relative',
      width: '350px',
      height: '200px',
      padding: theme.spacing(2, 4, 3),
      borderWidth: 5,
      borderStyle: 'dashed',
      borderColor: '#2196f36b',
    },
  }),
);

export const AddMenuButton = (): ReactElement => {
  const classes = useStyles();

  return (
    <Box
      className={classes.box}
      m="15px"
      display="flex"
      justifyContent="center"
    >
      <IconButton></IconButton>
    </Box>
  );
};
