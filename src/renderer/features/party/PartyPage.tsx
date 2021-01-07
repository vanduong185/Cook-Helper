import {
  Box,
  Container,
  createStyles,
  Divider,
  makeStyles,
  Modal,
  Theme,
} from '@material-ui/core';
import React, { ReactElement } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MenuDTO } from '../../dto/MenuDTO';
import { AppState } from '../../store/store';
import { AddMenuButton } from './components/AddMenuButton';
import { MenuBox } from './components/MenuBox';
import { MenuEdit } from './components/MenuEdit';
import { removeMenuFromParty } from './PartySlice';

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
