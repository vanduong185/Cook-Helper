import React, { ReactElement } from 'react';
import {
  Box,
  Button,
  Container,
  createStyles,
  Divider,
  makeStyles,
  MenuItem,
  TextField,
  Theme,
} from '@material-ui/core';
import { ArrowBack } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AppState } from '../../store/store';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    labelBig: {
      fontSize: 18,
      fontWeight: 600,
      marginRight: '30px',
    },
  }),
);

export const PartyStatsPage = (): ReactElement => {
  const classes = useStyles();
  const history = useHistory();

  const partyMenus = useSelector((state: AppState) => state.partyMenus);

  const handleGoBack = (): void => {
    history.goBack();
  };

  return (
    <Container>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex" alignItems="center">
          <Button
            variant="text"
            color="primary"
            style={{
              height: 40,
              marginRight: 15,
            }}
            onClick={handleGoBack}
          >
            <ArrowBack></ArrowBack>
            Quay lại
          </Button>
          <h1>Thống kê nguyên liệu</h1>
        </Box>
        <Button
          variant="contained"
          color="primary"
          style={{
            height: 40,
          }}
        >
          Xuất Excel
        </Button>
      </Box>
      <Divider></Divider>

      <Box display="flex" alignItems="center" my="30px">
        <span className={classes.labelBig}>Thống kê theo</span>
        <TextField
          select
          id="menu-select"
          variant="outlined"
          defaultValue={-1}
          style={{
            width: 300,
          }}
        >
          <MenuItem key={-1} value={-1}>
            Tất cả thực đơn
          </MenuItem>
          {partyMenus.map((menu, index) => (
            <MenuItem key={index} value={index}>
              {menu.name}
            </MenuItem>
          ))}
        </TextField>
      </Box>
    </Container>
  );
};
