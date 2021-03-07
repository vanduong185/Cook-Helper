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
import { addCookType, updateCookType, getCookTypes } from '../CookTypeSlice';
import { CookTypeDTO } from '../../../dto/CookTypeDTO';
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
  cookType?: CookTypeDTO;
  isEdit?: boolean;
}

export const CookTypeEdit = (props: Props): ReactElement => {
  const classes = useStyles();
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(getCookTypes());
  }, [dispatch]);

  const cookTypesData = useSelector((state: AppState) => state.cookTypes);

  const initCookType: CookTypeDTO = props.cookType || {
    id: undefined,
    name: undefined,
  };

  const [cookType, setCookType] = React.useState<CookTypeDTO>(initCookType);
  const [errorTexts, setErrorTexts] = React.useState<ValidationErrorText>({
    nameField: undefined,
  });

  const hanleCreateCookType = (): void => {
    const isValid = validateCookTypeData();
    if (!isValid) {
      return;
    }

    dispatch(addCookType(cookType));
    props.onClose();
  };

  const handleUpdateCookType = (): void => {
    const isValid = validateCookTypeData();
    if (!isValid) {
      return;
    }

    dispatch(updateCookType(cookType));
    props.onClose();
  };

  const validateCookTypeData = (): boolean => {
    const errorsTmp = { ...errorTexts };
    let isValid = true;

    if (!cookType.name || cookType.name.length <= 0) {
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
    const tmpCookType: CookTypeDTO = {
      ...cookType,
      name: value,
    };
    setCookType(tmpCookType);

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
      <h1>{props.isEdit ? 'Sửa cách chế biến' : 'Thêm cách chế biến mới'}</h1>
      <Divider></Divider>
      <Box my="30px">
        <Autocomplete
          freeSolo
          disableClearable
          options={cookTypesData.map(
            (cookTypeData): string => cookTypeData.name,
          )}
          defaultValue={props.cookType?.name || ''}
          inputValue={cookType.name || ''}
          onInputChange={updateName}
          renderInput={(params): ReactElement => (
            <TextField
              {...params}
              required
              label="Tên cách chế biến"
              placeholder="Nhập tên cách chế biến"
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
          onClick={props.isEdit ? handleUpdateCookType : hanleCreateCookType}
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
