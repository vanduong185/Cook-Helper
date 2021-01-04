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
import { addTool, updateTool } from '../ToolSlice';
import { ToolDTO } from '../../../dto/ToolDTO';
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

  const initTool: ToolDTO = props.tool || {
    id: undefined,
    name: '',
    size: '',
    unit: {
      id: undefined,
      name: undefined,
    },
  };

  const [tool, setTool] = React.useState<ToolDTO>(initTool);

  const hanleCreateTool = (): void => {
    dispatch(addTool(tool));
    props.onClose();
  };

  const handleUpdateTool = (): void => {
    dispatch(updateTool(tool));
    props.onClose();
  };

  return (
    <Paper className={classes.paper}>
      <h1>{props.isEdit ? 'Sửa dụng cụ' : 'Thêm dụng cụ mới'}</h1>
      <Divider></Divider>
      <Box my="30px">
        <TextField
          required
          id="outlined-required"
          label="Tên dụng cụ"
          defaultValue={tool.name}
          placeholder="Nhập tên dụng cụ"
          onChange={(event): void => {
            const tmpTool: ToolDTO = {
              ...tool,
              name: event.target.value,
            };
            setTool(tmpTool);
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
          label="Kích cỡ"
          defaultValue={tool.size}
          placeholder="Nhập kích cỡ"
          onChange={(event): void => {
            const tmpTool: ToolDTO = {
              ...tool,
              size: event.target.value,
            };
            setTool(tmpTool);
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
          value={tool.unit.id || ''}
          onChange={(event): void => {
            const unitId = +event.target.value;
            const unit = unitsData.find((u) => u.id === unitId);
            const tmpTool: ToolDTO = {
              ...tool,
              unit,
            };
            setTool(tmpTool);
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
          onClick={props.isEdit ? handleUpdateTool : hanleCreateTool}
        >
          {props.isEdit ? 'Lưu' : 'Thêm'}
        </Button>
      </Box>
    </Paper>
  );
};