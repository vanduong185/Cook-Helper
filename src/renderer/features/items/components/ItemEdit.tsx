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
      height: '550px',
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
  const [errorTexts, setErrorTexts] = React.useState<ValidationErrorText>({
    nameField: undefined,
    providerField: undefined,
    unitField: undefined,
  });

  const initItem: ItemDTO = props.item || {
    id: undefined,
    name: undefined,
    provider: undefined,
    unit: undefined,
  };

  const [item, setItem] = React.useState<ItemDTO>(initItem);

  const hanleCreateItem = (): void => {
    const isValid = validateItemData();
    if (!isValid) {
      return;
    }

    dispatch(addItem(item));
    props.onClose();
  };

  const handleUpdateItem = (): void => {
    const isValid = validateItemData();
    if (!isValid) {
      return;
    }

    dispatch(updateItem(item));
    props.onClose();
  };

  const validateItemData = (): boolean => {
    const errorsTmp = { ...errorTexts };
    let isValid = true;

    if (!item.name || item.name.length <= 0) {
      errorsTmp.nameField = 'Không được để trống';
      isValid = false;
    }

    if (!item.provider || item.provider.length <= 0) {
      errorsTmp.providerField = 'Không được để trống';
      isValid = false;
    }

    if (!item.unit) {
      errorsTmp.unitField = 'Không được để trống';
      isValid = false;
    }

    if (!isValid) {
      setErrorTexts(errorsTmp);
    }

    return isValid;
  };

  const updateName = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const tmpItem: ItemDTO = {
      ...item,
      name: event.target.value,
    };
    setItem(tmpItem);

    const tmpErrorTexts: ValidationErrorText = {
      ...errorTexts,
      nameField: undefined,
    };
    setErrorTexts(tmpErrorTexts);
  };

  const updateProvider = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const tmpItem: ItemDTO = {
      ...item,
      provider: event.target.value,
    };
    setItem(tmpItem);

    const tmpErrorTexts: ValidationErrorText = {
      ...errorTexts,
      providerField: undefined,
    };
    setErrorTexts(tmpErrorTexts);
  };

  const updateUnit = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const unitId = +event.target.value;
    const unit = unitsData.find((u) => u.id === unitId);
    const tmpItem: ItemDTO = {
      ...item,
      unit,
    };
    setItem(tmpItem);

    const tmpErrorTexts: ValidationErrorText = {
      ...errorTexts,
      unitField: undefined,
    };
    setErrorTexts(tmpErrorTexts);
  };

  return (
    <Paper className={classes.paper}>
      <h1>{props.isEdit ? 'Sửa nguyên liệu' : 'Thêm nguyên liệu mới'}</h1>
      <Divider></Divider>
      <Box my="30px">
        <TextField
          required
          label="Tên nguyên liệu"
          defaultValue={item.name}
          placeholder="Nhập tên nguyên liệu"
          error={!!errorTexts.nameField}
          helperText={errorTexts.nameField}
          onChange={updateName}
          variant="outlined"
          style={{
            width: 350,
          }}
        />
      </Box>

      <Box my="30px">
        <TextField
          required
          label="Nguồn cung cấp"
          defaultValue={item.provider}
          placeholder="Nhập nguồn cung cấp"
          error={!!errorTexts.providerField}
          helperText={errorTexts.providerField}
          onChange={updateProvider}
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
          value={item.unit?.id || ''}
          error={!!errorTexts.unitField}
          helperText={errorTexts.unitField}
          onChange={updateUnit}
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

interface ValidationErrorText {
  nameField: string;
  providerField: string;
  unitField: string;
}
