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
import { useDispatch, useSelector } from 'react-redux';
import { addItem } from '../ItemSlice';
import { ItemDTO } from '../../../dto/ItemDTO';
import { getUnits } from '../../units/UnitSlice';
import { AppState } from '../../../store/store';

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

  React.useEffect(() => {
    dispatch(getUnits());
  }, [dispatch]);

  const unitsData = useSelector((state: AppState) => state.units);

  const initItem: ItemDTO = {
    id: undefined,
    name: '',
    provider: '',
    unit: undefined,
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
          defaultValue={''}
          onChange={(event): void => {
            const unitId = +event.target.value;
            const unit = unitsData.find((u) => u.id === unitId);
            item.unit = unit;
            setItem(item);
          }}
          style={{
            width: 350,
          }}
        >
          {unitsData.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              {option.name}
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
