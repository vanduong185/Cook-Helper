import React, { ReactElement } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import {
  Paper,
  TextField,
  Divider,
  Box,
  MenuItem,
  Button,
  IconButton,
} from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { addItem, updateItem } from '../ItemSlice';
import { ItemDTO } from '../../../dto/ItemDTO';
import { getUnits } from '../../units/UnitSlice';
import { AppState } from '../../../store/store';
import { Close } from '@material-ui/icons';
import { Autocomplete } from '@material-ui/lab';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      width: '750px',
      height: '550px',
      padding: theme.spacing(2, 4, 3),
      overflow: 'auto',
      position: 'relative',
    },
    closeButton: {
      position: 'absolute',
      top: 10,
      right: 10,
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
  const itemsData = useSelector((state: AppState) => state.items);
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

  const updateName = (
    event: React.ChangeEvent<HTMLInputElement>,
    value: string,
  ): void => {
    const tmpItem: ItemDTO = {
      ...item,
      name: value,
    };
    setItem(tmpItem);

    const tmpErrorTexts: ValidationErrorText = {
      ...errorTexts,
      nameField: undefined,
    };
    setErrorTexts(tmpErrorTexts);
  };

  const updateProvider = (
    event: React.ChangeEvent<HTMLInputElement>,
    value: string,
  ): void => {
    const tmpItem: ItemDTO = {
      ...item,
      provider: value,
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

  const getUniqueProviders = (items: ItemDTO[]): string[] => {
    const providers = items.map((itemData): string => itemData.provider);
    return providers.filter((p, i, arr) => arr.indexOf(p) === i);
  };

  return (
    <Paper className={classes.paper}>
      <IconButton className={classes.closeButton} onClick={props.onClose}>
        <Close />
      </IconButton>
      <h1>{props.isEdit ? 'Sửa nguyên liệu' : 'Thêm nguyên liệu mới'}</h1>
      <Divider></Divider>
      <Box my="30px">
        <Autocomplete
          freeSolo
          disableClearable
          options={itemsData.map((itemData): string => itemData.name)}
          defaultValue={props.item?.name || ''}
          inputValue={item.name || ''}
          onInputChange={updateName}
          renderInput={(params): ReactElement => (
            <TextField
              {...params}
              required
              label="Tên nguyên liệu"
              placeholder="Nhập tên nguyên liệu"
              error={!!errorTexts.nameField}
              helperText={errorTexts.nameField}
              variant="outlined"
            />
          )}
          style={{
            width: 350,
          }}
        />
      </Box>

      <Box my="30px">
        <Autocomplete
          freeSolo
          disableClearable
          options={getUniqueProviders(itemsData)}
          defaultValue={props.item?.provider || ''}
          inputValue={item.provider || ''}
          onInputChange={updateProvider}
          renderInput={(params): ReactElement => (
            <TextField
              {...params}
              required
              label="Nguồn cung cấp"
              placeholder="Nhập nguồn cung cấp"
              error={!!errorTexts.providerField}
              helperText={errorTexts.providerField}
              variant="outlined"
            />
          )}
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
