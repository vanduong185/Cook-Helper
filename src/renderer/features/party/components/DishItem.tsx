import React, { ReactElement } from 'react';
import {
  Box,
  createStyles,
  IconButton,
  makeStyles,
  Theme,
} from '@material-ui/core';
import { Cancel } from '@material-ui/icons';
import clsx from 'clsx';
import { DishDTO } from '../../../dto/DishDTO';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    textBold: {
      fontSize: 16,
      fontWeight: 600,
    },
    titleSpan: {
      width: 270,
      color: theme.palette.info.main,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
  }),
);

interface Props {
  dish: DishDTO;
  onRemove?: () => void;
}

export const DishItem = (props: Props): ReactElement => {
  const classes = useStyles();

  return (
    <Box
      width="300px"
      height="40px"
      border={1}
      borderColor="grey.400"
      borderRadius="20px"
      m="5px"
      px="10px"
      display="flex"
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
    >
      <span className={clsx(classes.textBold, classes.titleSpan)}>
        {props.dish.name}
      </span>
      <IconButton color="secondary" size="small" onClick={props.onRemove}>
        <Cancel></Cancel>
      </IconButton>
    </Box>
  );
};
