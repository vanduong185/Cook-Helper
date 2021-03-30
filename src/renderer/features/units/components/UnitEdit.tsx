import React, { ReactElement } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import {
  Paper,
  TextField,
  Divider,
  Box,
  Button,
  IconButton,
} from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { Autocomplete } from '@material-ui/lab';
import { addUnit, updateUnit, getUnits } from '../UnitSlice';
import { UnitDTO } from '../../../dto/UnitDTO';
import { AppState } from '../../../store/store';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      width: '750px',
      height: '330px',
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
  unit?: UnitDTO;
  isEdit?: boolean;
}

export const UnitEdit = (props: Props): ReactElement => {
  const classes = useStyles();
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(getUnits());
  }, [dispatch]);

  const unitsData = useSelector((state: AppState) => state.units);

  const initUnit: UnitDTO = props.unit || {
    id: undefined,
    name: undefined,
  };

  const [unit, setUnit] = React.useState<UnitDTO>(initUnit);
  const [errorTexts, setErrorTexts] = React.useState<ValidationErrorText>({
    nameField: undefined,
  });

  const hanleCreateUnit = (): void => {
    const isValid = validateUnitData();
    if (!isValid) {
      return;
    }

    dispatch(addUnit(unit));
    props.onClose();
  };

  const handleUpdateUnit = (): void => {
    const isValid = validateUnitData();
    if (!isValid) {
      return;
    }

    dispatch(updateUnit(unit));
    props.onClose();
  };

  const validateUnitData = (): boolean => {
    const errorsTmp = { ...errorTexts };
    let isValid = true;

    if (!unit.name || unit.name.length <= 0) {
      errorsTmp.nameField = 'Không được để trống';
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
    const tmpUnit: UnitDTO = {
      ...unit,
      name: value,
    };
    setUnit(tmpUnit);

    const tmpErrorTexts: ValidationErrorText = {
      ...errorTexts,
      nameField: undefined,
    };
    setErrorTexts(tmpErrorTexts);
  };

  return (
    <Paper className={classes.paper}>
      <IconButton className={classes.closeButton} onClick={props.onClose}>
        <Close />
      </IconButton>
      <h1>{props.isEdit ? 'Sửa đơn vị' : 'Thêm đơn vị mới'}</h1>
      <Divider></Divider>
      <Box my="30px">
        <Autocomplete
          freeSolo
          disableClearable
          options={unitsData.map((unitData): string => unitData.name)}
          defaultValue={props.unit?.name || ''}
          inputValue={unit.name || ''}
          onInputChange={updateName}
          renderInput={(params): ReactElement => (
            <TextField
              {...params}
              required
              label="Tên đơn vị"
              placeholder="Nhập tên đơn vị"
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

      <Box mt="60px" display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          color="primary"
          onClick={props.isEdit ? handleUpdateUnit : hanleCreateUnit}
        >
          {props.isEdit ? 'Lưu' : 'Thêm'}
        </Button>
      </Box>
    </Paper>
  );
};

interface ValidationErrorText {
  nameField: string;
}
