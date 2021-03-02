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
import { addTool, updateTool } from '../ToolSlice';
import { ToolDTO } from '../../../dto/ToolDTO';
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
  tool?: ToolDTO;
  isEdit?: boolean;
}

export const ToolEdit = (props: Props): ReactElement => {
  const classes = useStyles();
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(getUnits());
  }, [dispatch]);

  const unitsData = useSelector((state: AppState) => state.units);
  const toolsData = useSelector((state: AppState) => state.tools);

  const initTool: ToolDTO = props.tool || {
    id: undefined,
    name: undefined,
    size: undefined,
    unit: undefined,
  };

  const [tool, setTool] = React.useState<ToolDTO>(initTool);
  const [errorTexts, setErrorTexts] = React.useState<ValidationErrorText>({
    nameField: undefined,
    unitField: undefined,
  });

  const hanleCreateTool = (): void => {
    const isValid = validateToolData();
    if (!isValid) {
      return;
    }

    dispatch(addTool(tool));
    props.onClose();
  };

  const handleUpdateTool = (): void => {
    const isValid = validateToolData();
    if (!isValid) {
      return;
    }

    dispatch(updateTool(tool));
    props.onClose();
  };

  const validateToolData = (): boolean => {
    const errorsTmp = { ...errorTexts };
    let isValid = true;

    if (!tool.name || tool.name.length <= 0) {
      errorsTmp.nameField = 'Không được để trống';
      isValid = false;
    }

    if (!tool.unit) {
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
    const tmpTool: ToolDTO = {
      ...tool,
      name: value,
    };
    setTool(tmpTool);

    const tmpErrorTexts: ValidationErrorText = {
      ...errorTexts,
      nameField: undefined,
    };
    setErrorTexts(tmpErrorTexts);
  };

  const updateSize = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const tmpTool: ToolDTO = {
      ...tool,
      size: event.target.value,
    };
    setTool(tmpTool);
  };

  const updateUnit = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const unitId = +event.target.value;
    const unit = unitsData.find((u) => u.id === unitId);
    const tmpTool: ToolDTO = {
      ...tool,
      unit,
    };
    setTool(tmpTool);

    const tmpErrorTexts: ValidationErrorText = {
      ...errorTexts,
      unitField: undefined,
    };
    setErrorTexts(tmpErrorTexts);
  };

  return (
    <Paper className={classes.paper}>
      <IconButton className={classes.closeButton} onClick={props.onClose}>
        <Close />
      </IconButton>
      <h1>{props.isEdit ? 'Sửa dụng cụ' : 'Thêm dụng cụ mới'}</h1>
      <Divider></Divider>
      <Box my="30px">
        <Autocomplete
          freeSolo
          disableClearable
          options={toolsData.map((toolData): string => toolData.name)}
          defaultValue={props.tool?.name || ''}
          inputValue={tool.name || ''}
          onInputChange={updateName}
          renderInput={(params): ReactElement => (
            <TextField
              {...params}
              required
              label="Tên dụng cụ"
              placeholder="Nhập tên dụng cụ"
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
        <TextField
          label="Kích cỡ"
          defaultValue={tool.size}
          placeholder="Nhập kích cỡ"
          onChange={updateSize}
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
          value={tool.unit?.id || ''}
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
          onClick={props.isEdit ? handleUpdateTool : hanleCreateTool}
        >
          {props.isEdit ? 'Lưu' : 'Thêm'}
        </Button>
      </Box>
    </Paper>
  );
};

interface ValidationErrorText {
  nameField: string;
  unitField: string;
}
