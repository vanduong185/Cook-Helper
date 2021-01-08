import {
  Box,
  Button,
  Container,
  createStyles,
  Divider,
  makeStyles,
  Modal,
  Theme,
} from '@material-ui/core';
import { ArrowForward, Replay } from '@material-ui/icons';
import React, { ReactElement } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { MenuDTO } from '../../dto/MenuDTO';
import { AppState } from '../../store/store';
import { AddMenuButton } from './components/AddMenuButton';
import { MenuBox } from './components/MenuBox';
import { MenuEdit } from './components/MenuEdit';
import { removeMenuFromParty, resetMenuFromParty } from './PartySlice';

const useStyles = makeStyles(() =>
  createStyles({
    headingLine: {
      width: '30%',
      margin: '0px 50px',
    },
  }),
);

export const PartyPage = (): ReactElement => {
  const classes = useStyles();
  const history = useHistory();
  const [openEditModal, setOpenEditModal] = React.useState(false);
  const [selectedMenu, setSelectedMenu] = React.useState<MenuDTO>(undefined);
  const [selectedIndexMenu, setSelectedIndexMenu] = React.useState<number>(
    undefined,
  );

  const dispatch = useDispatch();

  const partyMenus = useSelector((state: AppState) => state.partyMenus);

  const handleOpenEditModal = (): void => {
    setOpenEditModal(true);
  };

  const handleCloseEditModal = (): void => {
    setOpenEditModal(false);
    setSelectedMenu(undefined);
    setSelectedIndexMenu(undefined);
  };

  const handleRemoveMenu = (index: number): void => {
    dispatch(removeMenuFromParty(index));
  };

  const handleClickMenu = (menu: MenuDTO, index: number): void => {
    setSelectedIndexMenu(index);
    setSelectedMenu(menu);
    setOpenEditModal(true);
  };

  const handleResetParty = (): void => {
    dispatch(resetMenuFromParty());
  };

  const handleShowStats = (): void => {
    console.log('show');
    history.push('/party-stats');
  };

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
        flexWrap="wrap"
      >
        {partyMenus.map((menu, index) => (
          <MenuBox
            key={index}
            menu={menu}
            onRemoveClick={(): void => {
              handleRemoveMenu(index);
            }}
            onClick={(): void => {
              handleClickMenu(menu, index);
            }}
          ></MenuBox>
        ))}
        <AddMenuButton onClick={handleOpenEditModal}></AddMenuButton>
      </Box>

      <Box
        display="flex"
        flexDirection="row"
        justifyContent="flex-end"
        my="50px"
      >
        <Button
          variant="outlined"
          color="primary"
          style={{ margin: '0px 15px' }}
          onClick={handleResetParty}
        >
          <Replay></Replay>
          Tạo lại
        </Button>
        <Button
          variant="contained"
          color="primary"
          style={{ margin: '0px 15px' }}
          disabled={partyMenus.length <= 0}
          onClick={handleShowStats}
        >
          Xem thống kê nguyên liệu
          <ArrowForward></ArrowForward>
        </Button>
      </Box>

      <Modal
        id="edit-menu-modal"
        open={openEditModal}
        onClose={handleCloseEditModal}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <>
          <MenuEdit
            onClose={handleCloseEditModal}
            indexMenu={selectedIndexMenu}
            menu={selectedMenu}
            isEdit={!!selectedMenu}
          ></MenuEdit>
        </>
      </Modal>
    </Container>
  );
};
