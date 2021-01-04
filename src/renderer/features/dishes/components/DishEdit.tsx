import React, { ReactElement } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { Paper, Divider, Box, TextField, MenuItem } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      width: '80%',
      height: '80%',
      padding: theme.spacing(2, 4, 3),
      overflow: 'auto',
    },
  }),
);

interface Props {
  onClose: () => void;
  isEdit?: boolean;
}

export const DishEdit = (props: Props): ReactElement => {
  const classes = useStyles();

  return (
    <Paper className={classes.paper}>
      <h1>Thêm món ăn mới</h1>
      <Divider></Divider>
      <Box display="flex" flexDirection="row">
        <Box my="30px" mr="30px">
          <TextField
            required
            id="outlined-required"
            label="Tên món ăn"
            placeholder="Nhập tên món ăn"
            variant="outlined"
            style={{
              width: 250,
            }}
          />
        </Box>

        <Box my="30px" mr="30px">
          <TextField
            required
            id="outlined-required"
            label="Nguyên liệu chính"
            placeholder="Nhập tên nguyên liệu"
            variant="outlined"
            style={{
              width: 200,
            }}
          />
        </Box>

        <Box my="30px" mr="30px">
          <TextField
            required
            select
            id="outlined-required"
            label="Cách chế biến"
            defaultValue={1}
            variant="outlined"
            style={{
              width: 200,
            }}
          >
            {unitsData.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        <Box my="30px" mr="30px">
          <TextField
            required
            id="outlined-required"
            label="Giá"
            placeholder="Nhập giá"
            variant="outlined"
            style={{
              width: 200,
            }}
          />
        </Box>
      </Box>
    </Paper>
  );
};

const unitsData = [
  {
    id: 1,
    name: 'xao',
  },
  {
    id: 2,
    name: 'hap',
  },
  {
    id: 3,
    name: 'chien',
  },
  {
    id: 4,
    name: 'xao',
  },
  {
    id: 5,
    name: 'hap',
  },
  {
    id: 6,
    name: 'chien',
  },
  {
    id: 7,
    name: 'xao',
  },
  {
    id: 8,
    name: 'hap',
  },
  {
    id: 9,
    name: 'chien',
  },
];
