import {
  Box,
  Button,
  Container,
  createStyles,
  Divider,
  makeStyles,
  Modal,
} from '@material-ui/core';
import { ArrowForward, Replay } from '@material-ui/icons';
import React, { ReactElement } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { ConfirmDeleteDialog } from '../../components/commons/ConfirmDeleteDialog';
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
  const [openConfirmDeleteDialog, setOpenConfirmDeleteDialog] = React.useState(
    false,
  );
  const [openConfirmResetDialog, setOpenConfirmResetDialog] = React.useState(
    false,
  );
  const [selectedMenu, setSelectedMenu] = React.useState<MenuDTO>(undefined);
  const [selectedIndexMenu, setSelectedIndexMenu] = React.useState<number>(
    undefined,
  );

  const dispatch = useDispatch();

  const partyMenus = useSelector((state: AppState) => state.partyMenus);

  const showEditMenuModal = (menu?: MenuDTO, index?: number): void => {
    setSelectedIndexMenu(index);
    setSelectedMenu(menu);
    setOpenEditModal(true);
  };

  const closeEditMenuModal = (): void => {
    setOpenEditModal(false);
    setSelectedMenu(undefined);
    setSelectedIndexMenu(undefined);
  };

  const showDeleteModal = (indexMenu: number): void => {
    setSelectedIndexMenu(indexMenu);
    setOpenConfirmDeleteDialog(true);
  };

  const closeDeleteModal = (): void => {
    setOpenConfirmDeleteDialog(false);
    setSelectedIndexMenu(undefined);
  };

  const handleRemoveMenu = (index: number): void => {
    dispatch(removeMenuFromParty(index));
  };

  const showResetModal = (): void => {
    if (!partyMenus || partyMenus.length <= 0) {
      return;
    }
    setOpenConfirmResetDialog(true);
  };

  const closeResetModal = (): void => {
    setOpenConfirmResetDialog(false);
  };

  const handleResetParty = (): void => {
    dispatch(resetMenuFromParty());
  };

  const handleShowStats = (): void => {
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
              showDeleteModal(index);
            }}
            onClick={(): void => {
              showEditMenuModal(menu, index);
            }}
          ></MenuBox>
        ))}
        <AddMenuButton
          onClick={(): void => {
            showEditMenuModal();
          }}
        ></AddMenuButton>
      </Box>

      <Box display="flex" flexDirection="row" justifyContent="center" my="50px">
        <Button
          variant="outlined"
          color="primary"
          style={{ margin: '0px 15px' }}
          onClick={showResetModal}
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
        onClose={closeEditMenuModal}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        disableBackdropClick
      >
        <>
          <MenuEdit
            onClose={closeEditMenuModal}
            indexMenu={selectedIndexMenu}
            menu={selectedMenu}
            isEdit={!!selectedMenu}
          ></MenuEdit>
        </>
      </Modal>
      <ConfirmDeleteDialog
        title={'Xác nhận xóa thực đơn này?'}
        open={openConfirmDeleteDialog}
        onClose={(): void => {
          closeDeleteModal();
        }}
        onConfirm={(): void => {
          handleRemoveMenu(selectedIndexMenu);
          closeDeleteModal();
        }}
      ></ConfirmDeleteDialog>
      <ConfirmDeleteDialog
        title={'Xác nhận xóa tất cả thực đơn và tạo lại?'}
        open={openConfirmResetDialog}
        onClose={(): void => {
          closeResetModal();
        }}
        onConfirm={(): void => {
          handleResetParty();
          closeResetModal();
        }}
      ></ConfirmDeleteDialog>
    </Container>
  );
};
