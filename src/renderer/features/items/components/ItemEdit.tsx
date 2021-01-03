import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import {
  Paper,
  TextField,
  Divider,
  Box,
  MenuItem,
  Button,
} from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { addItem } from '../ItemSlice';
import { ItemDTO } from '../../../dto/ItemDTO';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      width: '750px',
      height: '500px',
      padding: theme.spacing(2, 4, 3),
      overflow: 'auto',
    },
  }),
);

export const ItemEdit = React.forwardRef((props, ref) => {
  const classes = useStyles();

  const dispatch = useDispatch();

  console.log('init');

  const initItem: ItemDTO = {
    id: undefined,
    name: '',
    provider: '',
    unit: {
      id: 1,
      name: undefined,
    },
  };

  const [item, setItem] = React.useState<ItemDTO>(initItem);

  const createItem = (): void => {
    dispatch(addItem(item));
  };

  return (
    <Paper className={classes.paper} ref={ref}>
      <h1>Thêm nguyên liệu mới</h1>
      <Divider></Divider>
      <Box my="30px">
        <TextField
          required
          id="outlined-required"
          label="Tên nguyên liệu"
          placeholder="Nhập tên nguyên liệu"
          onChange={(event): void => {
            item.name = event.target.value;
            setItem(item);
          }}
          variant="outlined"
          style={{
            width: 350,
          }}
        />
      </Box>

      <Box my="30px">
        <TextField
          required
          id="outlined-required"
          label="Nguồn cung cấp"
          placeholder="Nhập nguồn cung cấp"
          onChange={(event): void => {
            item.provider = event.target.value;
            setItem(item);
          }}
          variant="outlined"
          style={{
            width: 350,
          }}
        />
      </Box>

      <Box my="30px">
        <TextField
          select
          required
          label="Đơn vị"
          variant="outlined"
          defaultValue={item.unit.id}
          onChange={(event): void => {
            console.log(event.target.value);
            item.unit.id = +event.target.value;
            setItem(item);
          }}
          style={{
            width: 350,
          }}
        >
          {units.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <Box mt="60px" display="flex" justifyContent="flex-end">
        <Button variant="contained" color="primary" onClick={createItem}>
          Thêm
        </Button>
      </Box>
    </Paper>
  );
});

const units = [
  {
    value: 1,
    label: 'gam',
  },
  {
    value: 2,
    label: 'kg',
  },
  {
    value: 3,
    label: 'ml',
  },
  {
    value: 4,
    label: 'lit',
  },
];
