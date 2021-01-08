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
import { MenuDTO } from '../../../dto/MenuDTO';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    box: {
      position: 'relative',
      width: '350px',
      height: '200px',
      padding: theme.spacing(2, 4, 3),
      margin: '15px',
      '&:hover': {
        cursor: 'pointer',
      },
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

interface Props {
  menu: MenuDTO;
  onRemoveClick?: () => void;
  onClick?: () => void;
}

export const MenuBox = (props: Props): ReactElement => {
  const classes = useStyles();

  const getMenuPrice = (): number => {
    let totalPrice = 0;
    props.menu.dishes.forEach((dish) => {
      totalPrice += dish.cost;
    });

    return totalPrice;
  };

  return (
    <Paper className={clsx(classes.box)} elevation={2} onClick={props.onClick}>
      <IconButton
        color="secondary"
        size="small"
        className={classes.closeButton}
        onClick={(event): void => {
          event.stopPropagation();
          props.onRemoveClick();
        }}
      >
        <Cancel />
      </IconButton>
      <Typography variant="h6" gutterBottom className={classes.title}>
        {props.menu.name}
      </Typography>

      <Box display="flex" flexDirection="row" alignItems="center">
        <Typography variant="subtitle1">{`${props.menu.dishes.length} món`}</Typography>
        <span style={{ margin: '0px 15px' }}>•</span>
        <Typography variant="subtitle1">{`${getMenuPrice()}đ`}</Typography>
      </Box>

      <Box
        display="flex"
        flexDirection="row"
        justifyContent="flex-end"
        mt="30px"
        className={classes.boxAmount}
      >
        <span
          className={classes.amountText}
        >{`Số lượng: ${props.menu.setAmount} mâm`}</span>
      </Box>
    </Paper>
  );
};
