import {
  Box,
  Container,
  createStyles,
  Divider,
  makeStyles,
  Theme,
} from '@material-ui/core';
import React, { ReactElement } from 'react';
import { AddMenuButton } from './components/AddMenuButton';
import { MenuBox } from './components/MenuBox';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    headingLine: {
      width: '30%',
      margin: '0px 50px',
    },
  }),
);

export const PartyPage = (): ReactElement => {
  const classes = useStyles();

  return (
    <Container>
      <h1>Tạo tiệc</h1>
      <Box
        height="100"
        display="flex"
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
      >
        <Divider className={classes.headingLine}></Divider>
        <h1>Thực đơn</h1>
        <Divider className={classes.headingLine}></Divider>
      </Box>

      <Box
        display="flex"
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
      >
        <MenuBox></MenuBox>
        <AddMenuButton></AddMenuButton>
      </Box>
    </Container>
  );
};
