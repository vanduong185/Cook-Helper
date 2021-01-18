import React, { ReactElement } from 'react';
import clsx from 'clsx';
import {
  Box,
  createStyles,
  IconButton,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';
import { AddCircle, Cancel } from '@material-ui/icons';

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
    addButton: {
      width: 100,
      height: 100,
      color: theme.palette.info.main,
    },
    addIcon: {
      width: 80,
      height: 80,
    },
    addText: {
      color: theme.palette.info.main,
      fontSize: 16,
      fontWeight: 600,
    },
  }),
);

interface Props {
  onClick: () => void;
}

export const AddMenuButton = (props: Props): ReactElement => {
  const classes = useStyles();

  return (
    <Box
      className={classes.box}
      m="15px"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <IconButton className={classes.addButton} onClick={props.onClick}>
        <AddCircle className={classes.addIcon}></AddCircle>
      </IconButton>
      <Typography variant="button" className={classes.addText}>
        THÊM THỰC ĐƠN
      </Typography>
    </Box>
  );
};
