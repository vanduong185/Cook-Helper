import React, { ReactElement } from 'react';
import { Container, Box, Button, Modal } from '@material-ui/core';
import { DataGrid, CellParams } from '@material-ui/data-grid';
import { Add } from '@material-ui/icons';
import { ItemEdit } from './components/ItemEdit';
import { useDispatch, useSelector } from 'react-redux';
import { deleteItem, getItems } from './ItemSlice';
import { AppState } from '../../store/store';
import { UnitDTO } from '../../dto/UnitDTO';
import { ItemDTO } from '../../dto/ItemDTO';
import { ActionButton } from '../../components/commons/ActionButton';
import { ConfirmDeleteDialog } from '../../components/commons/ConfirmDeleteDialog';
import { GRID_DEFAULT_LOCALE_TEXT } from '../../constants/AppConst';

export const ItemPage = (): ReactElement => {
  const [openEditModal, setOpenEditModal] = React.useState(false);
  const [openConfirmDeleteDialog, setOpenConfirmDeleteDialog] = React.useState(
    false,
  );
  const [selectedItem, setSelectedItem] = React.useState<ItemDTO>();

  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(getItems());
  }, [dispatch]);

  const items = useSelector((state: AppState) => state.items);

  const showEditModal = (item: ItemDTO): void => {
    setSelectedItem(item);
    setOpenEditModal(true);
  };

  const closeEditModal = (): void => {
    setOpenEditModal(false);
    setSelectedItem(undefined);
  };

  const showDeleteModal = (item: ItemDTO): void => {
    setSelectedItem(item);
    setOpenConfirmDeleteDialog(true);
  };

  const closeDeleteModal = (): void => {
    setOpenConfirmDeleteDialog(false);
    setSelectedItem(undefined);
  };

  const handleDeleteItem = (item: ItemDTO): void => {
    dispatch(deleteItem(item));
  };

  return (
    <Container>
      <h1>Quản lý nguyên liệu</h1>
      <Box display="flex" justifyContent="flex-end" my="20px">
        <Button
          variant="contained"
          color="primary"
          onClick={(): void => {
            showEditModal(undefined);
          }}
        >
          <Add></Add>
          Thêm nguyên liệu
        </Button>
      </Box>
      <div style={{ height: 650, width: '100%' }}>
        <DataGrid
          localeText={GRID_DEFAULT_LOCALE_TEXT}
          hideFooterSelectedRowCount
          rows={items}
          columns={[
            {
              field: 'seq',
              headerName: 'STT',
              width: 80,
              valueFormatter: (params: CellParams): string => {
                return `${params.rowIndex + 1}`;
              },
            },
            { field: 'name', headerName: 'Tên', width: 250 },
            { field: 'provider', headerName: 'Nơi cung cấp', width: 250 },
            {
              field: 'unit',
              headerName: 'Đơn vị',
              width: 100,
              valueFormatter: (params: CellParams): string => {
                const unit = params.value as UnitDTO;
                return unit?.name;
              },
            },
            {
              field: 'action',
              headerName: ' ',
              sortable: false,
              disableColumnMenu: true,
              width: 80,
              renderCell: (params: CellParams): ReactElement => {
                return (
                  <Box display="flex" flexDirection="row">
                    <ActionButton
                      onEditClick={(): void => {
                        showEditModal(params.row as ItemDTO);
                      }}
                      onDeleteClick={(): void => {
                        showDeleteModal(params.row as ItemDTO);
                      }}
                    ></ActionButton>
                  </Box>
                );
              },
            },
          ]}
          pageSize={10}
        />
      </div>
      <Modal
        id="add-modal"
        open={openEditModal}
        onClose={closeEditModal}
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
          <ItemEdit
            onClose={closeEditModal}
            item={selectedItem}
            isEdit={!!selectedItem}
          ></ItemEdit>
        </>
      </Modal>
      <ConfirmDeleteDialog
        title={'Xác nhận xóa nguyên liệu này?'}
        open={openConfirmDeleteDialog}
        onClose={(): void => {
          closeDeleteModal();
        }}
        onConfirm={(): void => {
          handleDeleteItem(selectedItem);
          closeDeleteModal();
        }}
      ></ConfirmDeleteDialog>
    </Container>
  );
};
