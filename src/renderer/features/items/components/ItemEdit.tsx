import React, { ReactElement } from 'react';
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
import { addItem, updateItem } from '../ItemSlice';
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

interface Props {
  onClose: () => void;
  item?: ItemDTO;
  isEdit?: boolean;
}

export const ItemEdit = (props: Props): ReactElement => {
  const classes = useStyles();
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(getUnits());
  }, [dispatch]);

  const unitsData = useSelector((state: AppState) => state.units);

  const initItem: ItemDTO = props.item || {
    id: undefined,
    name: '',
    provider: '',
    unit: {
      id: undefined,
      name: undefined,
    },
  };

  const [item, setItem] = React.useState<ItemDTO>(initItem);

  const hanleCreateItem = (): void => {
    dispatch(addItem(item));
    props.onClose();
  };

  const handleUpdateItem = (): void => {
    dispatch(updateItem(item));
    props.onClose();
  };

  return (
    <Paper className={classes.paper}>
      <h1>{props.isEdit ? 'Sửa nguyên liệu' : 'Thêm nguyên liệu mới'}</h1>
      <Divider></Divider>
      <Box my="30px">
        <TextField
          required
          id="outlined-required"
          label="Tên nguyên liệu"
          defaultValue={item.name}
          placeholder="Nhập tên nguyên liệu"
          onChange={(event): void => {
            const tmpItem = {
              ...item,
              name: event.target.value,
            };
            setItem(tmpItem);
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
          defaultValue={item.provider}
          placeholder="Nhập nguồn cung cấp"
          onChange={(event): void => {
            const tmpItem = {
              ...item,
              provider: event.target.value,
            };
            setItem(tmpItem);
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
          value={item.unit.id || ''}
          onChange={(event): void => {
            const unitId = +event.target.value;
            const unit = unitsData.find((u) => u.id === unitId);
            const tmpItem = {
              ...item,
              unit,
            };
            setItem(tmpItem);
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
        <Button
          variant="contained"
          color="primary"
          onClick={props.isEdit ? handleUpdateItem : hanleCreateItem}
        >
          {props.isEdit ? 'Lưu' : 'Thêm'}
        </Button>
      </Box>
    </Paper>
  );
};
