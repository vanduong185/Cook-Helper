import React, { ReactElement } from 'react';
import { Container, Box, Button, Modal, IconButton } from '@material-ui/core';
import { DataGrid, CellParams } from '@material-ui/data-grid';
import { Add, Edit, Delete } from '@material-ui/icons';
import { ItemEdit } from './components/ItemEdit';
import { useDispatch, useSelector } from 'react-redux';
import { deleteItem, getItems } from './ItemSlice';
import { AppState } from '../../store/store';
import { UnitDTO } from '../../dto/UnitDTO';
import { ItemDTO } from '../../dto/ItemDTO';

export const ItemPage = (): ReactElement => {
  const [openEditModal, setOpenEditModal] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<ItemDTO>();

  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(getItems());
  }, [dispatch]);

  const items = useSelector((state: AppState) => state.items);

  const handleOpenEditModal = (): void => {
    setOpenEditModal(true);
  };

  const handleCloseEditModal = (): void => {
    setOpenEditModal(false);
    setSelectedItem(undefined);
  };

  const handleEditClick = (itemId: number): void => {
    const item = items.find((i) => i.id === itemId);
    setSelectedItem(item);
    setOpenEditModal(true);
  };

  const handleDeleteClick = (itemId: number): void => {
    const item = items.find((i) => i.id === itemId);
    dispatch(deleteItem(item));
  };

  return (
    <Container>
      <h1>Quản lý nguyên liệu</h1>
      <Box display="flex" justifyContent="flex-end" my="20px">
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenEditModal}
        >
          <Add></Add>
          Thêm nguyên liệu
        </Button>
      </Box>
      <div style={{ height: 650, width: '100%' }}>
        <DataGrid
          rows={items}
          columns={[
            {
              field: 'seq',
              headerName: 'STT',
              width: 100,
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
              width: 150,
              renderCell: (params: CellParams): ReactElement => {
                return (
                  <Box display="flex" flexDirection="row">
                    <IconButton
                      onClick={(): void => {
                        handleEditClick(params.row.id as number);
                      }}
                    >
                      <Edit color="primary" fontSize="small"></Edit>
                    </IconButton>
                    <IconButton
                      onClick={(): void => {
                        handleDeleteClick(params.row.id as number);
                      }}
                    >
                      <Delete color="secondary" fontSize="small"></Delete>
                    </IconButton>
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
        onClose={handleCloseEditModal}
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
            onClose={handleCloseEditModal}
            item={selectedItem}
            isEdit={!!selectedItem}
          ></ItemEdit>
        </>
      </Modal>
    </Container>
  );
};
