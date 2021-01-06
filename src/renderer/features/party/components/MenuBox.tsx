import React, { ReactElement } from 'react';
import clsx from 'clsx';
import {
  Box,
  createStyles,
  IconButton,
  makeStyles,
  Paper,
  Theme,
  Typography,
} from '@material-ui/core';
import { Cancel } from '@material-ui/icons';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    box: {
      position: 'relative',
      width: '350px',
      height: '200px',
      padding: theme.spacing(2, 4, 3),
      margin: '15px',
    },
    closeButton: {
      position: 'absolute',
      top: 8,
      right: 8,
    },
    title: {
      fontWeight: 800,
      color: theme.palette.info.main,
      textOverflow: 'ellipsis',
    },
    boxAmount: {
      position: 'absolute',
      bottom: 20,
      right: 20,
    },
    amountText: {
      fontSize: 16,
      fontWeight: 600,
      color: theme.palette.primary.main,
    },
  }),
);

export const MenuBox = (): ReactElement => {
  const classes = useStyles();

  return (
    <Paper className={clsx(classes.box)} elevation={2}>
      <IconButton
        color="secondary"
        size="small"
        className={classes.closeButton}
      >
        <Cancel />
      </IconButton>
      <Typography variant="h6" gutterBottom className={classes.title}>
        Thuc don chinh
      </Typography>

      <Box display="flex" flexDirection="row" alignItems="center">
        <Typography variant="subtitle1">18 mon</Typography>
        <span style={{ margin: '0px 15px' }}>•</span>
        <Typography variant="subtitle1">1.500.000$</Typography>
      </Box>

      <Box
        display="flex"
        flexDirection="row"
        justifyContent="flex-end"
        mt="30px"
        className={classes.boxAmount}
      >
        <span className={classes.amountText}>So luong: 40 mam</span>
      </Box>
    </Paper>
  );
};
